export interface Project {
  id: string;
  title: string;
  displayTitle: string;
  subtitle: string;
  description: string;
  link?: string;
  tags: string[];
  icon: string;
  gradientFrom: string;
  gradientTo: string;
  features: string[];
  accentColor: 'ember' | 'aurora';
  /** /workflow 페이지에서 이 프로젝트를 다루는 섹션 ID */
  relatedWorkflowId?: string;
}

export const projects: Project[] = [
  {
    id: 'tas',
    title: 'tas',
    displayTitle: 'TAS',
    subtitle: '변증법적 AI 워크플로우 플러그인',
    description:
      '두 AI 에이전트가 논쟁하며 더 나은 코드를 만드는 Claude Code 플러그인',
    link: 'https://github.com/simsimhae91/tas',
    tags: ['Python', 'Claude Code', 'AI Agent', 'Dialectic'],
    icon: '⚖️',
    gradientFrom: '#F97316',
    gradientTo: '#A855F7',
    features: [
      '/tas — 기획→구현→검증→테스트 정반합 워크플로우 실행',
      '다중 에이전트 오케스트레이션 (정 · 반 · 합)',
      '자동 복잡도 분류 (simple / medium / complex)',
      '누적 학습 (lessons.md 자동 기록)',
      '컨텍스트 3계층 격리 — 토큰 소비 최소화',
      '/tas-review · /tas-verify · /tas-explain · /tas-workspace',
    ],
    accentColor: 'ember',
    relatedWorkflowId: 'core-tas',
  },
  {
    id: 'minigame-assets-mcp',
    title: 'minigame-assets-mcp',
    displayTitle: 'Minigame Assets MCP',
    subtitle: '게임 에셋 생성 MCP 서버',
    description:
      'Claude와 대화하면서 캐릭터·스프라이트·배경·UI·로고까지 게임 에셋을 자동 생성하는 MCP 서버',
    link: 'https://github.com/LimSuyun/minigame-assets-mcp',
    tags: ['TypeScript', 'MCP', 'Game Assets'],
    icon: '🎮',
    gradientFrom: '#EC4899',
    gradientTo: '#A855F7',
    features: [
      '캐릭터 베이스 → 장비 결합 → 스프라이트 시트 자동 생성 (Phaser · Unity · Cocos atlas 동반)',
      '배경 · 로딩/로비 화면 · parallax 다층 레이어 일괄 생성',
      'HUD · 버튼 · 팝업 · 아이콘 · 스타일 레퍼런스 시트',
      '타이틀 워드마크, 앱 로고·썸네일, 스토어 배너, SNS 마케팅 팩',
      'CONCEPT.md 기반 컨셉 → 실행 계획 → 생성 → 검증 → 배포 파이프라인',
    ],
    accentColor: 'aurora',
    relatedWorkflowId: 'core-minigame-assets',
  },
];
