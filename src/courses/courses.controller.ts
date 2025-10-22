import { Controller, UseGuards } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { RoleGuard } from 'src/auth/role.guard';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('courses')
@UseGuards(JwtAuthGuard, RoleGuard)
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}
}
