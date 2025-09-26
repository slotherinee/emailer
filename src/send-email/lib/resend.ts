import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateEmailResponseSuccess, ErrorResponse, Resend } from 'resend';

@Injectable()
export class ResendEmailService {
  private readonly resend: Resend;

  constructor() {
    this.resend = new Resend(process.env.RESEND_KEY);
  }

  async sendEmail(body: {
    to: string[];
    subject: string;
    html: string;
  }): Promise<CreateEmailResponseSuccess | ErrorResponse> {
    const { data, error } = await this.resend.emails.send({
      from: 'Acme <onboarding@resend.dev>',
      to: body.to,
      subject: body.subject,
      html: body.html,
    });

    if (error) {
      throw new HttpException('Failed to send email', HttpStatus.BAD_REQUEST);
    }

    return data;
  }
}
