import React, { useState } from 'react';
import type { Question } from '../types';
import ProgressBar from './ProgressBar';

interface QuizScreenProps {
  question: Question;
  currentIndex: number;
  total: number;
  selectedAnswer: number | undefined;
  onAnswer: (questionId: number, value: number) => void;
  progress: number;
}

const optionLabels = ['A', 'B', 'C'];

const QuizScreen: React.FC<QuizScreenProps> = ({
  question,
  currentIndex,
  total,
  selectedAnswer,
  onAnswer,
  progress,
}) => {
  const [picked, setPicked] = useState<number | null>(null);

  // Reset picked when question changes
  React.useEffect(() => {
    setPicked(null);
  }, [question.id]);

  const handlePick = (value: number) => {
    if (picked !== null) return; // prevent double-click
    setPicked(value);
    onAnswer(question.id, value);
  };

  return (
    <div className="screen quiz">
      <div className="quiz__header">
        <p className="quiz__counter">
          {currentIndex + 1} / {total}
        </p>
        <ProgressBar progress={progress} />
      </div>

      <h2 className="quiz__question" key={question.id}>
        {question.text}
      </h2>

      <div className="quiz__options">
        {question.options.map((opt, i) => {
          const isSelected = picked === opt.value;
          return (
            <button
              key={opt.value}
              className={`option-btn${isSelected ? ' option-btn--selected' : ''}`}
              onClick={() => handlePick(opt.value)}
              disabled={picked !== null}
            >
              <span className="option-btn__label">{optionLabels[i]}</span>
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuizScreen;
