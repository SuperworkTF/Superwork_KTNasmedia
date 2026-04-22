export interface TeamMember {
  username: string;
  displayName: string;
  role: string;
  tagline?: string;
  description: string;
  project: string;
  githubUrl: string;
  avatarUrl: string;
}

export const team: TeamMember[] = [
  {
    username: 'elymas',
    displayName: '임성학',
    role: 'Forward Deployed Engineer & PM',
    tagline: '"당연한 것에 질문을 던지고, 문제를 재정의하며, 실질적인 해결책을 설계합니다."',
    description:
      '비즈니스 문제의 본질을 재정의하고, 데이터와 AI를 활용해 가장 실용적이고 강력한 해답을 설계합니다. Superwork 워크플로우를 통해 기획부터 배포까지의 과정을 AI 에이전트 기반으로 자동화하며, 일하는 방식의 새로운 기준을 제시합니다.',
    project: 'TODO',
    githubUrl: 'https://github.com/elymas',
    avatarUrl: 'https://github.com/elymas.png',
  },
  {
    username: 'LimSuyun',
    displayName: 'LimSuyun',
    role: 'openai-image-mcp-server 개발자',
    tagline: undefined,
    description: 'MCP 서버 · OpenAI 이미지 AI 통합',
    project: 'openai-image-mcp-server',
    githubUrl: 'https://github.com/LimSuyun',
    avatarUrl: 'https://github.com/LimSuyun.png',
  },
  {
    username: 'simsimhae91',
    displayName: 'simsimhae91',
    role: 'TAS 개발자',
    tagline: undefined,
    description: 'Claude Code 플러그인 · 다중 에이전트 오케스트레이션',
    project: 'tas',
    githubUrl: 'https://github.com/simsimhae91',
    avatarUrl: 'https://github.com/simsimhae91.png',
  },
  {
    username: 'jmp0813',
    displayName: 'jmp0813',
    role: 'TODO: 역할 확인 필요',
    tagline: undefined,
    description: 'TODO: 설명 확인 필요',
    project: 'TODO',
    githubUrl: 'https://github.com/jmp0813',
    avatarUrl: 'https://github.com/jmp0813.png',
  },
];
