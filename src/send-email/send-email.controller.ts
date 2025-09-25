import { Body, Controller, Post } from '@nestjs/common';
import { SendEmailService } from './send-email.service';

@Controller('send-email')
export class SendEmailController {
  constructor(private readonly sendEmailService: SendEmailService) {}

  @Post()
  sendEmail(@Body() body: { to: string; subject: string; html: string }) {
    return this.sendEmailService.sendEmail(body);
  }
}
