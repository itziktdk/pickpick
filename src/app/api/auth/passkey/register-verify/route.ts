import { NextRequest, NextResponse } from 'next/server';
import { verifyRegistrationResponse } from '@simplewebauthn/server';
import { getAuthUser } from '@/lib/auth';
import { userRepository } from '@/lib/db/repositories/user-repository';
import { rpID, origin } from '@/lib/webauthn-config';
import { PasskeyCredential } from '@/types/user';

export async function POST(req: NextRequest) {
  try {
    const auth = await getAuthUser(req);
    if (!auth) {
      return NextResponse.json({ error: 'לא מורשה' }, { status: 401 });
    }

    const user = await userRepository.findById(auth.userId);
    if (!user || !user.currentChallenge) {
      return NextResponse.json({ error: 'אתגר לא נמצא' }, { status: 400 });
    }

    const body = await req.json();

    const verification = await verifyRegistrationResponse({
      response: body,
      expectedChallenge: user.currentChallenge,
      expectedOrigin: origin,
      expectedRPID: rpID,
    });

    if (!verification.verified || !verification.registrationInfo) {
      return NextResponse.json({ error: 'אימות נכשל' }, { status: 400 });
    }

    const { credential } = verification.registrationInfo;

    const newPasskey: PasskeyCredential = {
      credentialID: Buffer.from(credential.id).toString('base64url'),
      credentialPublicKey: Buffer.from(credential.publicKey).toString('base64'),
      counter: credential.counter,
      transports: body.response?.transports,
    };

    const passkeys = [...(user.passkeys || []), newPasskey];
    await userRepository.update(user.id, { passkeys, currentChallenge: undefined });

    return NextResponse.json({ verified: true, count: passkeys.length });
  } catch (error) {
    console.error('Passkey register verify error:', error);
    return NextResponse.json({ error: 'שגיאה באימות' }, { status: 500 });
  }
}
