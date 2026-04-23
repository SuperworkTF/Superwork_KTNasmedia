// ──────────────────────────────────────────────────────────────────────────────
// /workflow 페이지 콘텐츠 타입 정의
// adk.mo.ai.kr 스타일 다뎁스 섹션 네비 + 본문 콘텐츠를 표현하는 타입 계층
// ──────────────────────────────────────────────────────────────────────────────

/**
 * 최하위 리프 노드 (Depth 3)
 * 자식을 가지지 않는 개별 주제 단위.
 * 페이지 내 TOC에만 표시; 좌측 섹션 네비에는 미노출.
 */
export interface WorkflowLeaf {
  /** 섹션 앵커 ID (URL hash, e.g. 'brainstorm') */
  id: string;
  /** 사용자 노출 한국어 타이틀 (본문/heading 기본값) */
  title: string;
  /**
   * 좌측 사이드바 전용 라벨 오버라이드 (선택).
   * 지정 시 사이드바/DetailSidebar에 표시되는 라벨로 사용.
   * 상세 페이지 본문/heading은 여전히 `title`을 사용한다.
   */
  navLabel?: string;
  /** 마크다운 형식의 본문 텍스트 (선택) */
  body?: string;
  /**
   * 개발자용 소스 힌트 — TAS(simsimhae91/tas) 파일 경로 참조.
   * 렌더링되지 않으며 문서화·유지보수 용도로만 사용.
   * (주석 전용 필드: UI에 절대 노출 금지)
   */
  sourceHint?: string;
}

/**
 * 중간 노드 (Depth 2)
 * 좌측 섹션 네비의 들여쓰기 항목으로 표시.
 * 하위에 WorkflowLeaf 배열을 선택적으로 가질 수 있음.
 */
export interface WorkflowSubsection {
  id: string;
  title: string;
  /**
   * 좌측 사이드바 전용 라벨 오버라이드 (선택).
   * 지정 시 사이드바/DetailSidebar에 표시되는 라벨로 사용.
   * 상세 페이지 본문/heading은 여전히 `title`을 사용한다.
   */
  navLabel?: string;
  body?: string;
  /**
   * 공개 깃 레포 URL (선택).
   * 지정 시 상세 페이지 heading 옆에 GitHub 링크로 표시된다.
   * 비공개 레포 URL은 절대 넣지 않는다.
   */
  repoUrl?: string;
  /** Depth 3 하위 항목 (선택) */
  children?: WorkflowLeaf[];
  sourceHint?: string;
}

/**
 * 최상위 섹션 (Depth 1)
 * 좌측 섹션 네비의 토글 버튼으로 표시.
 * 클릭 시 확장/축소; 활성 섹션은 하이라이트.
 */
export interface WorkflowSection {
  id: string;
  title: string;
  /**
   * 좌측 사이드바 전용 라벨 오버라이드 (선택).
   * 지정 시 사이드바/DetailSidebar에 표시되는 라벨로 사용.
   * 상세 페이지 본문/heading은 여전히 `title`을 사용한다.
   */
  navLabel?: string;
  body?: string;
  /** Depth 2 하위 항목 (선택) */
  children?: WorkflowSubsection[];
  sourceHint?: string;
}

/** 히어로 카피 타입 */
export interface WorkflowHeroCopy {
  /** 메인 헤드라인 (개행 포함 가능) */
  headline: string;
  /** 서브카피 */
  subcopy: string;
  /** CTA 버튼 레이블 (선택) */
  ctaLabel?: string;
}
