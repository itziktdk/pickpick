export interface PasskeyCredential {
  credentialID: string;
  credentialPublicKey: string; // base64
  counter: number;
  transports?: AuthenticatorTransport[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  phone?: string;
  address?: string;
  joinDate: string;
  lastActive: string;
  packageCount: number;
  gmailConnected: boolean;
  passkeys?: PasskeyCredential[];
  createdAt: string;
}
