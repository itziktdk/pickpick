import { NextRequest, NextResponse } from 'next/server';
import { verifyAuthenticationResponse } from '@simplewebauthn/server';
import { userRepository } from '@/lib/db/repositories/user-repository';
import { signToken } from '@/lib/auth';
import { rpID, origin } from '@/lib/webauthn-config';

export async function POST(req: NextRequest) {
  try {
    const { email, response: authResponse } = await req.json();
    if (!email || !authResponse) {
      return NextResponse.json({ error: 'נתונים חסרים' }, { status: 400 });
    }

    const users = await userRepository.findBy(u => u.email === email);
    if (users.length === 0 || !users[0].currentChallenge) {
      return NextResponse.json({ error: 'אתגר לא נמצא' }, { status: 400 });
    }

    const user = users[0];
    const passkey = user.passkeys?.find(
      pk => pk.credentialID === authResponse.id
    );

    if (!passkey) {
      return NextResponse.json({ error: 'Passkey לא נמצא' }, { status: 400 });
    }

    const verification = await verifyAuthenticationResponse({
      response: authResponse,
      expectedChallenge: user.currentChallenge!,
      expectedOrigin: origin,
      expectedRPID: rpID,
      credential: {
        id: passkey.credentialID,
        publicKey: new Uint8Array(Buffer.from(passkey.credentialPublicKey, 'base64')),
        counter: passkey.counter,
        transports: passkey.transports,
      },
    });

    if (!verification.verified) {
      return NextResponse.json({ error: 'אימות נכשל' }, { status: 400 });
    }

    // Update counter
    const updatedPasskeys = user.passkeys!.map(pk =>
      pk.credentialID === passkey.credentialID
        ? { ...pk, counter: verification.authenticationInfo.newCounter }
        : pk
    );

    await userRepository.update(user.id, {
      passkeys: updatedPasskeys,
      currentChallenge: undefined,
      lastActive: new Date().toISOString(),
    });

    const token = await signToken({ userId: user.id, email: user.email, name: user.name });

    return NextResponse.json({
      token,
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error('Passkey login verify error:', error);
    return NextResponse.json({ error: 'שגיאה באימות' }, { status: 500 });
  }
}
