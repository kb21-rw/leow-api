import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { MessageController } from './message.controller';
import { MessageService } from './message.service';
import { QuestionsModule } from '../questions/questions.module';

@Module({
  imports: [HttpModule, QuestionsModule],
  controllers: [MessageController],
  providers: [MessageService],
})
export class MessageModule {}
