import { NextRequest, NextResponse } from 'next/server';
import { generateRegistrationOptions } from '@simplewebauthn/server';
import { getAuthUser } from '@/lib/auth';
import { userRepository } from '@/lib/db/repositories/user-repository';
import { rpName, rpID } from '@/lib/webauthn-config';

export async function POST(req: NextRequest) {
  try {
    const auth = await getAuthUser(req);
    if (!auth) {
      return NextResponse.json({ error: 'לא מורשה' }, { status: 401 });
    }

    const user = await userRepository.findById(auth.userId);
    if (!user) {
      return NextResponse.json({ error: 'משתמש לא נמצא' }, { status: 404 });
    }

    const existingCreds = (user.passkeys || []).map(pk => ({
      id: pk.credentialID,
      transports: pk.transports,
    }));

    const options = await generateRegistrationOptions({
      rpName,
      rpID,
      userName: user.email,
      userDisplayName: user.name,
      attestationType: 'none',
      excludeCredentials: existingCreds,
      authenticatorSelection: {
        residentKey: 'preferred',
        userVerification: 'preferred',
      },
    });

    await userRepository.update(user.id, { currentChallenge: options.challenge });

    return NextResponse.json(options);
  } catch (error) {
    console.error('Passkey register options error:', error);
    return NextResponse.json({ error: 'שגיאה ביצירת אפשרויות' }, { status: 500 });
  }
}
