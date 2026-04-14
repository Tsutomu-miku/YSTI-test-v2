import React, { useMemo, useState, useCallback } from 'react';
import { elementIcons } from '../data/elementIcons';
import { dimensions } from '../data/dimensions';
import type { Character, MatchResult, Level } from '../types';

/* ------------------------------------------------------------------ */
/*  Props                                                              */
/* ------------------------------------------------------------------ */

interface ResultScreenProps {
  result: {
    finalType: Character;
    similarity: number;
    exactMatches: number;
    ranked: MatchResult[];
    levels: Record<string, Level>;
    rawScores: Record<string, number>;
    badge: string;
    sub: string;
  };
  onRestart: () => void;
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

/** Level → percentage for dimension bar (H=90, M=50, L=10) */
function levelToPct(level: Level): number {
  return level === 'H' ? 90 : level === 'M' ? 50 : 10;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

const ResultScreen: React.FC<ResultScreenProps> = ({ result, onRestart }) => {
  const { finalType: character, ranked, levels, badge, sub } = result;

  const [toastVisible, setToastVisible] = useState(false);

  /* ---- share text ---- */
  const shareText = useMemo(() => {
    const levelStr = dimensions.map(d => levels[d.key] ?? '?').join('');
    return `【YSTI v2.0】我的原神人格是「${character.cn}」(${levelStr})！快来测测你是谁 👉`;
  }, [character, levels]);

  const handleShare = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(shareText);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = shareText;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 2200);
  }, [shareText]);

  /* ---- element icon ---- */
  const elIcon: string | undefined = elementIcons[character.element];

  /* ---- top 3 ---- */
  const top3 = ranked.slice(0, 3);

  /* ---- render ---- */
  return (
    <section className="result" aria-label="测试结果">
      {/* ========== SPLASH BACKGROUND ========== */}
      {character.splash && (
        <div className="result__splash-bg" aria-hidden="true">
          <img
            src={character.splash}
            alt=""
            className="result__splash-img"
            draggable={false}
          />
          <div className="result__splash-gradient" />
        </div>
      )}

      {/* ========== HERO ========== */}
      <div className="result__hero">
        {/* circular portrait */}
        <div
          className="result__portrait-ring"
          style={{ borderColor: character.elementColor }}
        >
          <img
            className="result__portrait"
            src={character.image || character.icon}
            alt={character.cn}
          />
        </div>

        {/* element icon + name */}
        <div className="result__name-row">
          {elIcon && (
            <img
              className="result__element-icon"
              src={elIcon}
              alt={character.element}
              style={{ '--el-color': character.elementColor } as React.CSSProperties}
            />
          )}
          <h1 className="result__name" style={{ color: character.elementColor }}>
            {character.cn}
          </h1>
        </div>

        {/* badge + sub */}
        <p className="result__badge-text">{badge}</p>
        <p className="result__sub-text">{sub}</p>

        {/* intro */}
        <p className="result__intro">{character.intro}</p>
      </div>

      {/* ========== DESCRIPTION ========== */}
      <div className="result__desc-section">
        <p className="result__desc">{character.desc}</p>
      </div>

      {/* ========== DIMENSION BARS ========== */}
      <div className="result__dimensions">
        <h2 className="result__section-title">维度详情</h2>
        <div className="result__dim-list">
          {dimensions.map((dim) => {
            const level = levels[dim.key] ?? 'M';
            const pct = levelToPct(level);
            return (
              <div className="result__dim" key={dim.key}>
                <div className="result__dim-labels">
                  <span className="result__dim-name">{dim.name}</span>
                  <span
                    className={`result__dim-level result__dim-level--${level}`}
                  >
                    {level}
                  </span>
                </div>
                <div className="result__bar-track">
                  <div
                    className="result__bar-fill"
                    style={{
                      width: `${pct}%`,
                      background: character.elementColor,
                    }}
                  />
                </div>
                <p className="result__dim-desc">{dim.levels[level]}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* ========== TOP 3 RANKING ========== */}
      {top3.length > 0 && (
        <div className="result__ranking">
          <h2 className="result__section-title">最相似角色 TOP 3</h2>
          <ol className="result__rank-list">
            {top3.map((entry, idx) => {
              const rankElIcon: string | undefined =
                elementIcons[entry.character.element];
              return (
                <li className="result__rank-item" key={entry.character.code}>
                  <span className="result__rank-number">{idx + 1}</span>
                  <img
                    className="result__rank-avatar"
                    src={entry.character.image || entry.character.icon}
                    alt={entry.character.cn}
                  />
                  <div className="result__rank-info">
                    <span className="result__rank-name">
                      {rankElIcon && (
                        <img
                          className="result__rank-element"
                          src={rankElIcon}
                          alt={entry.character.element}
                        />
                      )}
                      {entry.character.cn}
                    </span>
                    <span className="result__rank-score">
                      匹配度 {entry.similarity}%
                    </span>
                  </div>
                  <div className="result__rank-bar-track">
                    <div
                      className="result__rank-bar-fill"
                      style={{
                        width: `${entry.similarity}%`,
                        background: entry.character.elementColor,
                      }}
                    />
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      )}

      {/* ========== ACTION BUTTONS ========== */}
      <div className="result__actions">
        <button
          className="result__btn result__btn--share"
          onClick={handleShare}
          style={{
            borderColor: character.elementColor,
            color: character.elementColor,
          }}
        >
          分享结果
        </button>
        <button className="result__btn result__btn--restart" onClick={onRestart}>
          重新测试
        </button>
      </div>

      {/* ========== TOAST ========== */}
      <div
        className={
          'result__toast' + (toastVisible ? ' result__toast--visible' : '')
        }
        role="status"
        aria-live="polite"
      >
        已复制到剪贴板 ✓
      </div>
    </section>
  );
};

export default ResultScreen;
