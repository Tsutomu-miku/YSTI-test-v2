import React, { Suspense, lazy, useState, useEffect } from 'react';
import { useQuiz } from './hooks/useQuiz';
import StarField from './components/StarField';
import IntroScreen from './components/IntroScreen';
import QuizScreen from './components/QuizScreen';

const ResultScreen = lazy(() => import('./components/ResultScreen'));

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

  // Lazy-load splash art only when result is ready
  const [splashArt, setSplashArt] = useState<Record<string, string> | undefined>(undefined);
  useEffect(() => {
    if (screen === 'result') {
      import('./data/splashArt').then((mod) => setSplashArt(mod.default));
    }
  }, [screen]);

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
        <Suspense fallback={<div className="screen" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}><p style={{ color: '#d4a850' }}>加载中…</p></div>}>
          <ResultScreen result={result} splashArt={splashArt} onRestart={restart} />
        </Suspense>
      )}
    </div>
  );
};

export default App;
