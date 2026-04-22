'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { workflowSections } from '@/data/workflow';

// Depth-1 section IDs + Depth-2 subsection IDs 평탄화
// Depth-3 leaf IDs는 사이드바 링크 대상이 아니므로 제외
const WORKFLOW_SCROLLSPY_IDS: string[] = workflowSections.flatMap((s) => [
  s.id,
  ...(s.children?.map((c) => c.id) ?? []),
]);

/**
 * IntersectionObserver 기반 workflow 페이지 스크롤스파이 hook
 *
 * /workflow 경로에서만 현재 뷰포트에 보이는 섹션 ID를 추적한다.
 * 비-workflow 경로(예: /team, /)에서는 빈 문자열을 반환해
 * 사이드바 3-depth 항목에 잘못된 active 상태가 들어가는 회귀를 방지한다.
 * (이전: 초기값을 workflowSections[0].id = 'overview'로 두면서
 *  Team 선택 시에도 '개요'가 active로 표시되는 버그가 있었음.)
 */
export function useWorkflowScrollspy(): string {
  const pathname = usePathname();
  const isOnWorkflow = pathname?.startsWith('/workflow') ?? false;

  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    // Workflow 경로 밖에서는 스크롤스파이 비활성: active 상태를 항상 비움.
    if (!isOnWorkflow) {
      setActiveId('');
      return;
    }

    // URL hash가 유효한 섹션 ID면 그 섹션으로 초기화, 아니면 첫 섹션
    const hash = typeof window !== 'undefined' ? window.location.hash.slice(1) : '';
    const initialId =
      hash && WORKFLOW_SCROLLSPY_IDS.includes(hash)
        ? hash
        : workflowSections[0]?.id ?? '';
    setActiveId(initialId);

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
  }, [isOnWorkflow]);

  return activeId;
}
