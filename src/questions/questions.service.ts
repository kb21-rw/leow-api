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
  ): { message: string; gif: string } {
    const question = this.findById(questionId);
    const correctAnswer = question.answer;

    const feedback = {
      correct: {
        message: 'Byiza cyane! 🎉 Igisubizo cyawe ni cyo!',
        gif: 'https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExdTRuY3c4OHhkY2Z3OHVkanRoanJzaHRrejdiczdzbDV2d3EyYjBvYyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/2xRu4Clh3DJhm/giphy.gif',
      },
      incorrect: {
        message: `Yiii! 😞 Igisubizo cyawe Ntabwo ari cyo.\n\nIgisubizo ni: ${correctAnswer}`,
        gif: 'https://i.giphy.com/l2SpNqwi0lRY5M5sk.webp',
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
