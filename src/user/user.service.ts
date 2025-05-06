import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  private sessions = new Map<
    string,
    {
      currentQuestionId: number;
      completed: boolean;
      correctAnswerStreak: number;
    }
  >();

  getSession(messageSender: string) {
    if (!this.sessions.has(messageSender)) {
      this.sessions.set(messageSender, {
        currentQuestionId: 1,
        completed: false,
        correctAnswerStreak: 0,
      });
    }
    return this.sessions.get(messageSender);
  }

  incrementCurrentQuestion(messageSender: string) {
    const session = this.getSession(messageSender);
    if (session) {
      session.currentQuestionId++;
    }
  }

  incrementCorrectAnswerStreak(messageSender: string, isCorrect: boolean) {
    const session = this.getSession(messageSender);
    if (session) {
      if (isCorrect) {
        session.correctAnswerStreak++;
      } else {
        session.correctAnswerStreak = 0;
      }
    }
  }
}
