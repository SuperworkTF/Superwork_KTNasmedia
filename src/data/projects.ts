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
    id: 'openai-image-mcp-server',
    title: 'openai-image-mcp-server',
    displayTitle: 'OpenAI Image MCP Server',
    subtitle: 'OpenAI 이미지 생성 MCP 서버',
    description:
      'DALL-E 3 & gpt-image-1로 이미지를 생성·편집·변형하는 MCP 서버',
    link: 'https://github.com/LimSuyun/openai-image-mcp-server',
    tags: ['Node.js', 'MCP', 'DALL-E', 'Image AI'],
    icon: '🎨',
    gradientFrom: '#EC4899',
    gradientTo: '#A855F7',
    features: [
      '텍스트 프롬프트 → 이미지 생성 (DALL-E 2 / DALL-E 3 / gpt-image-1)',
      '이미지 편집 & 인페인팅 마스킹',
      '스타일 변형 생성',
      '게임 캐릭터 3프레임 스프라이트 시트 자동 생성',
      'Claude Desktop · Cursor · VS Code 멀티플랫폼 지원',
    ],
    accentColor: 'aurora',
    relatedWorkflowId: 'core-imagegen',
  },
];
