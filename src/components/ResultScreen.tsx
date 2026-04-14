import React, { useMemo } from 'react';
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
  splashArt?: Record<string, string>;
  onRestart: () => void;
}

function levelToPct(level: Level): number {
  return level === 'H' ? 90 : level === 'M' ? 50 : 10;
}

const ResultScreen: React.FC<ResultScreenProps> = ({ result, splashArt, onRestart }) => {
  const { finalType: character, ranked, levels, badge, sub } = result;

  const splash = useMemo(
    () => splashArt?.[character.code] ?? character.splash,
    [splashArt, character],
  );

  const elIcon: string | undefined = elementIcons[character.element];
  const top3 = ranked.slice(0, 3);

  return (
    <section className="result" aria-label="测试结果">
      {/* ═══════ HERO — Cinematic Splash Reveal ═══════ */}
      <div
        className="result__hero"
        style={{ '--el-color': character.elementColor } as React.CSSProperties}
      >
        {splash && (
          <div className="result__splash-viewport">
            <img
              src={splash}
              alt={character.cn}
              className="result__splash-art"
              draggable={false}
            />
            <div className="result__splash-fade" aria-hidden="true" />
            <div className="result__splash-vignette" aria-hidden="true" />
            <div className="result__splash-top" aria-hidden="true" />
          </div>
        )}

        <div className="result__shimmer" aria-hidden="true" />

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

        {/* Restart Button (single) */}
        <div className="result__actions">
          <button
            className="result__btn result__btn--restart"
            onClick={onRestart}
          >
            重新测试
          </button>
        </div>

        {/* Disclaimer */}
        <footer className="result__disclaimer">
          本测试为粉丝自制娱乐项目，与米哈游/HoYoverse 无关。<br />
          游戏素材版权归上海米哈游/COGNOSPHERE PTE. LTD. 所有。
        </footer>
      </div>
    </section>
  );
};

export default ResultScreen;
