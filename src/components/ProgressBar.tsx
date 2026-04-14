import React from 'react';

interface ProgressBarProps {
  progress: number; // 0 to 1
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {
  const percent = Math.min(Math.max(progress, 0), 1) * 100;

  return (
    <div className="progress-bar">
      <div
        className="progress-bar__fill"
        style={{ width: `${percent}%` }}
      />
    </div>
  );
};

export default ProgressBar;
