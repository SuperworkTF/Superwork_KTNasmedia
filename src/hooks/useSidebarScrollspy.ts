'use client';

import { useState, useEffect } from 'react';

// 모듈 레벨 상수: 컴포넌트 외부 선언 → useEffect 무한 루프 방지
export const SECTION_IDS = ['home', 'projects', 'team'] as const;
export type SectionId = typeof SECTION_IDS[number];

/**
 * Intersection Observer 기반 스크롤스파이 hook
 * rootMargin: '-10% 0px -60% 0px' → detection zone: 화면 상단 10% ~ 하단 40% 구간
 * 여러 섹션 동시 교차 시 boundingClientRect.top 오름차순 → 최상단 섹션 우선
 */
export function useSidebarScrollspy(
  sectionIds: readonly string[] = SECTION_IDS
): string {
  const [activeId, setActiveId] = useState<string>('home');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      {
        rootMargin: '-10% 0px -60% 0px',
        threshold: 0,
      }
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [sectionIds]);
  // sectionIds는 SECTION_IDS(모듈 상수) 참조 → 렌더마다 동일 참조 → 무한 루프 없음

  return activeId;
}
