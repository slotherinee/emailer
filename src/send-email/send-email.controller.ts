import { Body, Controller, Post } from '@nestjs/common';
import { SendEmailService } from './send-email.service';
import { CreateEmailDto } from './dto/create-email.dto';

@Controller('send-email')
export class SendEmailController {
  constructor(private readonly sendEmailService: SendEmailService) {}

  @Post()
  sendEmail(@Body() body: CreateEmailDto) {
    return this.sendEmailService.sendEmail(body);
  }
}
