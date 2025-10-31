import { Controller } from '@nestjs/common';
import { GradingSystemsService } from './grading-systems.service';

@Controller('grading-systems')
export class GradingSystemsController {
  constructor(private readonly gradingSystemsService: GradingSystemsService) {}
}
