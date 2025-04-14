import { Injectable, Logger } from '@nestjs/common';
import { Question } from './interfaces/question.interface';
import questions from '../data/questions.json';
import { MessageService } from '../message/message.service';

interface UserSession {
  currentQuestionId: number;
}

@Injectable()
export class QuestionsService {
  private readonly logger = new Logger(QuestionsService.name);
  private list: Question[];
  private userSession = new Map<string, UserSession>();

  constructor(private readonly messageService: MessageService) {
    this.list = questions as Question[];
  }

  findAll(): Question[] {
    return this.list;
  }

  findById(id: number): Question {
    const question = this.list.find((question) => question._id === id);
    if (!question) {
      throw new Error(`Question with ID ${id} not found`);
    }
    return question;
  }

  getCurrentQuestionId(messageSender: string): number {
    if (!this.userSession.has(messageSender)) {
      this.userSession.set(messageSender, { currentQuestionId: 1 });
    }
    return this.userSession.get(messageSender)!.currentQuestionId;
  }

  async getNext(messageSender: string): Promise<void> {
    const userSession = this.userSession.get(messageSender)!;

    const nextQuestion = this.findById(userSession.currentQuestionId);

    // Send question with options
    if (nextQuestion.options && nextQuestion.options.length > 0) {
      await this.messageService.sendWithOptions(
        messageSender,
        nextQuestion.question,
        nextQuestion.options,
      );

      userSession.currentQuestionId++;
    } else {
      //Todo: Send other question types
    }
  }
}
