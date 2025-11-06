import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Injectable } from '@nestjs/common';
import { env } from 'src/lib/environment';

@Injectable()
export class S3Service {
  private UPLOAD_URL_EXPIRATION = 5 * 60 * 60;
  private DOWNLOAD_URL_EXPIRATION = 24 * 60 * 60;
  private client: S3Client;

  constructor() {
    this.client = new S3Client({
      region: 'auto',
      endpoint: `https://${env.CLOUDFLARE_R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: env.CLOUDFLARE_R2_ACCESS_KEY_ID,
        secretAccessKey: env.CLOUDFLARE_R2_SECRET_ACCESS_KEY,
      },
    });
  }

  async generateUploadUrl(filename: string) {
    return await getSignedUrl(
      this.client,
      new PutObjectCommand({ Bucket: env.CLOUDFLARE_R2_BUCKET, Key: filename }),
      { expiresIn: this.UPLOAD_URL_EXPIRATION },
    );
  }

  async generateDownloadUrl(filename: string) {
    return await getSignedUrl(
      this.client,
      new GetObjectCommand({ Bucket: env.CLOUDFLARE_R2_BUCKET, Key: filename }),
      { expiresIn: this.DOWNLOAD_URL_EXPIRATION },
    );
  }
}
