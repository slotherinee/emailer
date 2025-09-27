import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { SendEmailService } from './send-email.service';
import { CreateEmailDto } from './dto/create-email.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Processor('email')
export class SendEmailProcessor extends WorkerHost {
  private readonly logger = new Logger(SendEmailProcessor.name);

  constructor(
    private readonly sendEmailService: SendEmailService,
    private readonly eventEmitter: EventEmitter2,
  ) {
    super();
  }

  async process(job: Job<{ data: CreateEmailDto }>): Promise<void> {
    try {
      const result = await this.sendEmailService.sendEmail(job.data.data);

      const successEvent = {
        type: 'email.completed',
        jobId: job.id,
        message: 'Email sent successfully!',
        result: result,
      };
      this.eventEmitter.emit('email.completed', successEvent);
    } catch (error: any) {
      const errorEvent = {
        type: 'email.failed',
        jobId: job.id,
        message: 'Failed to send email',
        error: error instanceof Error ? error.message : 'Failed to send email',
      };

      this.eventEmitter.emit('email.failed', errorEvent);

      throw error;
    }
  }
}
