import { Module } from '@nestjs/common';
import { SendEmailService } from './send-email.service';
import { SendEmailController } from './send-email.controller';
import { SendEmailProcessor } from './send-email.processor';
import { ResendEmailService } from './lib/resend';
import { BullModule } from '@nestjs/bullmq';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'email',
    }),
  ],
  controllers: [SendEmailController],
  providers: [SendEmailService, SendEmailProcessor, ResendEmailService],
})
export class SendEmailModule {}
