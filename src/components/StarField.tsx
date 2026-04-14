import React from 'react';

const stars = Array.from({ length: 80 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 2 + 1,
  delay: Math.random() * 5,
  duration: Math.random() * 3 + 2,
}));

const StarField: React.FC = () => {
  return (
    <div className="starfield">
      {stars.map(star => (
        <span
          key={star.id}
          className="star"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            '--delay': `${star.delay}s`,
            '--duration': `${star.duration}s`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
};

export default StarField;
