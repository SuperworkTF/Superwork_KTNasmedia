// ──────────────────────────────────────────────────────────────────────────────
// /workflow 페이지 콘텐츠 데이터
// 기획서(WORKFLOW_PLAN.md) §3·§4·§5 기반으로 작성된 실제 콘텐츠.
// ──────────────────────────────────────────────────────────────────────────────

import type { WorkflowHeroCopy, WorkflowSection } from '@/lib/workflow';

// ── 히어로 카피 (안 C — 팩트 드리븐 선언형) ────────────────────────────────
export const heroCopy: WorkflowHeroCopy = {
  headline: '신사업, 이제 명령어 하나로 시작한다.\nSuperwork가 선택한 AI 개발 방법론.',
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
    body: `Superwork는 모든 신규 프로젝트를 TAS(simsimhae91/tas v0.2.3) 위에서 시작합니다. 정반합(正反合) 변증법 기반 멀티 에이전트 시스템이 아이디어 강화부터 배포까지 전 과정을 자동화합니다.

Executor 에이전트(正)가 초안을 제시하면 HumanRole 에이전트(反)가 검증하고, ACCEPT Verdict가 나올 때까지 반복해 산출물 품질을 끌어올립니다. 사람은 방향을 정하고, 시스템이 실행합니다.`,
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
        body: '프로젝트를 클론하고 `tas init` 한 번이면 팀 모든 구성원이 동일한 에이전트 환경을 공유합니다. 자동으로 설정되는 항목:\n\n- **settings.json** — Claude Code 권한 정책 + Hook 매핑\n- **CLAUDE.md** — 프로젝트 구조 가이드 (에이전트 컨텍스트 초기화)\n- **rules/tech-stack.md** — 기술 스택 선택 강제 (BaaS, 프레임워크)\n- **.gitignore managed block** — idempotent 삽입으로 중복 없이 패턴 추가',
      },
      {
        id: 'env-config',
        title: '환경 변수 구성',
        body: '`.env.example`을 기반으로 에이전트 동작을 세밀하게 제어합니다.\n\n주요 환경 변수:\n- **PINGPONG_executor_model** — Executor(正) 에이전트 모델 선택\n- **PINGPONG_human_role_model** — HumanRole(反) 에이전트 모델 선택\n- **TIMEOUT_*** — 단계별 타임아웃 설정\n\nMCP 서버(이미지 생성, 외부 서비스 연동 등) 활성화 여부도 환경 변수로 제어합니다.',
      },
    ],
  },

  // ── Depth 1: 전체 라이프사이클 ─────────────────────────────────────────────
  {
    id: 'lifecycle',
    title: '전체 라이프사이클: tas lifecycle',
    body: '`tas lifecycle "아이디어"` 명령 하나로 Phase 0(아이디어 강화)부터 Phase 5(WaveExecutor)까지 전체 라이프사이클이 자동으로 실행됩니다. `LifecycleState`로 중단 후 재개(resume)를 지원합니다.',
    children: [
      {
        id: 'idea-enrichment',
        title: '아이디어 강화 (raw → enriched)',
        body: '`tas lifecycle "아이디어"` 입력 시 Phase 0이 시작됩니다. `IdeaEnricher`가 WebSearch로 관련 플랫폼·도메인·경쟁사를 조사하고 구조화된 `project_concept.md`를 생성합니다.\n\n- **PROJECT_SLUG** 자동 추출\n- 플랫폼 제약·핵심 개념·미결정 항목 구조화\n- 이 문서가 이후 모든 단계(기획·개발·검증)의 기반이 됩니다.',
      },
      {
        id: 'planning',
        title: '기획 단계 (Planning)',
        body: 'NavigatorAgent가 단계별 스킬을 동적으로 호출하며 브레인스토밍 → 도메인 리서치 → PRD → Epic 순서로 기획을 진행합니다. 컨텍스트를 누적하며 다음 워크플로우를 자동으로 결정합니다.',
        children: [
          {
            id: 'brainstorm',
            title: '브레인스토밍',
            body: 'NavigatorAgent가 첫 워크플로우로 브레인스토밍 세션을 선택합니다. Executor(正) 에이전트가 초안 아이디어를 제시하고, HumanRole(反) 에이전트가 가정을 검증합니다. ACCEPT Verdict가 나오면 다음 단계로 자동 진행합니다.',
          },
          {
            id: 'domain-research',
            title: '도메인 리서치',
            body: 'NavigatorAgent가 브레인스토밍 컨텍스트를 누적한 뒤 도메인 리서치 워크플로우를 동적으로 선택합니다. 시장 조사·기술 스택·제약 조건을 구조화된 문서로 산출하며, PingPong 변증법으로 산출물 품질을 보장합니다.',
          },
          {
            id: 'prd',
            title: 'PRD 생성',
            body: '브레인스토밍 + 도메인 리서치 컨텍스트를 바탕으로 Product Requirements Document를 자동 생성합니다. 기능 목록, 성공 기준, 기술 제약이 구조화된 마크다운으로 저장됩니다. PingPong 변증법으로 완성도를 검증합니다.',
          },
          {
            id: 'epics',
            title: 'Epic 도출',
            body: 'PRD에서 구현 단위인 Epic과 하위 Story를 도출합니다. `epics.md` 파일로 저장되며, 이 파일이 다음 단계 ExecutionPlanner의 입력이 됩니다. 에픽 간 의존성도 이 단계에서 정의됩니다.',
          },
        ],
      },
      {
        id: 'implementation',
        title: '구현 단계 (Implementation)',
        body: 'StoryPipeline이 각 Story를 `create → dev → CR(코드 리뷰) + rework 루프 → merge` 순서로 처리합니다. 각 단계를 PingPong 세션으로 실행해 품질을 보장합니다.',
        children: [
          {
            id: 'story',
            title: 'Story 생성 (CS)',
            body: 'StoryPipeline의 첫 단계입니다. Epic에서 개발 가능한 단위인 Story를 생성합니다. PingPong 세션으로 Story 범위·수용 기준(AC)·의존성을 확정합니다.',
          },
          {
            id: 'dev',
            title: '개발 (Dev)',
            body: 'Executor 에이전트가 Story 요구사항에 따라 코드를 작성합니다. `acceptEdits` 권한으로 파일을 수정하고, HumanRole이 변증법적으로 검증한 뒤 ACCEPT 시 커밋됩니다.',
          },
          {
            id: 'qa-review',
            title: 'QA / 코드 리뷰 (CR)',
            body: '코드 리뷰(CR) PingPong 세션에서 코드 품질·보안·테스트 커버리지를 검증합니다. ACCEPT 시 Antithesis Playtest(AP) 런타임 검증을 실행하고, REFINE/COUNTER 시 개발 rework 루프를 반복합니다.',
          },
          {
            id: 'simulator',
            title: '시뮬레이터 테스트 (Playtest)',
            body: 'PlaytestRunner가 실제 서버를 로컬에서 기동하고 LLM 시나리오로 5-signal 검증(기능·성능·보안·안정성·사용성)을 수행합니다. 실패 시 개발 단계로 피드백이 전달됩니다.',
          },
          {
            id: 'integration',
            title: '통합 (Integration)',
            body: 'MergeAgent가 Claude SDK 기반으로 시맨틱 머지를 수행합니다. 충돌을 자동으로 해결하고, Pre-merge impact analysis + 통합 검증 후 main 브랜치에 머지합니다. Wave Boundary Safety Harness(WBSH)로 웨이브 간 통합 무결성을 보장합니다.',
          },
        ],
      },
    ],
  },

  // ── Depth 1: 병렬 스프린트 ─────────────────────────────────────────────────
  {
    id: 'sprint-execution',
    title: '병렬 스프린트: sprint-execution-plan',
    body: 'ExecutionPlanner가 epics.md의 의존성을 분석해 execution-plan.yaml을 생성하고, WaveExecutor가 웨이브별로 스토리를 병렬 실행합니다. Git worktree 격리로 브랜치 간 충돌 없이 동시 개발이 가능합니다.',
    children: [
      {
        id: 'wave-plan',
        title: '의존성 기반 웨이브 계획',
        body: '`ExecutionPlanner`가 `epics.md`의 스토리 의존성을 분석해 `execution-plan.yaml`을 생성합니다.\n\n- **networkx DAG + 위상 정렬**로 병렬 실행 가능한 웨이브 구성\n- **"에픽당 1스토리/웨이브" 제약**으로 병합 충돌 최소화\n- 사이클 감지 및 자동 파괴(cycle-breaking) 기능 포함\n- `sprint-status.yaml`로 웨이브별 실행 상태 추적',
      },
      {
        id: 'git-worktree',
        title: 'Git Worktree 병렬 개발',
        body: '`WaveExecutor`가 웨이브 내 스토리를 `asyncio.gather()`로 동시에 실행합니다.\n\n- 각 스토리는 **독립된 Git worktree 브랜치**에서 진행 (기본 최대 5개 동시)\n- **WorktreePool** 세마포어로 동시성 상한 제어\n- 완료된 스토리부터 순차적으로 wave 머지\n- 다음 웨이브는 머지 결과를 기반으로 시작',
      },
    ],
  },

  // ── Depth 1: Core Module ──────────────────────────────────────────────────
  {
    id: 'core-module',
    title: 'Core Module',
    body: 'Superwork 워크플로우를 구성하는 핵심 오픈소스 모듈입니다. TAS는 변증법 기반 멀티 에이전트 오케스트레이션을, ImageGen MCP는 이미지 생성 AI 통합을, Self-Healing은 운영 에러 자동 감지·수정을 담당합니다.',
    children: [
      {
        id: 'core-tas',
        title: 'TAS (simsimhae91/tas)',
        navLabel: 'TAS',
        body: `**TAS v0.2.3 (MIT)** — Claude Code 기반 변증법 멀티 에이전트 오케스트레이션 플러그인.

**3계층 구조:**
- **MainOrchestrator** — 전체 라이프사이클 조율
- **MetaAgent** — 단계 계획 및 에이전트 파견
- **ThesisAgent(正) · AntithesisAgent(反)** — 변증법적 산출물 검증

**5 스킬:**
- \`/tas\` — 주요 오케스트레이션 진입점
- \`/tas-review\` — 산출물 리뷰
- \`/tas-verify\` — 검증 단계 (역할반전: Attacker 모드)
- \`/tas-explain\` — 워크플로우 설명
- \`/tas-workspace\` — 워크스페이스 관리

**4단계 라이프사이클:**
기획 → 구현 → 검증(역할반전) → 테스트(역할반전)

**설치:**
\`\`\`bash
git clone https://github.com/simsimhae91/tas
\`\`\``,
      },
      {
        id: 'core-imagegen',
        title: 'ImageGen MCP (LimSuyun/openai-image-mcp-server)',
        navLabel: 'ImageGen MCP',
        body: `**ImageGen MCP** — Claude Desktop / Cursor / VS Code 호환 MCP 서버. OpenAI gpt-image 패밀리를 Claude 워크플로우에서 직접 사용할 수 있습니다.

**지원 모델:**
DALL-E 3, gpt-image-1

**6 도구:**
- \`gpt_image_generate\` — 텍스트 기반 이미지 생성
- \`gpt_image_edit\` — 이미지 편집
- \`gpt_image_create_variation\` — 이미지 변형 생성
- \`gpt_image_create_character_reference\` — 캐릭터 레퍼런스 생성
- \`gpt_image_generate_pose\` — 포즈 기반 이미지 생성
- \`gpt_image_generate_sprite_sheet\` — 스프라이트 시트 생성

**설치:**
\`\`\`bash
git clone https://github.com/LimSuyun/openai-image-mcp-server
\`\`\``,
      },
      // ── Depth 2: Self-Healing ─────────────────────────────────────────────
      {
        id: 'self-healing',
        title: 'Self-Healing (자가 복구)',
        navLabel: 'Self-Healing',
        // forward-looking — 운영 환경 자동화 비전
        body: '운영 중인 서비스에서 발생하는 에러를 자동으로 감지하고 수정하는 자가 복구 시스템입니다. Sentry와 Firebase Crashlytics로부터 에러를 수집하고, TAS 워크플로우로 자동 수정 후 PR을 생성합니다.',
        children: [
          {
            id: 'error-detection',
            title: '에러 감지 (Sentry + Firebase)',
            // forward-looking — 외부 연동 (Sentry, Firebase Crashlytics)
            body: 'Sentry(백엔드/프론트엔드 런타임 에러)와 Firebase Crashlytics(모바일 크래시)로부터 실시간 에러 이벤트를 수집합니다. 에러 빈도·스택 트레이스·영향 범위를 기준으로 자동 처리 대상을 분류합니다.\n\n- **낮은 심각도** → 로그 기록만\n- **높은 심각도** → TAS Quick 자동 트리거',
          },
          {
            id: 'auto-fix',
            title: '자동 수정',
            // forward-looking — tas quick 패턴 기반
            body: '임계값을 초과하는 에러 이벤트 발생 시 TAS 워크플로우가 자동으로 트리거됩니다.\n\n```\ntas quick "{에러 스택 + 재현 조건}"\n```\n\nExecutor 에이전트(正)가 수정 코드를 제안하고, HumanRole 에이전트(反)가 변증법적으로 검증합니다. ACCEPT Verdict 시 자동 커밋됩니다.',
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
