export type Question = {
  id: string;
  prompt: string;
  options: string[];
  answer: string;
  difficulty: 'easy' | 'medium' | 'hard';
};

export type FaceId = 'front' | 'back' | 'left' | 'right' | 'top' | 'bottom';

export const FACE_QUESTIONS: Record<FaceId, Question[]> = {
  front: [
    {
      id: 'f1',
      prompt: 'What is 7 × 8?',
      options: ['54', '56', '64', '63'],
      answer: '56',
      difficulty: 'easy',
    },
    {
      id: 'f2',
      prompt: 'If 3x = 21, x = ?',
      options: ['6', '7', '8', '9'],
      answer: '7',
      difficulty: 'easy',
    },
  ],
  back: [
    {
      id: 'b1',
      prompt: 'What is the next prime after 19?',
      options: ['21', '23', '25', '27'],
      answer: '23',
      difficulty: 'medium',
    },
  ],
  left: [
    {
      id: 'l1',
      prompt: 'Which is equivalent to (a + b)²?',
      options: ['a² + b²', 'a² + 2ab + b²', '2a² + b²', 'a² + ab + b²'],
      answer: 'a² + 2ab + b²',
      difficulty: 'medium',
    },
  ],
  right: [
    {
      id: 'r1',
      prompt: 'What is 2⁵?',
      options: ['16', '32', '64', '128'],
      answer: '32',
      difficulty: 'easy',
    },
  ],
  top: [
    {
      id: 't1',
      prompt: 'Derivative of x² is?',
      options: ['2x', 'x', 'x³', '1/x'],
      answer: '2x',
      difficulty: 'medium',
    },
  ],
  bottom: [
    {
      id: 'bt1',
      prompt: 'If P(A) = 0.4 and P(B) = 0.5 (independent), P(A ∩ B) = ?',
      options: ['0.9', '0.45', '0.2', '0.5'],
      answer: '0.2',
      difficulty: 'hard',
    },
  ],
};
