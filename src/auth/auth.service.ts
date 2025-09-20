import { Injectable } from '@nestjs/common';
import { createAuth } from 'src/lib/auth';

@Injectable()
export class AuthService {
  public readonly auth = createAuth();

  constructor() {}
}
