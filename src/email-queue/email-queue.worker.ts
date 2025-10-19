// src/queue/queue.worker.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { EmailQueueService } from './email-queue.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const queue = app.get(EmailQueueService);

  console.log('Worker started...');
  try {
    await queue.processQueue();
    console.log('Worker finished processing all queued emails.');
  } catch (error) {
    console.error('Worker encountered an error:', error);
  } finally {
    await app.close();
    process.exit(0);
  }
}

bootstrap();
