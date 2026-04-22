'use client';

import { useState, useEffect } from 'react';
import { workflowSections } from '@/data/workflow';

// Depth-1 section IDs + Depth-2 subsection IDs 평탄화
// Depth-3 leaf IDs는 사이드바 링크 대상이 아니므로 제외
const WORKFLOW_SCROLLSPY_IDS: string[] = workflowSections.flatMap((s) => [
  s.id,
  ...(s.children?.map((c) => c.id) ?? []),
]);

/**
 * IntersectionObserver 기반 workflow 페이지 스크롤스파이 hook
 * /workflow 경로에서 현재 뷰포트에 보이는 섹션 ID를 추적한다.
 * 비-workflow 경로에서는 관찰할 DOM 요소가 없으므로 초기값(overview)을 유지.
 */
export function useWorkflowScrollspy(): string {
  const [activeId, setActiveId] = useState<string>(
    workflowSections[0]?.id ?? '',
  );

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
      { rootMargin: '-8% 0px -72% 0px', threshold: 0 },
    );

    WORKFLOW_SCROLLSPY_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return activeId;
}
