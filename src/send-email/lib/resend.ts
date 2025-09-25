import { Injectable } from '@nestjs/common';
import { Resend } from 'resend';

@Injectable()
export class ResendEmailService {
  private readonly resend: Resend;

  constructor() {
    this.resend = new Resend(process.env.RESEND_KEY);
  }

  async sendEmail(body: { to: string; subject: string; html: string }) {
    const { data, error } = await this.resend.emails.send({
      from: 'Acme <onboarding@resend.dev>',
      to: body.to,
      subject: body.subject,
      html: body.html,
    });

    if (error) {
      throw new Error(`Failed to send email: ${error.message}`);
    }

    return data;
  }
}
