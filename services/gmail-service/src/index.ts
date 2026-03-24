import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import { getAuthUrl, getTokensFromCode, getUserInfo, fetchRecentEmails } from './gmail';
import { parseEmails } from './parser';
import { UserRecord } from './types';

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';
const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || '').split(',').map((e) => e.trim());

app.use(cors({ origin: FRONTEND_URL, credentials: true }));
app.use(express.json());

// In-memory store (replace with DB in production)
const users = new Map<string, UserRecord>();

// Auth middleware
function authenticate(req: express.Request, res: express.Response, next: express.NextFunction) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const payload = jwt.verify(token, JWT_SECRET) as { userId: string; email: string };
    (req as any).userId = payload.userId;
    (req as any).userEmail = payload.email;
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

function adminOnly(req: express.Request, res: express.Response, next: express.NextFunction) {
  const email = (req as any).userEmail;
  if (!ADMIN_EMAILS.includes(email)) {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
}

// --- Auth Routes ---

app.post('/auth/google', (_req, res) => {
  const url = getAuthUrl();
  res.json({ url });
});

app.get('/auth/google/callback', async (req, res) => {
  try {
    const code = req.query.code as string;
    if (!code) return res.status(400).json({ error: 'Missing code' });

    const tokens = await getTokensFromCode(code);
    const userInfo = await getUserInfo(tokens);

    let user = Array.from(users.values()).find((u) => u.email === userInfo.email);
    if (!user) {
      user = {
        id: `u-${Date.now()}`,
        email: userInfo.email,
        name: userInfo.name,
        tokens,
        createdAt: new Date().toISOString(),
      };
      users.set(user.id, user);
    } else {
      user.tokens = tokens;
    }

    const jwtToken = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '30d' });
    res.redirect(`${FRONTEND_URL}/pickpick/settings?token=${jwtToken}&email=${encodeURIComponent(user.email)}`);
  } catch (err) {
    console.error('OAuth callback error:', err);
    res.status(500).json({ error: 'Authentication failed' });
  }
});

// --- Package Routes ---

app.get('/api/packages', authenticate, async (req, res) => {
  try {
    const user = users.get((req as any).userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const emails = await fetchRecentEmails(user.tokens);
    const packages = parseEmails(emails);
    res.json({ packages, totalScanned: emails.length });
  } catch (err) {
    console.error('Fetch packages error:', err);
    res.status(500).json({ error: 'Failed to fetch packages' });
  }
});

app.post('/api/packages/scan', authenticate, async (req, res) => {
  try {
    const user = users.get((req as any).userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const emails = await fetchRecentEmails(user.tokens, 100);
    const packages = parseEmails(emails);
    user.lastScan = new Date().toISOString();

    res.json({
      newPackages: packages,
      totalScanned: emails.length,
      scanDate: user.lastScan,
    });
  } catch (err) {
    console.error('Scan error:', err);
    res.status(500).json({ error: 'Scan failed' });
  }
});

// --- Admin Routes ---

app.get('/api/admin/users', authenticate, adminOnly, (_req, res) => {
  const allUsers = Array.from(users.values()).map((u) => ({
    id: u.id,
    email: u.email,
    name: u.name,
    createdAt: u.createdAt,
    lastScan: u.lastScan,
    gmailConnected: !!u.tokens.refresh_token,
  }));
  res.json({ users: allUsers });
});

app.get('/api/admin/stats', authenticate, adminOnly, (_req, res) => {
  const allUsers = Array.from(users.values());
  res.json({
    totalUsers: allUsers.length,
    totalPackages: 0, // Would come from DB
    activeToday: allUsers.filter((u) => {
      const lastScan = u.lastScan ? new Date(u.lastScan) : null;
      return lastScan && Date.now() - lastScan.getTime() < 24 * 60 * 60 * 1000;
    }).length,
  });
});

app.listen(PORT, () => {
  console.log(`🚀 PickPick Gmail Service running on port ${PORT}`);
});
