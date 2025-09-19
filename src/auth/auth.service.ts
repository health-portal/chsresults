import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { createAuthClient } from 'src/lib/auth';

@Injectable()
export class AuthService {
  public client: ReturnType<typeof createAuthClient>;

  constructor(private db: DatabaseService) {
    this.client = createAuthClient();
  }
}
