export interface ContactEmail {
  address: string;
  primary: boolean;
}

export interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  emails: ContactEmail[];
  phone: string | null;
  groupIds: string[];
  createdAt: Date;
}

export interface Group {
  id: string;
  name: string;
  description: string | null;
  createdAt: Date;
}

export interface QRCode {
  id: string;
  contactId: string;
  lastName: string;
  expiresAt: Date;
  createdAt: Date;
  emailSentAt: Date | null;
}

export interface AppSettings {
  appName: string;
  gmailEmail: string;
  gmailAccessToken: string;
  gmailRefreshToken: string;
  gmailTokenExpiry: Date;
}
