import { Injectable } from '@nestjs/common';
import { Question, QuestionType } from './interfaces/question.interface';
import questions from '../data/mvpLessonQuestions';
import DefaultMessages from '../data/default-messages.json';
import { UserService } from '../user/user.service';
import { MessageService } from '../message/message.service';

@Injectable()
export class QuestionsService {
  private list: Question[];

  constructor(
    private readonly userService: UserService,
    private readonly messageService: MessageService,
  ) {
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

  async checkAnswer(
    questionId: number,
    answer: string,
    messageSender: string,
  ): Promise<{ message: string; media: string }> {
    const question = this.findById(questionId);
    const correctAnswer = question.answer;
    const feedback = this.getFeedback(correctAnswer);

    const isCorrect = this.isCorrect(question, answer);
    const streakMessage = this.userService.incrementCorrectAnswerStreak(
      messageSender,
      isCorrect,
    );

    if (streakMessage) {
      await this.messageService.sendFeedback(
        messageSender,
        isCorrect ? feedback.correct : feedback.incorrect,
      );
      await this.messageService.sendText(messageSender, streakMessage);
      return { message: '', media: '' };
    }
    this.userService.incrementCurrentQuestion(messageSender);
    return isCorrect ? feedback.correct : feedback.incorrect;
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
