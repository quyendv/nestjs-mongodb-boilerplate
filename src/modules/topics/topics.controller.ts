import { Body, Controller, Delete, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from 'src/decorators/auth.decorator';
import { JwtAccessTokenGuard } from '~modules/auth/guards/jwt-at.guard';
import { UpdateTopicDto } from './dto/update-topic.dto';
import { TopicsService } from './topics.service';

@Controller('topics')
@ApiTags('topics')
@UseGuards(JwtAccessTokenGuard)
export class TopicsController {
  constructor(private readonly topicsService: TopicsService) {}

  @Get()
  @Public() // Bỏ xác thực
  findAll() {
    return this.topicsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.topicsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTopicDto: UpdateTopicDto) {
    return this.topicsService.update(id, updateTopicDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.topicsService.remove(id);
  }
}
