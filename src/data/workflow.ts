// ──────────────────────────────────────────────────────────────────────────────
// /workflow 페이지 콘텐츠 데이터
// TAS_WORKFLOW_SHOWCASE.md 기반: Discovery & Planning 8장 + Story Cycle 6장
// ──────────────────────────────────────────────────────────────────────────────

import type { WorkflowHeroCopy, WorkflowSection } from '@/lib/workflow';

// ── 히어로 카피 (안 C — 팩트 드리븐 선언형) ────────────────────────────────
export const heroCopy: WorkflowHeroCopy = {
  headline: '신사업, 이제 명령어 하나로 시작한다.\nSuperwork가 선택한 변증법 AI 개발 방법론.',
  subcopy:
    '아이디어를 입력하면 기획·개발·검증·통합이 자동으로 진행됩니다. 우리는 이 시스템으로 Superwork의 모든 프로젝트를 운영합니다.',
  ctaLabel: '워크플로우 살펴보기',
};

// ── 섹션 데이터 ──────────────────────────────────────────────────────────────
export const workflowSections: WorkflowSection[] = [
  // ── Depth 1: 개요 ──────────────────────────────────────────────────────────
  {
    id: 'overview',
    title: '개요',
    body: `Superwork팀은 프로젝트를 Superwork Workflow로 시작합니다. 정반합(正反合) 변증법 기반 멀티 에이전트 시스템이 아이디어 강화부터 배포까지 전 과정을 자동화합니다.

ThesisAgent(正)가 초안을 제시하면 AntithesisAgent(反)가 검증하고, ACCEPT Verdict가 나올 때까지 반복해 산출물 품질을 끌어올립니다.\n
**사람은 방향을 정하고, 시스템이 실행합니다.**`,
  },

  // ── Depth 1: 시작하기: tas init ────────────────────────────────────────────
  {
    id: 'tas-init',
    title: '시작하기: tas init',
    body: '`tas init` 한 번이면 개발 환경이 완성됩니다. 안전 가드 하네스 설치, 프로젝트 설정 자동화, 환경 변수 구성이 한 번에 처리됩니다.',
    children: [
      {
        id: 'harness',
        title: '하네스 자동 설치',
        body: '`tas init` 실행 시 `.claude/hooks/` 디렉터리에 6종의 안전 가드가 자동으로 복사됩니다.\n\n- **bash_safety_guard.py** — 파괴적 Bash 명령(`rm -rf`, `git reset --hard` 등) 차단\n- **protected_file_guard.py** — 상태 파일(`.env`, `sprint-status.yaml` 등) 무단 수정 방지\n- **content_quality_guard.py** — LLM 슬롭(빈 구현, 플레이스홀더 코드) 감지 및 거부\n- **edit_error_recovery.py** — Edit 도구 실패 시 자동 복구 로직\n- **ruff_lint_check.sh** — 커밋 전 Python 코드 Ruff 린트 검사\n- **commit_message_check.sh** — 커밋 메시지 포맷 규칙 강제\n\n에이전트가 코드를 작성할 때 사람이 개입하지 않아도 품질이 자동으로 유지됩니다.',
      },
      {
        id: 'project-setup',
        title: '프로젝트 설정 자동화',
        body: '프로젝트를 클론하고 `tas init` 한 번이면 팀 모든 구성원이 동일한 에이전트 환경을 공유합니다.\n\n 자동으로 설정되는 항목:\n\n- **settings.json** — Claude Code 권한 정책 + Hook 매핑\n- **CLAUDE.md** — 프로젝트 구조 가이드 (에이전트 컨텍스트 초기화)\n- **rules/tech-stack.md** — 기술 스택 선택 강제 (BaaS, 프레임워크)\n- **.gitignore managed block** — idempotent 삽입으로 중복 없이 패턴 추가',
      },
    ],
  },

  // ── Depth 1: 전체 라이프사이클 ─────────────────────────────────────────────
  {
    id: 'lifecycle',
    title: '전체 라이프사이클: tas lifecycle',
    body: '`tas lifecycle "아이디어"` 명령 하나로 전체 개발 라이프사이클이 시작됩니다.\n\nNavigatorAgent가 아이디어를 분석해 Discovery & Planning 단계를 동적으로 구성하고, Story Cycle이 모든 스토리를 ACCEPT까지 자동 실행합니다.',
    children: [
      // ── Depth 2: 아이디어 강화 ────────────────────────────────────────────
      {
        id: 'idea-enrichment',
        title: '아이디어 강화 (raw → enriched)',
        body: '`tas lifecycle "아이디어"` 입력 시 NavigatorAgent가 아이디어를 분석하고 관련 플랫폼·도메인·경쟁사를 조사해 구조화된 프로젝트 컨셉 문서를 생성합니다.\n\n- 플랫폼 제약·핵심 개념·미결정 항목 구조화\n- 이 문서가 이후 모든 단계(Discovery·Planning·Story Cycle)의 컨텍스트로 공유됩니다.',
      },

      // ── Depth 2: Discovery & Planning ────────────────────────────────────
      {
        id: 'discovery-planning',
        title: 'Discovery & Planning',
        body: 'NavigatorAgent가 프로젝트 성격을 분석해 아래 단계 중 필요한 것만 동적으로 선택·실행합니다. 각 단계는 변증법 루프로 산출물 완성도를 보장합니다.',
        layout: 'cards',
        children: [
          {
            id: 'brainstorm',
            title: 'Brainstorm',
            body: '막연한 아이디어를 구체적 방향으로 흔들어 깨웁니다.\n\n- **산출물**: Brainstorm 세션 기록\n- **언제**: 아이디어가 "한 줄"일 때, 방향을 펼쳐야 할 때\n- **특징**: 단일·다중 기법 가이드 퍼실리테이션 — 발산과 수렴을 한 번에',
          },
          {
            id: 'market-research',
            title: 'Market Research',
            body: '"이거 이미 누가 하고 있나?"에 답하기 전에 넘어가지 않습니다.\n\n- **산출물**: 시장·경쟁·고객 니즈 리포트\n- **언제**: 사업성·차별화가 쟁점일 때\n- **특징**: 경쟁 구도·트렌드·타깃 분석을 구조화된 문서로 — 차별화 포인트를 데이터로 뒷받침',
          },
          {
            id: 'domain-research',
            title: 'Domain Research',
            body: '업계 전문가의 어휘로 말할 수 있게 합니다.\n\n- **산출물**: 도메인 딥다이브 문서 (용어·규제·관행)\n- **언제**: 의료·금융·게임 등 전문 도메인, LLM이 맞는 용어를 못 쓸 때\n- **특징**: 이후 모든 스펙이 "해당 업계 사람이 읽어도 어색하지 않은" 언어로 작성되게 하는 토대',
          },
          {
            id: 'tech-research',
            title: 'Tech Research',
            body: '"만들 수 있나?"를 코드 한 줄 쓰기 전에 검증합니다.\n\n- **산출물**: 기술 타당성·아키텍처 옵션·리스크 리포트\n- **언제**: 생소한 스택, 성능·확장 이슈, 엔진·프레임워크 선정이 필요할 때\n- **특징**: 여러 옵션을 trade-off로 비교 — Architecture 단계 전에 선택지를 정리',
          },
          {
            id: 'create-prd',
            title: 'Create PRD',
            required: true,
            body: '제품 요구사항을 "실행 가능한 문서"로 고정합니다.\n\n- **산출물**: Product Requirements Document\n- **언제**: Discovery가 끝나고 범위를 박아야 할 때\n- **특징**: 에픽·스토리로 바로 쪼갤 수 있는 수준의 요구사항 명세. AntithesisAgent(反)가 검증·수정 루프 동반',
          },
          {
            id: 'create-ux',
            title: 'Create UX',
            body: '화면이 제품의 얼굴이라면, 먼저 얼굴을 그립니다.\n\n- **산출물**: UX 설계서 (플로우·패턴·화면 스펙)\n- **언제**: UI가 제품의 주요 가치일 때\n- **특징**: PRD 위에서 사용자 여정·상호작용 패턴을 설계 — 이후 구현 스토리에 바로 반영',
          },
          {
            id: 'create-architecture',
            title: 'Create Architecture',
            required: true,
            body: '"어떻게 만들지"를 한 문서에 담습니다.\n\n- **산출물**: 기술 아키텍처 문서 (시스템·데이터·통합)\n- **언제**: 구현 전\n- **특징**: 기술 결정·의존성·확장 포인트를 기록 — 이후 Dev 루프의 모든 스토리가 이 문서를 참조',
          },
          {
            id: 'create-epics-stories',
            title: 'Create Epics & Stories',
            navLabel: 'Epics & Stories',
            required: true,
            body: '설계를 "AI가 병렬로 먹을 수 있는 단위"로 쪼갭니다.\n\n- **산출물**: 에픽 + 스토리 리스트\n- **언제**: Architecture 완료 후\n- **특징**: 여기서 쪼개진 스토리 단위가 그대로 병렬 Dev 파이프라인의 입력이 됩니다. 설계와 실행을 잇는 핵심 변환점',
          },
        ],
      },

      // ── Depth 2: Story Cycle ──────────────────────────────────────────────
      {
        id: 'story-cycle',
        title: 'Story Cycle',
        body: '매 스토리마다 독립된 워커트리에서 실행됩니다. Code Review ACCEPT 판정이 나올 때까지 Dev → (QA) → Review → Playtest 루프를 자동 반복합니다.\n\n최대 5개 스토리를 동시에 병렬 진행하며, 완료된 스토리는 자동 머지됩니다. 웨이브 간 통합 무결성은 자동으로 보장됩니다.',
        layout: 'cards-solo',
        children: [
          {
            id: 'sprint-planning',
            title: 'Sprint Planning',
            required: true,
            body: '병렬 실행의 웨이브를 설계합니다.\n\n- **산출물**: 웨이브 그룹 계획 (`execution-plan.yaml`)\n- **언제**: Dev 루프 시작 전\n- **특징**: 의존성을 위상정렬해 "동시에 돌려도 안전한 스토리 묶음"을 구성 — 격리된 워커트리에서 **최대 5개 스토리 병렬 진행**',
          },
          {
            id: 'create-story',
            title: 'Create Story',
            body: '스토리 한 건을 "구현 직전" 상태까지 준비합니다.\n\n- **산출물**: 컨텍스트가 채워진 스토리 파일\n- **언제**: 각 스토리 사이클의 시작\n- **특징**: 에픽·아키텍처·이전 스토리 학습을 주입한 풍부한 컨텍스트 — 개발자 AI가 더 이상 물어볼 게 없을 만큼 준비',
          },
          {
            id: 'dev-story',
            title: 'Dev Story',
            body: '격리된 워커트리에서 실제 구현을 진행합니다.\n\n- **산출물**: 실제 코드·테스트·스토리 상태 업데이트\n- **언제**: Create Story 직후\n- **특징**: 워커트리 격리 + 피드백 루프 — Review/Playtest 반려 시 피드백을 먹고 재작업',
          },
          {
            id: 'qa-test',
            title: 'QA 자동화 테스트',
            navLabel: 'QA 자동화',
            body: '리그레션 방지선을 자동으로 세웁니다.\n\n- **산출물**: API/E2E 자동화 테스트 스위트\n- **언제**: 구현된 스토리에 대해 (선택)\n- **특징**: "실행 가능한 안전망" 생성 — 이후 모든 스토리의 변경이 자동으로 검증됨',
          },
          {
            id: 'code-review',
            title: '코드 리뷰',
            body: '정적 품질의 1차 관문입니다.\n\n- **산출물**: REFINE / ACCEPT / COUNTER / HALT 중 하나의 판정\n- **언제**: Dev Story 후\n- **특징**: AntithesisAgent(反)가 AC 충족·코드 품질·일관성을 독립 평가, **ACCEPT 없이 통과 없음, Dev로 회귀**',
          },
          {
            id: 'antithesis-playtest',
            title: 'Antithesis Playtest',
            navLabel: 'Playtest',
            body: 'AC 체크리스트 통과 ≠ 실제로 동작함. 진짜 돌려봅니다.\n\n- **산출물**: 런타임 증거 (스크린샷·로그·판정)\n- **언제**: Code Review ACCEPT 직후 (선택)\n- **특징**: Dev 서버를 실제로 띄우고 **브라우저/프로세스/HTTP 드라이버**로 조작 — 정적 리뷰를 통과했지만 런타임에 깨지는 실패를 잡아냄. 실패 시 Dev로 회귀',
          },
        ],
      },
    ],
  },

  // ── Depth 1: Use Cases ────────────────────────────────────────────────────
  {
    id: 'use-cases',
    title: 'Use Cases',
    body: 'Superwork Workflow로 만든 실제 프로덕트. 모바일 네이티브부터 웹 게임, 설치형 웹앱까지 런타임을 가리지 않습니다.',
    children: [
      {
        id: 'use-cases-products',
        title: '프로덕트 3종 and more..',
        layout: 'cards-solo',
        children: [
          {
            id: 'use-case-flutter',
            title: 'Flutter 앱',
            body: '네이티브 모바일 · TAS 라이프사이클 풀코스',
            image: {
              src: '/workflow/use-cases/flutter.webp',
              alt: 'Flutter 앱 스크린샷',
            },
            imageAspect: '474 / 988',
          },
          {
            id: 'use-case-cocos',
            title: 'Cocos 웹게임',
            body: '웹 게임 · Story Cycle + ImageGen MCP 에셋 자동화',
            image: {
              src: '/workflow/use-cases/cocos.webp',
              alt: 'Cocos 웹게임 스크린샷',
            },
            imageAspect: '896 / 1622',
          },
          {
            id: 'use-case-pwa',
            title: 'Next.js PWA',
            body: '설치형 웹앱 · TAS 라이프사이클 풀코스',
            image: {
              src: '/workflow/use-cases/pwa.webp',
              alt: 'Next.js PWA 스크린샷',
            },
            imageAspect: '2242 / 1352',
          },
        ],
      },
    ],
  },

  // ── Depth 1: Core Module ──────────────────────────────────────────────────
  {
    id: 'core-module',
    title: 'Core Module',
    body: '',
    children: [
      {
        id: 'core-tas',
        title: 'TAS (Thesis Antithesis Synthesis)',
        repoUrl: 'https://github.com/simsimhae91/tas',
        body: `**TAS** — Claude Code 기반 변증법 멀티 에이전트 오케스트레이션 플러그인.

**3계층 구조:**\n
- **MainOrchestrator** — 전체 라이프사이클 조율
- **MetaAgent** — 단계 계획 및 에이전트 파견
- **ThesisAgent(正) · AntithesisAgent(反)** — 변증법적 산출물 검증

**5 스킬:**\n
- \`/tas\` — 주요 오케스트레이션 진입점
- \`/tas-review\` — 산출물 리뷰
- \`/tas-verify\` — 검증 단계 (역할반전: Attacker 모드)
- \`/tas-explain\` — 워크플로우 설명
- \`/tas-workspace\` — 워크스페이스 관리

**4단계 라이프사이클:**\n
기획 → 구현 → 검증(역할반전) → 테스트(역할반전)

**설치:**\n
\`\`\`bash
# claude code 실행 후
/plugin marketplace add https://github.com/simsimhae91/tas.git
/plugin install tas@tas
\`\`\``,
      },
      {
        id: 'core-imagegen',
        title: 'ImageGen MCP',
        navLabel: 'ImageGen MCP',
        repoUrl: 'https://github.com/LimSuyun/openai-image-mcp-server',
        body: `**ImageGen MCP** — Claude Desktop / Cursor / VS Code 호환 MCP 서버. OpenAI gpt-image 패밀리를 Claude 워크플로우에서 직접 사용할 수 있습니다.

**지원 모델:**\n
gpt-image-1, gpt-image-2

**6 도구:**\n
- \`gpt_image_generate\` — 텍스트 기반 이미지 생성
- \`gpt_image_edit\` — 이미지 편집
- \`gpt_image_create_variation\` — 이미지 변형 생성
- \`gpt_image_create_character_reference\` — 캐릭터 레퍼런스 생성
- \`gpt_image_generate_pose\` — 포즈 기반 이미지 생성
- \`gpt_image_generate_sprite_sheet\` — 스프라이트 시트 생성`,
      },
      // ── Depth 2: Self-Healing ─────────────────────────────────────────────
      {
        id: 'self-healing',
        title: 'Self-Healing (자가 복구)',
        navLabel: 'Self-Healing',
        // forward-looking — 운영 환경 자동화 비전
        body: '운영 중인 서비스에서 발생하는 에러를 자동으로 감지하고 수정하는 자가 복구 시스템입니다.\n\nSentry와 Firebase Crashlytics로부터 에러를 수집하고, TAS 워크플로우로 자동 수정 후 PR을 생성합니다.',
        children: [
          {
            id: 'error-detection',
            title: '에러 감지 (Sentry + Firebase)',
            // forward-looking — 외부 연동 (Sentry, Firebase Crashlytics)
            body: 'Sentry(백엔드/프론트엔드 런타임 에러)와 Firebase Crashlytics(모바일 크래시)로부터 실시간 에러 이벤트를 수집합니다.\n\n에러 빈도·스택 트레이스·영향 범위를 기준으로 자동 처리 대상을 분류합니다.\n\n- **낮은 심각도** → 로그 기록만\n- **높은 심각도** → TAS Quick 자동 트리거',
          },
          {
            id: 'auto-fix',
            title: '자동 수정',
            // forward-looking — tas quick 패턴 기반
            body: '임계값을 초과하는 에러 이벤트 발생 시 TAS 워크플로우가 자동으로 트리거됩니다.\n\n```\ntas quick "{에러 스택 + 재현 조건}"\n```\n\nThesisAgent(正)가 수정 코드를 제안하고, AntithesisAgent(反)가 변증법적으로 검증합니다. ACCEPT Verdict 시 자동 커밋됩니다.',
          },
          {
            id: 'auto-pr',
            title: 'PR 자동 생성',
            // forward-looking — GitHub API + Slack 연동
            body: '수정이 완료되면 GitHub API로 Pull Request가 자동으로 생성됩니다. PR에는 다음 내용이 포함됩니다:\n\n- 에러 원인 분석 및 재현 조건\n- 수정 내용 요약\n- 재발 방지 조치\n\n담당자에게 Slack/이메일 알림 후 코드 리뷰를 대기합니다.',
          },
        ],
      },
    ],
  },
];
