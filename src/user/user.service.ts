import { Injectable } from '@nestjs/common';
import DefaultMessages from '../data/default-messages.json';

@Injectable()
export class UserService {
  private sessions = new Map<
    string,
    {
      currentQuestionId: number;
      completed: boolean;
      correctAnswerStreak: number;
      incorrectQuestions: number[];
      isReviewMode: boolean;
    }
  >();

  getSession(messageSender: string) {
    if (!this.sessions.has(messageSender)) {
      this.sessions.set(messageSender, {
        currentQuestionId: 1,
        completed: false,
        correctAnswerStreak: 0,
        incorrectQuestions: [],
        isReviewMode: false,
      });
    }
    return this.sessions.get(messageSender);
  }

  incrementCurrentQuestion(messageSender: string) {
    const session = this.getSession(messageSender);
    if (session) {
      if (session.isReviewMode) {
        // Remove the current question from incorrect questions
        const currentIndex = session.incorrectQuestions.indexOf(
          session.currentQuestionId,
        );
        if (currentIndex > -1) {
          session.incorrectQuestions.splice(currentIndex, 1);
        }

        // If no more incorrect questions, exit review mode
        if (session.incorrectQuestions.length === 0) {
          session.isReviewMode = false;
          session.currentQuestionId = 1;
          return;
        }

        // Move to next incorrect question
        session.currentQuestionId = session.incorrectQuestions[0];
      } else {
        session.currentQuestionId++;

        // If we've completed all questions and have incorrect ones, enter review mode
        if (
          session.currentQuestionId > 20 &&
          session.incorrectQuestions.length > 0
        ) {
          session.isReviewMode = true;
          session.currentQuestionId = session.incorrectQuestions[0];
        }
      }
    }
  }

  incrementCorrectAnswerStreak(messageSender: string, isCorrect: boolean) {
    const session = this.getSession(messageSender);
    if (session) {
      if (isCorrect) {
        session.correctAnswerStreak++;
        if (session.correctAnswerStreak === 5) {
          session.correctAnswerStreak = 0; // Reset streak at 5
          return DefaultMessages['status.answer.streak'] as string;
        }
      } else {
        session.correctAnswerStreak = 0;
        // Add to incorrect questions if not already in review mode
        if (
          !session.isReviewMode &&
          !session.incorrectQuestions.includes(session.currentQuestionId)
        ) {
          session.incorrectQuestions.push(session.currentQuestionId);
        }
      }
    }
    return null;
  }

  isInReviewMode(messageSender: string): boolean {
    const session = this.getSession(messageSender);
    return session?.isReviewMode || false;
  }
}
