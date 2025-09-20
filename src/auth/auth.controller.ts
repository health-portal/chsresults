import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ZodValidationPipe } from 'src/lib/zod-validation.pipe';
import { type SigninStudentBody, signinStudentSchema } from './auth.schema';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('students/signin')
  @UsePipes(new ZodValidationPipe(signinStudentSchema))
  async signinStudent(@Body() body: SigninStudentBody) {
    return await this.authService.signinStudent(body);
  }
}
