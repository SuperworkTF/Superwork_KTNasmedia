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
    role: 'Forward Deployed Engineer · PM',
    tagline: '"당연한 것에 질문을 던지고, 문제를 재정의하며, 실질적인 해결책을 설계합니다."',
    description:
      '비즈니스 문제의 본질을 재정의하고, 데이터와 AI를 활용해 가장 실용적이고 강력한 해답을 설계합니다. Superwork 워크플로우를 통해 기획부터 배포까지의 과정을 AI 에이전트 기반으로 자동화하며, 일하는 방식의 새로운 기준을 제시합니다.',
    githubUrl: 'https://github.com/elymas',
    avatarUrl: 'https://github.com/elymas.png',
  },
  {
    username: 'LimSuyun',
    displayName: '임수연',
    role: 'AI Creative Engineer',
    tagline: '"AI가 창작하도록 도구를 쥐여주고, 그 도구로 직접 만듭니다."',
    description: 'Superwork 워크플로우 위에서 에이전트가 협업하고 창작하는 여러 구조를 설계하며, 가장 효과적인 흐름을 찾아갑니다. AI 에이전트가 이미지·사운드·영상 같은 창작물을 스스로 만들 수 있는 파이프라인(MCP)을 직접 설계·구축하고, 그 도구로 게임과 앱, 서비스를 실제로 출시합니다. 도구를 만드는 사람과 그 도구를 쓰는 사람의 경계를 허물어, 아이디어가 결과물에 도달하는 거리를 최단으로 좁힙니다.',
    project: 'openai-image-mcp-server',
    githubUrl: 'https://github.com/LimSuyun',
    avatarUrl: 'https://github.com/LimSuyun.png',
  },
  {
    username: 'simsimhae91',
    displayName: '김호수',
    role: 'AI Agent Architect',
    tagline: '"문제를 재정의하고, 스스로 개선하는 시스템을 설계합니다."',
    description: '문제의 표면이 아니라 구조를 다시 정의하고, AI와 개발 워크플로우의 경계를 설계해 반복 가능한 품질을 만듭니다. 도구 스스로가 자신을 개선하는 루프를 만드는 데 관심이 있습니다.',
    project: 'tas',
    githubUrl: 'https://github.com/simsimhae91',
    avatarUrl: 'https://github.com/simsimhae91.png',
  },
  {
    username: 'jmp0813',
    displayName: '박정민',
    role: 'Devops Engineer',
    tagline: '"흐름을 잇고, 스스로 지속되게 합니다."',
    description: '결과물이 사용자에게 닿기까지의 마지막 여정을 책임집니다. Superwork가 스스로 문제를 찾아 회복하게 함으로써 사람의 손을 거치지 않고도 신뢰할 수 있는 소프트웨어가 세상에 나아가는 과정을 만들어갑니다.',
    project: 'self-healing',
    githubUrl: 'https://github.com/jmp0813',
    avatarUrl: 'https://github.com/jmp0813.png',
  },
];
