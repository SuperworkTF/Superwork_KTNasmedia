export interface TeamMember {
  username: string;
  displayName: string;
  role: string;
  tagline?: string;
  description: string;
  project?: string;
  githubUrl: string;
  avatarUrl: string;
}

export const team: TeamMember[] = [
  {
    username: 'elymas',
    displayName: '임성학',
    role: '현장 배포 엔지니어 · PM',
    tagline: '"당연한 것에 질문을 던지고, 문제를 재정의하며, 실질적인 해결책을 설계합니다."',
    description:
      '비즈니스 문제의 본질을 재정의하고, 데이터와 AI를 활용해 가장 실용적이고 강력한 해답을 설계합니다. Superwork 워크플로우를 통해 기획부터 배포까지의 과정을 AI 에이전트 기반으로 자동화하며, 일하는 방식의 새로운 기준을 제시합니다.',
    githubUrl: 'https://github.com/elymas',
    avatarUrl: 'https://github.com/elymas.png',
  },
  {
    username: 'LimSuyun',
    displayName: 'LimSuyun',
    role: 'openai-image-mcp-server 개발자',
    tagline: undefined,
    description: 'OpenAI 이미지 생성 MCP 서버를 설계하고 개발했습니다. DALL-E 3와 gpt-image-1을 Claude Desktop, Cursor, VS Code 등 멀티플랫폼에서 바로 사용할 수 있도록 6종의 도구를 구현했습니다. 인페인팅·스프라이트 시트 생성 등 전문가 수준의 이미지 워크플로우를 AI 에이전트에 통합하는 데 집중합니다.',
    project: 'openai-image-mcp-server',
    githubUrl: 'https://github.com/LimSuyun',
    avatarUrl: 'https://github.com/LimSuyun.png',
  },
  {
    username: 'simsimhae91',
    displayName: 'simsimhae91',
    role: 'TAS 개발자',
    tagline: undefined,
    description: 'TAS(Thesis Antithesis Synthesis) 변증법 워크플로우 엔진을 설계하고 구현했습니다. 두 AI 에이전트가 논쟁하며 코드 품질을 높이는 핵심 PingPong 메커니즘과 컨텍스트 3계층 격리 구조를 개발했습니다. Superwork의 모든 프로젝트가 이 시스템 위에서 운영됩니다.',
    project: 'tas',
    githubUrl: 'https://github.com/simsimhae91',
    avatarUrl: 'https://github.com/simsimhae91.png',
  },
  {
    username: 'jmp0813',
    displayName: 'jmp0813',
    role: 'self-healing 개발 담당',
    tagline: undefined,
    description: 'Self-Healing 자가 복구 시스템을 개발하고 있습니다. Sentry와 Firebase Crashlytics로부터 운영 에러를 실시간 수집해 TAS 워크플로우로 자동 수정 PR을 생성하는 파이프라인을 구축합니다. 사람의 개입 없이 서비스가 스스로 회복하는 것을 목표로 합니다.',
    project: 'self-healing',
    githubUrl: 'https://github.com/jmp0813',
    avatarUrl: 'https://github.com/jmp0813.png',
  },
];
