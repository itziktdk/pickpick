import { NextRequest, NextResponse } from 'next/server';
import { generateAuthenticationOptions } from '@simplewebauthn/server';
import { userRepository } from '@/lib/db/repositories/user-repository';
import { rpID } from '@/lib/webauthn-config';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ error: 'אימייל נדרש' }, { status: 400 });
    }

    const users = await userRepository.findBy(u => u.email === email);
    if (users.length === 0 || !users[0].passkeys?.length) {
      return NextResponse.json({ error: 'לא נמצאו Passkeys' }, { status: 404 });
    }

    const user = users[0];

    const options = await generateAuthenticationOptions({
      rpID,
      allowCredentials: user.passkeys!.map(pk => ({
        id: pk.credentialID,
        transports: pk.transports,
      })),
      userVerification: 'preferred',
    });

    await userRepository.update(user.id, { currentChallenge: options.challenge });

    return NextResponse.json(options);
  } catch (error) {
    console.error('Passkey login options error:', error);
    return NextResponse.json({ error: 'שגיאה' }, { status: 500 });
  }
}
