import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { ScheduleModule } from '@nestjs/schedule';
import { JwtModule } from '@nestjs/jwt';
import { env } from './environment';

@Module({
  imports: [
    DatabaseModule,
    AuthModule,
    ScheduleModule.forRoot(),
    JwtModule.register({ global: true, secret: env.JWT_SECRET }),
  ],
})
export class AppModule {}
