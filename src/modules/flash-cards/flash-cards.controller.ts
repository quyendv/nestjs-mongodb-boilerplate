import { Controller } from '@nestjs/common';
import { FlashCardsService } from './flash-cards.service';

@Controller('flash-cards')
export class FlashCardsController {
  constructor(private readonly flashCardsService: FlashCardsService) {}
}
