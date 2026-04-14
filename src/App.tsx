import React from 'react';
import { useQuiz } from './hooks/useQuiz';
import StarField from './components/StarField';
import IntroScreen from './components/IntroScreen';
import QuizScreen from './components/QuizScreen';
import ResultScreen from './components/ResultScreen';

const App: React.FC = () => {
  const {
    screen,
    currentQ,
    answers,
    questions,
    result,
    startQuiz,
    answerQuestion,
    restart,
    progress,
  } = useQuiz();

  const currentQuestion = questions[currentQ];

  return (
    <div className="app-shell">
      <StarField />

      {screen === 'intro' && (
        <IntroScreen onStart={startQuiz} />
      )}

      {screen === 'quiz' && currentQuestion && (
        <QuizScreen
          question={currentQuestion}
          currentIndex={currentQ}
          total={questions.length}
          selectedAnswer={answers[currentQuestion.id]}
          onAnswer={answerQuestion}
          progress={progress}
        />
      )}

      {screen === 'result' && result && (
        <ResultScreen result={result} onRestart={restart} />
      )}
    </div>
  );
};

export default App;
