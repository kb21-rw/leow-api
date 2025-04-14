import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { Question } from './interfaces/question.interface';

@Controller('questions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @Get()
  findAll(): Question[] {
    return this.questionsService.findAll();
  }

  @Get(':id')
  findById(@Param('id') id: string): Question | undefined {
    return this.questionsService.findById(+id);
  }

  @Post('next')
  async getNext(@Body('messageSender') messageSender: string): Promise<void> {
    await this.questionsService.getNext(messageSender);
  }
}
