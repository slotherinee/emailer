import { Body, Controller, Post, Get, Sse } from '@nestjs/common';
import { CreateEmailDto } from './dto/create-email.dto';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { map, Observable, Subject } from 'rxjs';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { SkipThrottle } from '@nestjs/throttler';

@Controller('send-email')
export class SendEmailController {
  private eventSubject = new Subject<any>();
  constructor(
    @InjectQueue('email') private readonly emailQueue: Queue,
    private readonly eventEmitter: EventEmitter2,
  ) {
    this.eventEmitter.on('email.completed', (data) => {
      this.eventSubject.next(data);
    });

    this.eventEmitter.on('email.failed', (data) => {
      this.eventSubject.next(data);
    });
  }

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

  @Sse('events')
  @SkipThrottle()
  events(): Observable<MessageEvent> {
    return this.eventSubject.asObservable().pipe(
      map((data: Record<string, unknown>) => {
        let type = 'message';
        if (
          typeof data === 'object' &&
          data !== null &&
          'type' in data &&
          typeof data.type === 'string'
        ) {
          type = (data as { type: string }).type;
        }
        return {
          data: JSON.stringify(data),
          type,
        } as MessageEvent;
      }),
    );
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
