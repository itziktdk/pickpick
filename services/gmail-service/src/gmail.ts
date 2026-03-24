import { google } from 'googleapis';
import { GmailTokens } from './types';

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

export function getAuthUrl(): string {
  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: [
      'https://www.googleapis.com/auth/gmail.readonly',
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile',
    ],
    prompt: 'consent',
  });
}

export async function getTokensFromCode(code: string): Promise<GmailTokens> {
  const { tokens } = await oauth2Client.getToken(code);
  return tokens as GmailTokens;
}

export async function getUserInfo(tokens: GmailTokens) {
  oauth2Client.setCredentials(tokens);
  const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
  const { data } = await oauth2.userinfo.get();
  return { email: data.email!, name: data.name || data.email! };
}

export interface GmailMessage {
  id: string;
  subject: string;
  from: string;
  body: string;
  date: string;
}

export async function fetchRecentEmails(tokens: GmailTokens, maxResults = 50): Promise<GmailMessage[]> {
  oauth2Client.setCredentials(tokens);
  const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

  // Search for package-related emails
  const query = [
    'subject:(חבילה OR משלוח OR הזמנה OR tracking OR shipped OR delivered OR delivery)',
    'OR from:(amazon OR aliexpress OR shein OR fedex OR dhl OR iherb OR israelpost OR דואר)',
  ].join(' ');

  const { data } = await gmail.users.messages.list({
    userId: 'me',
    q: query,
    maxResults,
  });

  if (!data.messages) return [];

  const messages: GmailMessage[] = [];
  for (const msg of data.messages) {
    try {
      const { data: full } = await gmail.users.messages.get({
        userId: 'me',
        id: msg.id!,
        format: 'full',
      });

      const headers = full.payload?.headers || [];
      const subject = headers.find((h) => h.name === 'Subject')?.value || '';
      const from = headers.find((h) => h.name === 'From')?.value || '';
      const date = headers.find((h) => h.name === 'Date')?.value || '';

      // Extract body text
      let body = '';
      if (full.payload?.body?.data) {
        body = Buffer.from(full.payload.body.data, 'base64').toString('utf-8');
      } else if (full.payload?.parts) {
        const textPart = full.payload.parts.find((p) => p.mimeType === 'text/plain');
        if (textPart?.body?.data) {
          body = Buffer.from(textPart.body.data, 'base64').toString('utf-8');
        }
      }

      messages.push({ id: msg.id!, subject, from, body, date });
    } catch {
      // Skip messages that fail to fetch
    }
  }

  return messages;
}
