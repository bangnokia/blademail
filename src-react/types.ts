export interface Email {
  id: string;
  raw: string;
  subject: string;
  from: [string, string][]; // author of message, not the sender
  sender: [string, string]; // [name, email]
  to: string[];
  cc?: string[];
  date: Date;
  html: string;
  text: string;
  excerpt: string;
  isOpen: boolean;
  links: EmailLink[]
};

export type EmailLinkStatus = 'ok' | 'error' | 'pending'
export interface EmailLink {
  url: string,
  status: EmailLinkStatus
}