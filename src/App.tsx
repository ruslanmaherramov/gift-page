import { useState, useCallback, useRef } from 'react';
import './App.scss';

function randomOffset() {
  const sign = Math.random() < 0.5 ? -1 : 1;
  return sign * (50 + Math.random() * 70);
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

export function App() {
  const btnRef = useRef<HTMLButtonElement>(null);
  const [noButtonPosition, setNoButtonPosition] = useState<{ top: number; left: number } | null>(null);
  const [answered, setAnswered] = useState(false);

  const moveNoButton = useCallback(() => {
    const btn = btnRef.current;
    if (!btn) return;

    const rect = btn.getBoundingClientRect();
    const currentX = rect.left;
    const currentY = rect.top;

    const maxX = window.innerWidth - rect.width - 10;
    const maxY = window.innerHeight - rect.height - 10;

    const newX = clamp(currentX + randomOffset(), 10, maxX);
    const newY = clamp(currentY + randomOffset(), 10, maxY);

    setNoButtonPosition({ left: newX, top: newY });
  }, []);

  const handleYes = () => {
    setAnswered(true);
  };

  const emojis = ['🎈', '❤️', '🎈', '💖', '🎈', '💗', '🎈', '💕', '🎈', '💘'];
  const balloons = Array.from({ length: 20 }).map((_, i) => ({
    emoji: emojis[i % emojis.length],
    left: Math.random() * 100,
    delay: Math.random() * 4,
    duration: 4 + Math.random() * 4,
    size: 2.5 + Math.random() * 2,
  }));

  if (answered) {
    return (
      <div className="gift-card">
        <div className="gift-card__hearts">
          {balloons.map((b, i) => (
            <span
              key={i}
              className="gift-card__floating-heart"
              style={{
                left: `${b.left}%`,
                animationDelay: `${b.delay}s`,
                animationDuration: `${b.duration}s`,
                fontSize: `${b.size}rem`,
              }}
            >
              {b.emoji}
            </span>
          ))}
        </div>
        <div className="gift-card__card gift-card__card--yes">
          <h1 className="gift-card__title">Ураааа! 🥰</h1>

          <p className="gift-card__subtitle">Я тебе дуже люблю 💕</p>
          <p className="gift-card__subtitle gift-card__subtitle--small">Приходь дивитись серіал! 🍿</p>
        </div>
      </div>
    );
  }

  return (
    <div className="gift-card">
      <h1 className="gift-card__heading">Олічка, привіт! Це листівка вибачення:</h1>
      <div className="gift-card__card">
        <p className="gift-card__title">Будемо миритись? 💖</p>
        <p className="gift-card__hint">(хехе спробуй натиснути Ні)</p>
        <div className="gift-card__buttons">
          <button className="gift-card__btn gift-card__btn--yes" onClick={handleYes}>
            Так
          </button>
          <button
            ref={noButtonPosition === null ? btnRef : undefined}
            className="gift-card__btn gift-card__btn--no"
            onMouseEnter={noButtonPosition === null ? moveNoButton : undefined}
            onTouchStart={noButtonPosition === null ? moveNoButton : undefined}
            style={noButtonPosition === null ? undefined : { visibility: 'hidden' as const }}
          >
            Ні
          </button>
        </div>
      </div>

      {noButtonPosition !== null && (
        <button
          ref={btnRef}
          className="gift-card__btn gift-card__btn--no gift-card__btn--floating"
          style={{ top: noButtonPosition.top, left: noButtonPosition.left }}
          onMouseEnter={moveNoButton}
          onTouchStart={moveNoButton}
        >
          Ні
        </button>
      )}
    </div>
  );
}
