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

  checkAnswer(
    questionId: number,
    answer: string,
  ): { message: string; media: string } {
    const question = this.findById(questionId);
    const correctAnswer = question.answer;

    const feedback = {
      correct: {
        message: 'Byiza cyane! 🎉 Igisubizo cyawe ni cyo!',
        media: 'https://leow.netlify.app/Great%20Job%20Gif.mp4',
      },
      incorrect: {
        message: `Yiii! 😞 Igisubizo cyawe Ntabwo ari cyo.\n\nIgisubizo ni: ${correctAnswer}`,
        media: 'https://leow.netlify.app/That_s_not_right.mp4',
      },
    };

    if (question.type === 'write-in-english') {
      if (correctAnswer.toLowerCase().includes(answer.toLowerCase().trim())) {
        return feedback.correct;
      }
      return feedback.incorrect;
    }

    return feedback[answer === correctAnswer ? 'correct' : 'incorrect'];
  }
}
