import React from 'react';

interface IntroScreenProps {
  onStart: () => void;
}

const IntroScreen: React.FC<IntroScreenProps> = ({ onStart }) => {
  return (
    <div className="screen intro">
      <div className="intro__star-icon">
        <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M24 2L29.4 18.6H46.8L32.7 29.4L38.1 46L24 35.2L9.9 46L15.3 29.4L1.2 18.6H18.6L24 2Z"
            fill="url(#starGrad)"
            stroke="rgba(212,168,80,0.4)"
            strokeWidth="0.5"
          />
          <defs>
            <linearGradient id="starGrad" x1="0" y1="0" x2="48" y2="48">
              <stop offset="0%" stopColor="#d4a850" />
              <stop offset="100%" stopColor="#ffd666" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <h1 className="intro__title gold-text">YSTI</h1>
      <p className="intro__subtitle">原神人格类型指标</p>
      <p className="intro__desc">
        20 道题，10 个维度，32 位角色——找到提瓦特中的你
      </p>
      <p className="intro__version">v2.0</p>

      <button className="btn-gold" onClick={onStart}>
        开始测试
      </button>
    </div>
  );
};

export default IntroScreen;
