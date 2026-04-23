'use client';

import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';

export type CardSliderVariant = 'roomy' | 'solo';

interface CardSliderProps {
  variant: CardSliderVariant;
  ariaLabel: string;
  children: ReactNode;
}

// ──────────────────────────────────────────────────────────────────────────────
// 좌우 스크롤 슬라이더
// scroll-snap 기반 + 컨트롤/프로그레스/엣지 페이드. JS는 상태 표시·버튼 전용.
// ──────────────────────────────────────────────────────────────────────────────
export function CardSlider({ variant, ariaLabel, children }: CardSliderProps) {
  const trackRef = useRef<HTMLUListElement>(null);
  const [count, setCount] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const update = () => {
      const { scrollLeft, scrollWidth, clientWidth } = track;
      const max = Math.max(scrollWidth - clientWidth, 0);
      const revealed = clientWidth > 0 ? Math.min(1, (scrollLeft + clientWidth) / scrollWidth) : 0;
      setProgress(revealed);
      setCanPrev(scrollLeft > 2);
      setCanNext(scrollLeft < max - 2);

      const items = Array.from(track.children) as HTMLElement[];
      setCount(items.length);
      if (items.length === 0) return;

      let bestIdx = 0;
      let bestDist = Infinity;
      for (let i = 0; i < items.length; i++) {
        const dist = Math.abs(items[i].offsetLeft - scrollLeft);
        if (dist < bestDist) {
          bestDist = dist;
          bestIdx = i;
        }
      }
      setActiveIndex(bestIdx);
    };

    update();
    track.addEventListener('scroll', update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(track);

    return () => {
      track.removeEventListener('scroll', update);
      ro.disconnect();
    };
  }, []);

  const scrollByCard = (dir: -1 | 1) => {
    const track = trackRef.current;
    if (!track) return;
    const first = track.firstElementChild as HTMLElement | null;
    if (!first) return;
    const gap = parseFloat(getComputedStyle(track).columnGap) || 16;
    const step = first.getBoundingClientRect().width + gap;
    track.scrollBy({ left: step * dir, behavior: 'smooth' });
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      scrollByCard(1);
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      scrollByCard(-1);
    } else if (event.key === 'Home') {
      event.preventDefault();
      trackRef.current?.scrollTo({ left: 0, behavior: 'smooth' });
    } else if (event.key === 'End') {
      event.preventDefault();
      const track = trackRef.current;
      if (track) track.scrollTo({ left: track.scrollWidth, behavior: 'smooth' });
    }
  };

  const pad = (n: number) => String(Math.max(n, 0)).padStart(2, '0');

  return (
    <div
      className={`workflow-slider workflow-slider--${variant}`}
      data-can-prev={canPrev ? 'true' : 'false'}
      data-can-next={canNext ? 'true' : 'false'}
      role="region"
      aria-roledescription="carousel"
      aria-label={ariaLabel}
      tabIndex={0}
      onKeyDown={onKeyDown}
    >
      <div className="workflow-slider__controls">
        <span
          className="workflow-slider__counter"
          aria-live="polite"
          aria-atomic="true"
        >
          <span className="workflow-slider__counter-current">
            {pad(count === 0 ? 0 : activeIndex + 1)}
          </span>
          <span className="workflow-slider__counter-sep" aria-hidden="true">
            /
          </span>
          <span className="workflow-slider__counter-total">{pad(count)}</span>
        </span>
        <button
          type="button"
          className="workflow-slider__btn"
          onClick={() => scrollByCard(-1)}
          disabled={!canPrev}
          aria-label="이전 카드"
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path
              d="M10 3L5 8L10 13"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <button
          type="button"
          className="workflow-slider__btn"
          onClick={() => scrollByCard(1)}
          disabled={!canNext}
          aria-label="다음 카드"
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path
              d="M6 3L11 8L6 13"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      <div className="workflow-slider__viewport">
        <ul ref={trackRef} role="list" className="workflow-slider__track">
          {children}
        </ul>
        <span
          className="workflow-slider__fade workflow-slider__fade--left"
          aria-hidden="true"
        />
        <span
          className="workflow-slider__fade workflow-slider__fade--right"
          aria-hidden="true"
        />
      </div>

      <div className="workflow-slider__progress" aria-hidden="true">
        <span
          className="workflow-slider__progress-fill"
          style={{ transform: `scaleX(${progress})` }}
        />
      </div>
    </div>
  );
}
