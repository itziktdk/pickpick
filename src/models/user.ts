export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  passwordHash?: string;
  familyIds: string[];
  avatar?: string;
  address?: string;
  joinDate: string;
  lastActive: string;
  packageCount: number;
  gmailConnected: boolean;
  passkeys?: PasskeyCredential[];
  createdAt: string;
}

export interface PasskeyCredential {
  credentialID: string;
  credentialPublicKey: string;
  counter: number;
  transports?: AuthenticatorTransport[];
}
