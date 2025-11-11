import { MessageRecord, pgmq } from 'prisma-pgmq';
import { PrismaClient as DatabaseClient } from 'prisma/client/database';
import { PrismaClient as MessageQueueClient } from 'prisma/client/message-queue';
import { QueueTable, SendEmailPayload } from './message-queue.schema';
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

async function sendEmail({ subject, toEmail, content }: SendEmailPayload) {
  const { statusCode } = await emailClient.sendApi.sendMail({
    subject,
    message: content,
    sender: {
      name: 'Obafemi Awolowo University - College of Health Sciences',
      email: env.SMTPEXPRESS_SENDER_EMAIL,
    },
    recipients: [toEmail],
  });

  return statusCode === 200;
}

async function processEmailQueue() {
  let records: MessageRecord[];
  records = await pgmq.read(
    mqClient,
    QueueTable.HI_PRIORITY_EMAILS,
    VISIBILITY_TIMEOUT,
    BATCH_SIZE,
  );

  if (!records.length)
    records = await pgmq.read(
      mqClient,
      QueueTable.LO_PRIORITY_EMAILS,
      VISIBILITY_TIMEOUT,
      BATCH_SIZE,
    );

  await Promise.all(
    records.map(async (record) => {
      const { subject, toEmail, content } =
        record.message as unknown as SendEmailPayload;
      const isSent = await sendEmail({ subject, toEmail, content });
      if (!isSent)
        await pgmq.deleteMessage(
          mqClient,
          QueueTable.HI_PRIORITY_EMAILS,
          record.msg_id,
        );
    }),
  );
}
