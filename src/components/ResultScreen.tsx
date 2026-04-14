import React, { useMemo, useState, useCallback } from 'react';
import { elementIcons } from '../data/elementIcons';
import { dimensions } from '../data/dimensions';
import type { Character, MatchResult, Level } from '../types';

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

function levelToPct(level: Level): number {
  return level === 'H' ? 90 : level === 'M' ? 50 : 10;
}

const ResultScreen: React.FC<ResultScreenProps> = ({ result, onRestart }) => {
  const { finalType: character, ranked, levels, badge, sub } = result;
  const [toastVisible, setToastVisible] = useState(false);

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

  const elIcon: string | undefined = elementIcons[character.element];
  const top3 = ranked.slice(0, 3);

  return (
    <section className="result" aria-label="测试结果">
      {/* ═══════ HERO — Cinematic Splash Reveal ═══════ */}
      <div
        className="result__hero"
        style={{ '--el-color': character.elementColor } as React.CSSProperties}
      >
        {character.splash && (
          <div className="result__splash-viewport">
            <img
              src={character.splash}
              alt={character.cn}
              className="result__splash-art"
              draggable={false}
            />
            {/* bottom gradient fade */}
            <div className="result__splash-fade" aria-hidden="true" />
            {/* side vignette */}
            <div className="result__splash-vignette" aria-hidden="true" />
            {/* top subtle darken for breathing room */}
            <div className="result__splash-top" aria-hidden="true" />
          </div>
        )}

        {/* golden shimmer particles */}
        <div className="result__shimmer" aria-hidden="true" />

        {/* Character Identity — overlaid at bottom */}
        <div className="result__identity">
          <div className="result__stars" aria-hidden="true">
            <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
          </div>

          <div className="result__name-group">
            {elIcon && (
              <img
                className="result__el-icon"
                src={elIcon}
                alt={character.element}
              />
            )}
            <h1
              className="result__char-name"
              style={{ color: character.elementColor }}
            >
              {character.cn}
            </h1>
          </div>

          <div
            className="result__rule"
            style={{
              background: `linear-gradient(90deg, transparent, ${character.elementColor}55, transparent)`,
            }}
          />

          <p className="result__badge">{badge}</p>
          <p className="result__sub">{sub}</p>
          <p className="result__similarity">
            匹配度 <strong>{result.similarity}%</strong>
          </p>
        </div>
      </div>

      {/* ═══════ BODY CONTENT ═══════ */}
      <div className="result__body">
        {/* Description */}
        <div className="result__text-section">
          <p className="result__intro">{character.intro}</p>
          <p className="result__desc">{character.desc}</p>
        </div>

        {/* Dimension Bars */}
        <div className="result__dimensions">
          <h2 className="result__heading">
            <span className="result__heading-ornament">◆</span>
            维度详情
            <span className="result__heading-ornament">◆</span>
          </h2>
          <div className="result__dim-grid">
            {dimensions.map((dim) => {
              const level = levels[dim.key] ?? 'M';
              const pct = levelToPct(level);
              return (
                <div className="result__dim" key={dim.key}>
                  <div className="result__dim-header">
                    <span className="result__dim-name">{dim.name}</span>
                    <span
                      className={`result__dim-level result__dim-level--${level}`}
                    >
                      {level}
                    </span>
                  </div>
                  <div className="result__bar">
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

        {/* TOP 3 Ranking */}
        {top3.length > 0 && (
          <div className="result__ranking">
            <h2 className="result__heading">
              <span className="result__heading-ornament">◆</span>
              最相似角色 TOP 3
              <span className="result__heading-ornament">◆</span>
            </h2>
            <ol className="result__top3">
              {top3.map((entry, idx) => {
                const rElIcon = elementIcons[entry.character.element];
                return (
                  <li className="result__rank" key={entry.character.code}>
                    <span className="result__rank-n">{idx + 1}</span>
                    <img
                      className="result__rank-avatar"
                      src={entry.character.image || entry.character.icon}
                      alt={entry.character.cn}
                    />
                    <div className="result__rank-meta">
                      <span className="result__rank-name">
                        {rElIcon && (
                          <img
                            className="result__rank-el"
                            src={rElIcon}
                            alt=""
                          />
                        )}
                        {entry.character.cn}
                      </span>
                      <span className="result__rank-pct">
                        {entry.similarity}%
                      </span>
                    </div>
                    <div className="result__rank-bar">
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

        {/* Action Buttons */}
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
          <button
            className="result__btn result__btn--restart"
            onClick={onRestart}
          >
            重新测试
          </button>
        </div>
      </div>

      {/* ═══════ TOAST ═══════ */}
      <div
        className={
          'result__toast' + (toastVisible ? ' result__toast--show' : '')
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
