import { Body, Controller, Post, Get } from '@nestjs/common';
import { CreateEmailDto } from './dto/create-email.dto';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Controller('send-email')
export class SendEmailController {
  constructor(@InjectQueue('email') private readonly emailQueue: Queue) {}

  @Post()
  async sendEmail(@Body() body: CreateEmailDto) {
    const job = await this.emailQueue.add('send-email', {
      data: body,
    });

    return {
      message: 'Email job added to queue successfully',
      jobId: job.id,
    };
  }

  @Get('queue-status')
  async getQueueStatus() {
    const waiting = await this.emailQueue.getWaiting();
    const active = await this.emailQueue.getActive();
    const completed = await this.emailQueue.getCompleted();
    const failed = await this.emailQueue.getFailed();

    return {
      queue: 'email',
      counts: {
        waiting: waiting.length,
        active: active.length,
        completed: completed.length,
        failed: failed.length,
      },
      jobs: {
        waiting: waiting.slice(-5).map((job) => ({ id: job.id })),
        active: active.slice(-5).map((job) => ({ id: job.id })),
        completed: completed.slice(-5).map((job) => ({ id: job.id })),
        failed: failed.slice(-5).map((job) => ({
          id: job.id,
          failedReason: job.failedReason,
        })),
      },
    };
  }
}
