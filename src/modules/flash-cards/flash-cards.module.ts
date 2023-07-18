import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FlashCard, FlashCardSchema } from './entities/flash-card.entity';
import { FlashCardsController } from './flash-cards.controller';
import { FlashCardsService } from './flash-cards.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: FlashCard.name, schema: FlashCardSchema }])],
  controllers: [FlashCardsController],
  providers: [FlashCardsService],
})
export class FlashCardsModule {}
