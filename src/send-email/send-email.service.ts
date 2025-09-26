import { Injectable } from '@nestjs/common';
import { ResendEmailService } from './lib/resend';
import { CreateEmailDto } from './dto/create-email.dto';

@Injectable()
export class SendEmailService {
  constructor(private readonly resendEmailService: ResendEmailService) {}

  async sendEmail(body: CreateEmailDto) {
    return await this.resendEmailService.sendEmail(body);
  }
}
