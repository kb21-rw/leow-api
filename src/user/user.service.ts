import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  private userSessions = new Map<
    string,
    {
      currentQuestionId: number;
      completed: boolean;
    }
  >();

  getUserSession(messageSender: string) {
    if (!this.userSessions.has(messageSender)) {
      this.userSessions.set(messageSender, {
        currentQuestionId: 1,
        completed: false,
      });
    }
    return this.userSessions.get(messageSender);
  }

  incrementCurrentQuestion(messageSender: string) {
    const userSession = this.getUserSession(messageSender);
    if (userSession) {
      userSession.currentQuestionId++;
    }
  }

  hasCompletedAllQuestions(
    currentQuestionId: number,
    totalQuestions: number,
  ): boolean {
    return currentQuestionId > totalQuestions;
  }
}
