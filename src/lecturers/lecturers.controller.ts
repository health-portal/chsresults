import { Controller } from '@nestjs/common';
import { LecturersService } from './lecturers.service';

@Controller('lecturers')
export class LecturersController {
  constructor(private readonly lecturersService: LecturersService) {}
}
