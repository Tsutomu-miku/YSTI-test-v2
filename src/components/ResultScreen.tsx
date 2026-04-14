import React, { useState, useCallback } from 'react';
import type { Character, Level, MatchResult } from '../types';
import { dimensions, dimensionOrder } from '../data/dimensions';

interface ResultData {
  finalType: Character;
  similarity: number;
  exactMatches: number;
  ranked: MatchResult[];
  levels: Record<string, Level>;
  rawScores: Record<string, number>;
  badge: string;
  sub: string;
}

interface ResultScreenProps {
  result: ResultData;
  onRestart: () => void;
}

const ELEMENT_MAP: Record<string, string> = {
  '火': '🔥',
  '水': '💧',
  '雷': '⚡',
  '风': '🍃',
  '冰': '❄️',
  '草': '🌿',
  '岩': '🪨',
  '???': '✨',
};

const ELEMENT_CSS_VAR: Record<string, string> = {
  '火': 'var(--pyro)',
  '水': 'var(--hydro)',
  '雷': 'var(--electro)',
  '风': 'var(--anemo)',
  '冰': 'var(--cryo)',
  '草': 'var(--dendro)',
  '岩': 'var(--geo)',
  '???': 'var(--gold)',
};

function levelBarWidth(level: Level): string {
  return level === 'H' ? '100%' : level === 'M' ? '60%' : '28%';
}

function levelBarColor(level: Level): string {
  return level === 'H' ? 'var(--gold-bright)' : level === 'M' ? 'var(--gold)' : 'var(--text-dim)';
}

const ResultScreen: React.FC<ResultScreenProps> = ({ result, onRestart }) => {
  const [showToast, setShowToast] = useState(false);

  const { finalType, badge, sub, levels, ranked } = result;
  const elementColor = ELEMENT_CSS_VAR[finalType.element] || 'var(--gold)';
  const elementEmoji = ELEMENT_MAP[finalType.element] || '✨';

  const handleShare = useCallback(async () => {
    const dimText = dimensionOrder
      .map(dim => `${dimensions.find(d => d.key === dim)?.name || dim}: ${levels[dim]}`)
      .join(' | ');

    const text = [
      `【YSTI v2.0 测试结果】`,
      `我是：${finalType.cn}（${finalType.element}元素）`,
      badge,
      ``,
      `维度：${dimText}`,
      ``,
      `"${finalType.intro}"`,
      ``,
      `来测测提瓦特中的你吧！`,
    ].join('\n');

    try {
      await navigator.clipboard.writeText(text);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    } catch {
      // Fallback: prompt
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    }
  }, [finalType, badge, levels]);

  const top3 = ranked.slice(0, 3);

  return (
    <div className="screen result">
      {/* Hero Card */}
      <section
        className="result__hero"
        style={{ '--element-color': elementColor } as React.CSSProperties}
      >
        <span className="result__element-icon">{elementEmoji}</span>
        <h1 className="result__character-name">{finalType.code}</h1>
        <p className="result__character-cn">{finalType.cn}</p>
        <span className="result__badge">{badge}</span>
        <p className="result__sub">{sub}</p>
      </section>

      {/* Intro & Description */}
      <section className="result__info">
        <p className="result__intro-quote">{finalType.intro}</p>
        <div className="result__divider" />
        <p className="result__desc">{finalType.desc}</p>
      </section>

      {/* Dimension Breakdown */}
      <section className="result__dimensions">
        <h3 className="result__dim-title">维度分析</h3>
        {dimensionOrder.map(dim => {
          const level = levels[dim];
          const dimData = dimensions.find(d => d.key === dim);
          return (
            <div className="dim-row" key={dim}>
              <span className="dim-row__name">{dimData?.name || dim}</span>
              <div className="dim-row__bar">
                <div
                  className="dim-row__bar-fill"
                  style={{
                    width: levelBarWidth(level),
                    background: levelBarColor(level),
                  }}
                />
              </div>
              <span className={`dim-row__level dim-row__level--${level}`}>
                {level}
              </span>
            </div>
          );
        })}
      </section>

      {/* Top 3 Ranking */}
      <section className="result__ranking">
        <h3 className="result__ranking-title">最相似角色 TOP 3</h3>
        {top3.map((r, i) => (
          <div className="rank-row" key={r.character.code}>
            <span className="rank-row__position">{i + 1}</span>
            <span className="rank-row__name">
              {ELEMENT_MAP[r.character.element] || '✨'}{' '}
              {r.character.cn}
            </span>
            <span className="rank-row__score">{r.similarity}%</span>
          </div>
        ))}
      </section>

      {/* Actions */}
      <div className="result__actions">
        <button className="btn-gold" onClick={onRestart}>
          重新测试
        </button>
        <button className="btn-secondary" onClick={handleShare}>
          分享结果
        </button>
      </div>

      {showToast && <div className="toast">已复制到剪贴板！</div>}
    </div>
  );
};

export default ResultScreen;
