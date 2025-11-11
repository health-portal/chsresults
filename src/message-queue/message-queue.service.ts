import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { pgmq, Task } from 'prisma-pgmq';
import {
  ParseFilePayload,
  QueueTable,
  SendEmailPayload,
} from './message-queue.schema';
import { PrismaClient } from 'prisma/client/message-queue';

@Injectable()
export class MessageQueueService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit() {
    await this.$connect();
    await Promise.all(
      Object.values(QueueTable).map((table) => pgmq.createQueue(this, table)),
    );
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  async enqueueEmails(table: QueueTable, payloads: SendEmailPayload[]) {
    await pgmq.sendBatch(
      this,
      table,
      payloads.map((payload) => ({ ...payload })),
    );
  }

  async enqueueFile(table: QueueTable, payload: ParseFilePayload) {
    await pgmq.send(this, table, payload as unknown as Task);
  }
}
