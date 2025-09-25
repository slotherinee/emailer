import { Injectable } from '@nestjs/common';
import { ResendEmailService } from './lib/resend';

@Injectable()
export class SendEmailService {
  constructor(private readonly resendEmailService: ResendEmailService) {}

  sendEmail(body: { to: string; subject: string; html: string }) {
    const data = this.resendEmailService.sendEmail(body);
    return { message: 'Email sent successfully', data };
  }
}
