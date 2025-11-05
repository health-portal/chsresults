import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { pgmq, Task } from 'prisma-pgmq';
import { PrismaClient } from 'prisma/client/message-queue';
import { QueueTable } from './message-queue.schema';

@Injectable()
export class MessageQueueService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit() {
    await this.$connect();
    await pgmq.createQueue(this, QueueTable.EMAIL_SENDING);
    await pgmq.createQueue(this, QueueTable.FILE_PROCESSING);
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  async enqueue(table: QueueTable, payload: object) {
    if (payload instanceof Array) {
      await pgmq.sendBatch(this, table, payload as Task[]);
    } else {
      await pgmq.send(this, table, payload as Task);
    }
  }
}
