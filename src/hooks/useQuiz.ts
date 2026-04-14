import { useState, useCallback } from 'react';
import type { Screen } from '../types';
import { questions } from '../data/questions';
import { computeResult } from '../utils/matching';

export function useQuiz() {
  const [screen, setScreen] = useState<Screen>('intro');
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});

  const startQuiz = useCallback(() => {
    setAnswers({});
    setCurrentQ(0);
    setScreen('quiz');
  }, []);

  const answerQuestion = useCallback((questionId: number, value: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
    if (currentQ < questions.length - 1) {
      setTimeout(() => setCurrentQ(prev => prev + 1), 300);
    } else {
      setTimeout(() => setScreen('result'), 500);
    }
  }, [currentQ]);

  const restart = useCallback(() => {
    setScreen('intro');
    setAnswers({});
    setCurrentQ(0);
  }, []);

  const result = screen === 'result' ? computeResult(answers) : null;

  return {
    screen,
    currentQ,
    answers,
    questions,
    result,
    startQuiz,
    answerQuestion,
    restart,
    progress: (currentQ + (answers[questions[currentQ]?.id] ? 1 : 0)) / questions.length,
  };
}
