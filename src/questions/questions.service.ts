import { Injectable } from '@nestjs/common';
import { Question } from './interfaces/question.interface';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class QuestionsService {
  private questions: Question[];

  constructor() {
    const jsonPath = path.join(__dirname, '../../data/questions.json');
    const jsonData = fs.readFileSync(jsonPath, 'utf8');
    this.questions = JSON.parse(jsonData);
  }

  findAll(): Question[] {
    return this.questions;
  }

  findOne(id: number): Question | undefined {
    return this.questions.find((question) => question._id === id);
  }
}
