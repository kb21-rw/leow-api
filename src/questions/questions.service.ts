import { Injectable } from '@nestjs/common';
import { Question, QuestionType } from './interfaces/question.interface';
import questions from '../data/MVPLessonQuestions';
import DefaultMessages from '../data/default-messages.json';

@Injectable()
export class QuestionsService {
  private list: Question[];

  constructor() {
    this.list = questions;
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

  private getFeedback(correctAnswer: string) {
    return {
      correct: {
        message: DefaultMessages['status.answer.correct'],
        media: 'https://leow.netlify.app/Great%20Job%20Gif.mp4',
      },
      incorrect: {
        message: `${DefaultMessages['status.answer.incorrect']} ${correctAnswer}`,
        media: 'https://leow.netlify.app/That_s_not_right.mp4',
      },
    };
  }

  checkAnswer(
    questionId: number,
    answer: string,
  ): { message: string; media: string } {
    const question = this.findById(questionId);
    const correctAnswer = question.answer;
    const feedback = this.getFeedback(correctAnswer);

    if (this.isCorrect(question, answer)) return feedback.correct;

    return feedback.incorrect;
  }

  private isCorrect(question: Question, answer: string): boolean {
    switch (question.type) {
      case QuestionType.MultipleChoice:
        return question.answer === answer;
      case QuestionType.Writing:
        return question.answer
          .toLowerCase()
          .includes(answer.toLowerCase().trim());
      default:
        return false;
    }
  }

  getNext(currentQuestionId: number) {
    if ((currentQuestionId ?? 1) > this.list.length)
      return DefaultMessages['lesson.end'];

    const nextQuestion = this.findById(currentQuestionId);

    if (nextQuestion.audio && !nextQuestion.text) {
      nextQuestion.text = DefaultMessages['question.audio.text'];
    }

    return nextQuestion;
  }
}
