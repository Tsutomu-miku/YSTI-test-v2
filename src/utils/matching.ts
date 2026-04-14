import type { Character, Level, MatchResult } from '../types';
import { dimensionOrder } from '../data/dimensions';
import { normalCharacters, fallbackCharacter } from '../data/characters';
import { questions } from '../data/questions';

function levelToNum(level: Level): number {
  return level === 'H' ? 3 : level === 'M' ? 2 : 1;
}

function scoreToLevel(score: number): Level {
  if (score >= 5) return 'H';
  if (score >= 3) return 'M';
  return 'L';
}

export function computeResult(answers: Record<number, number>): {
  finalType: Character;
  similarity: number;
  exactMatches: number;
  ranked: MatchResult[];
  levels: Record<string, Level>;
  rawScores: Record<string, number>;
  badge: string;
  sub: string;
} {
  // Sum scores per dimension
  const rawScores: Record<string, number> = {};
  dimensionOrder.forEach(dim => { rawScores[dim] = 0; });
  questions.forEach(q => {
    rawScores[q.dim] += (answers[q.id] || 0);
  });

  // Convert to levels
  const levels: Record<string, Level> = {};
  dimensionOrder.forEach(dim => {
    levels[dim] = scoreToLevel(rawScores[dim]);
  });

  // User vector
  const userVector = dimensionOrder.map(dim => levelToNum(levels[dim]));

  // Compare with all characters
  const ranked: MatchResult[] = normalCharacters.map(char => {
    const charVector = char.pattern.split('-').map(l => levelToNum(l as Level));
    let distance = 0;
    let exactMatches = 0;
    for (let i = 0; i < charVector.length; i++) {
      const diff = Math.abs(userVector[i] - charVector[i]);
      distance += diff;
      if (diff === 0) exactMatches++;
    }
    const similarity = Math.max(0, Math.round((1 - distance / 20) * 100));
    return { character: char, similarity, exactMatches, distance };
  }).sort((a, b) => {
    if (a.distance !== b.distance) return a.distance - b.distance;
    if (b.exactMatches !== a.exactMatches) return b.exactMatches - a.exactMatches;
    return b.similarity - a.similarity;
  });

  const best = ranked[0];
  let finalType: Character;
  let badge: string;
  let sub: string;

  if (best.similarity < 50) {
    finalType = fallbackCharacter;
    badge = `标准角色库最高匹配仅 ${best.similarity}%`;
    sub = '你的灵魂过于独特，标准角色库集体摆烂了。';
  } else {
    finalType = best.character;
    badge = `匹配度 ${best.similarity}% · 命中 ${best.exactMatches}/10 维`;
    sub = best.exactMatches >= 7
      ? '高度匹配，这就是提瓦特中的你。'
      : '维度匹配较高，当前结果可作为你的第一人格参考。';
  }

  return {
    finalType,
    similarity: best.similarity,
    exactMatches: best.exactMatches,
    ranked,
    levels,
    rawScores,
    badge,
    sub,
  };
}
