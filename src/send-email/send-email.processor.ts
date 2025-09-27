import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { SendEmailService } from './send-email.service';
import { CreateEmailDto } from './dto/create-email.dto';

@Processor('email')
export class SendEmailProcessor extends WorkerHost {
  private readonly logger = new Logger(SendEmailProcessor.name);

  constructor(private readonly sendEmailService: SendEmailService) {
    super();
  }

  async process(job: Job<{ data: CreateEmailDto }>): Promise<void> {
    this.logger.debug(`Processing job ${job.id} of type ${job.name}`);
    this.logger.log(`Job data: ${JSON.stringify(job.data)}`);
    try {
      await this.sendEmailService.sendEmail(job.data.data);
      this.logger.debug(`Job ${job.id} completed successfully`);
    } catch (error: any) {
      const err: Error =
        error instanceof Error ? error : new Error(String(error));
      this.logger.error(`Job ${job.id} failed: ${err.message}`, err.stack);
      throw err;
    }
  }
}
