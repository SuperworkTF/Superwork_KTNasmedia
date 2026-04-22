export interface TeamMember {
  username: string;
  displayName: string;
  role: string;
  description: string;
  project: string;
  githubUrl: string;
  avatarUrl: string;
}

export const team: TeamMember[] = [
  {
    username: 'elymas',
    displayName: 'elymas',
    role: 'TODO: 역할 확인 필요',        // TODO: confirm role
    description: 'TODO: 설명 확인 필요', // TODO: confirm description
    project: 'TODO',                      // TODO: confirm project
    githubUrl: 'https://github.com/elymas',
    avatarUrl: 'https://github.com/elymas.png',
  },
  {
    username: 'LimSuyun',
    displayName: 'LimSuyun',
    role: 'openai-image-mcp-server 개발자',
    description: 'MCP 서버 · OpenAI 이미지 AI 통합',
    project: 'openai-image-mcp-server',
    githubUrl: 'https://github.com/LimSuyun',
    avatarUrl: 'https://github.com/LimSuyun.png',
  },
  {
    username: 'simsimhae91',
    displayName: 'simsimhae91',
    role: 'TAS 개발자',
    description: 'Claude Code 플러그인 · 다중 에이전트 오케스트레이션',
    project: 'tas',
    githubUrl: 'https://github.com/simsimhae91',
    avatarUrl: 'https://github.com/simsimhae91.png',
  },
  {
    username: 'jmp0813',
    displayName: 'jmp0813',
    role: 'TODO: 역할 확인 필요',        // TODO: confirm role
    description: 'TODO: 설명 확인 필요', // TODO: confirm description
    project: 'TODO',                      // TODO: confirm project
    githubUrl: 'https://github.com/jmp0813',
    avatarUrl: 'https://github.com/jmp0813.png',
  },
];
