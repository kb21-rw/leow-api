import { Question } from '../questions/entities/question.entity';

export const MVP_Lesson = [
  {
    _id: 1,
    text: 'Hitamo ubusobanuro bwa “Icyayi”',
    type: QuestionType.MultipleChoice,
    options: ['Milk🥛', 'Tea🍵', 'Bread🍞'],
    answer: 'Tea🍵',
  },
  {
    _id: 2,
    text: 'Vuga ibyo usoma: \n Hello',
    type: QuestionType.Writing,
    answer: 'Hello',
  },
  {
    _id: 3,
    text: 'Hitamo ubusobanuro bwa “Muraho”',
    type: QuestionType.MultipleChoice,
    options: ['Thank you', 'Hello', 'Goodbye'],
    answer: 'Hello',
  },
  {
    _id: 4,
    text: 'Hitamo ijambo ryuzuza iyi nteruro: \n I read a ..... at school.',
    type: QuestionType.MultipleChoice,
    options: ['Food', 'Book', 'Cow'],
    answer: 'Book',
  },
  {
    _id: 5,
    text: 'Hitamo ijambo ryuzuza iyi nteruro: \n We ate ..... in the morning.',
    type: QuestionType.MultipleChoice,
    options: ['Rice', 'Water', 'Tea'],
    answer: 'Rice',
  },
  {
    _id: 6,
    text: 'Vuga ibyo usoma: \n Water',
    type: QuestionType.Writing,
    answer: 'Water',
  },
  {
    _id: 7,
    text: 'https://leow.netlify.app/Pronunciation_hello_.mp3',
    type: QuestionType.MultipleChoice,
    options: ['Hello', 'Below', 'Yellow'],
    answer: 'Hello',
  },
  {
    _id: 8,
    text: 'https://leow.netlify.app/Pronunciation_water.mp3',
    type: QuestionType.MultipleChoice,
    options: ['Water', 'Butter', 'Quarter'],
    answer: 'Water',
  },
  {
    _id: 9,
    text: 'https://leow.netlify.app/Pronunciation%20_yes_.mp3',
    type: QuestionType.MultipleChoice,
    options: ['yes', 'guess', 'rest'],
    answer: 'yes',
  },
  {
    _id: 10,
    text: "Uzuza iki kiganiro: \nUmuntu A: Hi! How are you doing today?\nUmuntu B: I'm good, thanks, How about you?\nUmuntu A: ………..",
    type: QuestionType.MultipleChoice,
    options: ["I'm fine, thank you!", "What's your name?", "Let's go."],
    answer: "I'm fine, thank you!",
  },
  {
    _id: 11,
    text: 'Uzuza iki kiganiro: \nUmuntu A: Do you want coffee? \nUmuntu B: Sure! ……………',
  }
];
