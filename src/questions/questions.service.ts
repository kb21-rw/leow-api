import { Injectable } from '@nestjs/common';
import { Question } from './interfaces/question.interface';
import questions from '../data/questions.json';

@Injectable()
export class QuestionsService {
  private list: Question[];

  constructor() {
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

  checkAnswer(questionId: number, answer: string): string {
    const question = this.findById(questionId);
    const correctAnswer = question.answer;

    if (answer === correctAnswer)
      return 'Byiza cyane! 🎉 Igisubizo cyawe ni cyo!';

    return `Yiii! 😞 Igisubizo cyawe Ntabwo ari cyo.\n\nIgisubizo ni: ${correctAnswer}`;
  }

  hasCompletedAllQuestions(currentQuestionId: number): boolean {
    const totalQuestions = this.findAll().length;
    return currentQuestionId > totalQuestions;
  }
}
