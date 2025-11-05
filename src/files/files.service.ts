import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Injectable } from '@nestjs/common';
import { env } from 'src/lib/environment';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateFileBody } from './files.schema';

@Injectable()
export class FilesService {
  private s3: S3Client;

  constructor(private readonly prisma: PrismaService) {
    this.s3 = new S3Client({
      region: 'auto',
      endpoint: `https://${env.CLOUDFLARE_R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: env.CLOUDFLARE_R2_ACCESS_KEY_ID,
        secretAccessKey: env.CLOUDFLARE_R2_SECRET_ACCESS_KEY,
      },
    });
  }

  async createFile(
    userId: string,
    { filename, category, mimetype, path, size }: CreateFileBody,
  ) {
    await this.prisma.file.create({
      data: { filename, size, mimetype, path, category, userId },
    });
  }

  async generatePresignedUrl(filename: string, expiresIn: number = 3600) {
    return await getSignedUrl(
      this.s3,
      new PutObjectCommand({ Bucket: env.CLOUDFLARE_R2_BUCKET, Key: filename }),
      { expiresIn },
    );
  }
}
