export interface Dimension {
  key: string;
  name: string;
  description: string;
  levels: {
    H: string;
    M: string;
    L: string;
  };
}

export type Level = 'H' | 'M' | 'L';

export type Element = '火' | '水' | '雷' | '风' | '冰' | '草' | '岩' | '???';

export interface Character {
  code: string;
  cn: string;
  element: Element;
  elementColor: string;
  icon: string;
  intro: string;
  desc: string;
  pattern: string;
  isFallback?: boolean;
}

export interface Question {
  id: number;
  dim: string;
  text: string;
  options: { label: string; value: number }[];
}

export interface MatchResult {
  character: Character;
  similarity: number;
  exactMatches: number;
  distance: number;
}

export type Screen = 'intro' | 'quiz' | 'result';
