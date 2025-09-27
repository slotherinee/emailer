import { Injectable, Logger } from '@nestjs/common';
import { ResendEmailService } from './lib/resend';
import { CreateEmailDto } from './dto/create-email.dto';

@Injectable()
export class SendEmailService {
  private readonly logger = new Logger(SendEmailService.name);

  constructor(private readonly resendEmailService: ResendEmailService) {}

  async sendEmail(body: CreateEmailDto) {
    try {
      return await this.resendEmailService.sendEmail(body);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      const errorStack = error instanceof Error ? error.stack : undefined;
      this.logger.error(`Failed to send email: ${errorMessage}`, errorStack);
      throw error;
    }
  }
}
