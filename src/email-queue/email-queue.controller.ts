import { Body, Controller, Post } from '@nestjs/common';
import { InitialEmailSchema } from './email-queue.schema';
import { EmailQueueService } from './email-queue.service';

@Controller('email-queue')
export class EmailQueueController {
  constructor(private readonly emailQueueService: EmailQueueService) {}

  @Post('create')
  async enqueueEmails() {
    const emails = {
      title: 'Portal Update',
      message:
        'Important updates have been made to the portal. Please check your account for details.',
      portalLink: 'https://results.oauchs.edu.ng/portal',
      recipients: [
        { name: 'John Doe', email: 'john.doe@example.com' },
        { name: 'Jane Smith', email: 'jane.smith@example.com' },
        { name: 'John Doe', email: 'john.doe@example.com' },
        {
          name: 'Olugbenga Moyinoluwa',
          email: 'olugbengamoyinoluwa839@gmail.com',
        },
        { name: 'John Doe', email: 'john.doe@example.com' },
        { name: 'Jane Smith', email: 'jane.smith@example.com' },
        { name: 'John Doe', email: 'john.doe@example.com' },
        {
          name: 'Olugbenga Moyinoluwa',
          email: 'olugbengamoyinoluwa839@gmail.com',
        },
      ],
    } as InitialEmailSchema;
    return this.emailQueueService.enqueueEmails(emails);
  }
}
