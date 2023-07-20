import { Controller, Get, UseGuards } from '@nestjs/common';
import { Public } from 'src/decorators/auth.decorator';
import { JwtAccessTokenGuard } from '~modules/auth/guards/jwt-at.guard';
import { TopicsService } from './topics.service';

@Controller('topics')
@UseGuards(JwtAccessTokenGuard)
export class TopicsController {
  constructor(private readonly topicsService: TopicsService) {}

  @Get()
  @Public() // Bỏ xác thực
  findAll() {
    return this.topicsService.findAll();
  }
}
