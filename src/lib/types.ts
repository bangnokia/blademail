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
  links: EmailLink[];
  spamReport?: SpamReport;
  attachments?: Attachment[];
};

export interface Attachment {
 filename: string,
 content_type: string,
 data: string,
}

export type EmailLinkStatus = 'ok' | 'error' | 'pending'

export interface EmailLink {
  url: string,
  status: EmailLinkStatus
}

export interface SpamReport {
  report: string,
  score: number,
  rules: {
    score: number,
    description: string,
  }[]
}