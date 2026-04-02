export interface SendEmailInput {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail(_input: SendEmailInput): Promise<void> {
  throw new Error('Gmail API integration not implemented yet.');
}
