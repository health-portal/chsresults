import { MessageRecord, pgmq } from 'prisma-pgmq';
import { PrismaClient as DatabaseClient } from 'prisma/client/database';
import { PrismaClient as MessageQueueClient } from 'prisma/client/message-queue';
import { QueueTable } from './message-queue.schema';
import { createClient } from 'smtpexpress';
import { env } from 'src/lib/environment';

const VISIBILITY_TIMEOUT = 60;
const BATCH_SIZE = 5;

const dbClient = new DatabaseClient();
const mqClient = new MessageQueueClient();
const emailClient = createClient({
  projectId: env.SMTPEXPRESS_PROJECT_ID,
  projectSecret: env.SMTPEXPRESS_PROJECT_SECRET,
});

async function sendEmail() {
  await emailClient.sendApi.sendMail({});
}

async function processEmailQueue() {
  const records: MessageRecord[] = await pgmq.read(
    mqClient,
    QueueTable.EMAIL_SENDING,
    VISIBILITY_TIMEOUT,
    BATCH_SIZE,
  );
}

async function processFileQueue() {}
