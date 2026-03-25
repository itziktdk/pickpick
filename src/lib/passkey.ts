import { startRegistration, startAuthentication } from '@simplewebauthn/browser';

export async function registerPasskey(token: string): Promise<boolean> {
  try {
    const optionsRes = await fetch('/api/auth/passkey/register-options', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!optionsRes.ok) return false;
    const options = await optionsRes.json();

    const regResponse = await startRegistration({ optionsJSON: options });

    const verifyRes = await fetch('/api/auth/passkey/register-verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(regResponse),
    });

    const result = await verifyRes.json();
    return result.verified === true;
  } catch (error) {
    console.error('Passkey registration error:', error);
    return false;
  }
}

export async function loginWithPasskey(email: string): Promise<{ token: string; user: any } | null> {
  try {
    const optionsRes = await fetch('/api/auth/passkey/login-options', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    if (!optionsRes.ok) return null;
    const options = await optionsRes.json();

    const authResponse = await startAuthentication({ optionsJSON: options });

    const verifyRes = await fetch('/api/auth/passkey/login-verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, response: authResponse }),
    });

    if (!verifyRes.ok) return null;
    return await verifyRes.json();
  } catch (error) {
    console.error('Passkey login error:', error);
    return null;
  }
}

export function isPasskeySupported(): boolean {
  return (
    typeof window !== 'undefined' &&
    typeof PublicKeyCredential !== 'undefined' &&
    typeof PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable === 'function'
  );
}
