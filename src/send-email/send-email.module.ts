import { Module } from '@nestjs/common';
import { SendEmailService } from './send-email.service';
import { SendEmailController } from './send-email.controller';
import { ResendEmailService } from './lib/resend';

@Module({
  controllers: [SendEmailController],
  providers: [SendEmailService, ResendEmailService],
})
export class SendEmailModule {}
