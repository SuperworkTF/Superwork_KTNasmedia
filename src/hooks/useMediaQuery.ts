'use client';

import { useState, useEffect } from 'react';

/**
 * 반응형 미디어쿼리 감지 hook (SSR-safe)
 * 서버 기본값 false로 초기화 → hydration mismatch 방지
 * useEffect에서 실제 값으로 업데이트
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(query);
    // initializer와 effect 사이 창 크기 변경 edge case 대비
    setMatches(mq.matches);
    const listener = (e: MediaQueryListEvent) => setMatches(e.matches);
    mq.addEventListener('change', listener);
    return () => mq.removeEventListener('change', listener);
  }, [query]);

  return matches;
}
