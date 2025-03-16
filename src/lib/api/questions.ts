import { InterviewQuestion, InterviewType, DifficultyLevel } from '../types';

const questions: InterviewQuestion[] = [
  {
    id: '1',
    type: 'technical',
    difficulty: 'intermediate',
    question: 'Explain the concept of closures in JavaScript and provide an example of their practical use.',
    expectedDuration: 180,
    category: 'JavaScript',
    subcategory: 'Core Concepts'
  },
  {
    id: '2',
    type: 'behavioral',
    difficulty: 'intermediate',
    question: 'Tell me about a time when you had to deal with a difficult team member. How did you handle the situation?',
    expectedDuration: 180,
    category: 'Teamwork',
    subcategory: 'Conflict Resolution'
  },
  // Add more questions here
];

export function getQuestions(type: InterviewType, difficulty: DifficultyLevel): InterviewQuestion[] {
  return questions.filter(q => q.type === type && q.difficulty === difficulty);
}

export function getRandomQuestion(type: InterviewType, difficulty: DifficultyLevel): InterviewQuestion {
  const filtered = getQuestions(type, difficulty);
  return filtered[Math.floor(Math.random() * filtered.length)];
}