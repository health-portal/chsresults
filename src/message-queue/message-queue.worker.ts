import { MessageRecord, pgmq } from 'prisma-pgmq';
import { PrismaClient as DatabaseClient } from 'prisma/client/database';
import { PrismaClient as MessageQueueClient } from 'prisma/client/message-queue';
import { QueueTable, SendEmailBody } from './message-queue.schema';
import { createClient } from 'smtpexpress';
import { env } from 'src/lib/environment';
import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { UploadFileBody } from 'src/files/files.schema';

const VISIBILITY_TIMEOUT = 60;
const BATCH_SIZE = 5;

const dbClient = new DatabaseClient();
const mqClient = new MessageQueueClient();
const emailClient = createClient({
  projectId: env.SMTPEXPRESS_PROJECT_ID,
  projectSecret: env.SMTPEXPRESS_PROJECT_SECRET,
});

async function sendEmail({ subject, toEmail, content }: SendEmailBody) {
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
        record.message as unknown as SendEmailBody;
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

async function processFileQueue() {
  const [record] = await pgmq.read(
    mqClient,
    QueueTable.FILES,
    VISIBILITY_TIMEOUT,
    1,
  );

  const s3 = new S3Client({
    region: 'auto',
    endpoint: `https://${env.CLOUDFLARE_R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: env.CLOUDFLARE_R2_ACCESS_KEY_ID,
      secretAccessKey: env.CLOUDFLARE_R2_SECRET_ACCESS_KEY,
    },
  });

  const { path } = record.message as unknown as UploadFileBody;
  const response = await s3.send(
    new GetObjectCommand({
      Bucket: env.CLOUDFLARE_R2_BUCKET,
      Key: path,
    }),
  );

  response.Body;
}
