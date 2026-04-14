import React, { Suspense, lazy, useState, useEffect } from 'react';
import { useQuiz } from './hooks/useQuiz';
import StarField from './components/StarField';
import IntroScreen from './components/IntroScreen';
import QuizScreen from './components/QuizScreen';
import { loadSplash } from './data/splashLoader';

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

  // Load ONLY the matched character's splash art (not all 32)
  const [splashArt, setSplashArt] = useState<Record<string, string>>({});
  useEffect(() => {
    if (screen === 'result' && result) {
      const code = result.finalType.code;
      if (!splashArt[code]) {
        loadSplash(code).then((uri) => {
          if (uri) setSplashArt((prev) => ({ ...prev, [code]: uri }));
        });
      }
    }
  }, [screen, result]);

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
