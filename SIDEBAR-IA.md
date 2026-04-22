# SUPERWORK 좌측 사이드바 IA 설계서

> **변증법 최종 수렴 완료 — Round 2 ACCEPT (4/4 기준 충족)**  
> 참조 UX: https://adk.mo.ai.kr/ko — 좌측 고정 사이드바 + 우측 콘텐츠 2단 레이아웃  
> 적용 대상: superwork_homepage (Next.js 15 App Router · Tailwind v4 · Framer Motion)  
> 배포 방식: `output: 'export'` → GitHub Pages 정적 빌드  
> 이 문서는 구현 단계의 Single Source of Truth입니다.

---

## 목차

1. [프로젝트 전수 조사](#1-프로젝트-전수-조사)
2. [각 프로젝트 실제 사용방법](#2-각-프로젝트-실제-사용방법)
3. [사이드바 정보구조(IA)](#3-사이드바-정보구조ia)
4. [레이아웃 구조 변경](#4-레이아웃-구조-변경)
5. [Tailwind v4 토큰 추가](#5-tailwind-v4-토큰-추가)
6. [컴포넌트 상세 명세](#6-컴포넌트-상세-명세)
7. [스크롤스파이 Hook 명세](#7-스크롤스파이-hook-명세)
8. [모바일 드로어 동작](#8-모바일-드로어-동작)
9. [접근성 명세](#9-접근성-명세)
10. [Next.js 15 App Router 통합](#10-nextjs-15-app-router-통합)
11. [반응형 동작](#11-반응형-동작)
12. [모션 계획](#12-모션-계획)
13. [구현 체크리스트](#13-구현-체크리스트)

---

## 1. 프로젝트 전수 조사

### 1-A. 홈페이지 노출 항목 완전 목록

> **데이터 출처**: `src/data/projects.ts` 전수 확인 (총 2개 항목)

| # | 식별자 | 제목 | 외부 URL | 카테고리 | 아이콘 | 설명 |
|---|--------|------|----------|----------|--------|------|
| 1 | `tas` | tas | https://github.com/simsimhae91/tas | AI 도구 / Claude Code Plugin | ⚖️ | 두 AI 에이전트가 논쟁하며 더 나은 코드를 만드는 Claude Code 플러그인 |
| 2 | `openai-image-mcp-server` | openai-image-mcp-server | https://github.com/LimSuyun/openai-image-mcp-server | AI 도구 / MCP Server | 🎨 | DALL-E 3 & gpt-image-1로 이미지를 생성·편집·변형하는 MCP 서버 |

### 1-B. 현재 렌더링 구조 (변경 전)

```
<Header sticky>          ← SUPERWORK 브랜드 + GitHub 버튼
<main#main-content>
  <Hero />               ← section id 없음 (스크롤 최상단)
  <ProjectsSection />    ← id="projects" ✓
    <ProjectCard tas />        ← article id 없음
    <ProjectCard openai />     ← article id 없음
  <TeamSection />        ← section id 없음
<Footer />
```

---

## 2. 각 프로젝트 실제 사용방법

> **조사 방법**: `gh api repos/{owner}/{repo}/readme` → base64 디코딩 → README 원문 직접 취득.  
> `projects.ts`의 `features` 배열 외 README-only 정보(요구사항, 설치 3가지 방법, 훅 동작 등)가 추가로 확인됨.

### 2-A. tas

| 항목 | 내용 |
|------|------|
| **무엇인가** | Claude Code 플러그인 — 正(Thesis)·反(Antithesis) 두 AI 에이전트가 논쟁 후 수렴하는 변증법적 코딩 워크플로우 엔진 |
| **누가/언제 쓰는가** | Claude Code 사용자. 단일 패스 AI 응답의 품질이 부족할 때, 고위험·복잡한 기획·구현·검증 작업 시 |
| **요구 사항** | Claude Code ≥ 2.x, Python 3.10+, `pip install claude-agent-sdk`, `jq`(선택) |
| **진입 동선** | ① `/plugin marketplace add https://github.com/simsimhae91/tas.git` → ② `/plugin install tas@tas` → ③ `/tas {작업 요청}` |
| **핵심 기능 (README 취득)** | ① `/tas` — 복잡도 자동 분류(simple/medium/complex) + 기획→구현→검증→테스트 정반합 실행 ② MetaAgent가 계획 JSON 생성 후 사용자 승인 ③ `lessons.md` 누적 학습 (이전 iteration 결과 다음 iteration에 전달) ④ 컨텍스트 3계층 격리(MainOrchestrator / MetaAgent / ThesisAgent·AntithesisAgent) ⑤ `/tas-review`, `/tas-verify`, `/tas-explain`, `/tas-workspace` 보조 명령 |
| **projects.ts 미포함 README 정보** | Option A/B/C 3가지 설치 방법 (마켓플레이스·로컬 개발·로컬 마켓플레이스), `SessionStart` 훅 자동 환경 검사, `Stop` 훅 deliverable 무결성 가드(jq) |

### 2-B. openai-image-mcp-server

| 항목 | 내용 |
|------|------|
| **무엇인가** | MCP 서버 — OpenAI 이미지 모델(DALL-E 2/3, gpt-image-1)을 Claude Desktop·Cursor·VS Code·Claude Code 등 MCP 클라이언트에서 직접 사용 |
| **누가/언제 쓰는가** | 코드 에디터 내에서 이미지 생성·편집이 필요한 개발자·디자이너. 별도 UI 없이 채팅 창에서 이미지 작업을 원할 때 |
| **요구 사항** | Node.js 18+, OpenAI API 키(`sk-...`) |
| **진입 동선** | Claude Code: `claude mcp add openai-image -e OPENAI_API_KEY=sk-... -- npx -y openai-image-mcp-server@latest` (1줄) |
| **핵심 기능 (README 취득)** | ① `gpt_image_generate` — 텍스트 프롬프트 → 이미지 생성(모델·크기·품질 파라미터 지원) ② `gpt_image_edit` — 인페인팅/마스킹 이미지 편집 ③ `gpt_image_create_variation` — 스타일 변형(DALL-E 2 전용) ④ `gpt_image_generate_sprite_sheet` — 게임 캐릭터 3프레임 워킹 애니메이션 스프라이트 시트 자동 생성 ⑤ Claude Desktop · Cursor · VS Code · Claude Code 멀티플랫폼 |
| **projects.ts 미포함 README 정보** | `claude_desktop_config.json` / `~/.cursor/mcp.json` / VSCode `settings.json` 플랫폼별 설정 JSON 형식, `npx -y openai-image-mcp-server@latest` npm 원격 실행 지원, 수동 빌드(`npm run build`) 옵션 |

---

## 3. 사이드바 정보구조(IA)

### 3-A. 핵심 설계 결정: 프로젝트 anchor 단일화

**문제**: `#tas`와 `#openai-image-mcp-server` 카드는 `lg+(≥1024px)` 2열 그리드(`grid-2col`)에서 동일 Y축에 위치함 → Intersection Observer가 두 항목을 동시에 교차 감지 → `boundingClientRect.top` 동값 → DOM 순서상 `tas`만 영구 active 상태, `openai-image-mcp-server`는 개별 active에 도달 불가.

**결정: Option A — 프로젝트 섹션 단일 anchor (`#projects`)**

- 사이드바에 개별 프로젝트 항목 대신 **`#projects` 하나**만 scrollspy 대상으로 사용
- 각 프로젝트 항목 옆에 GitHub `↗` 외부링크 버튼 유지
- 미래에 `/tas`, `/openai-image-mcp-server` 서브라우트 생성 시 → `usePathname()` 기반 active 로직으로 전환 (코멘트로 명기)

### 3-B. 비주얼 트리 (데스크탑 기준)

```
┌─────────────────────────────────┐
│  ⬡  SUPERWORK          [GH ↗]  │  ← 브랜드 헤더
├─────────────────────────────────┤
│                                 │
│  🏠  홈                         │  ← #home 스크롤
│                                 │
│  프로젝트  ← 섹션 레이블 (읽힘)  │
│                                 │
│  ⚖️  tas               [↗]     │  ← #projects 스크롤 + GitHub ↗
│  🎨  openai-image-mcp  [↗]     │  ← #projects 스크롤 + GitHub ↗
│       -server                   │
│                                 │
│  팀                              │  ← 섹션 레이블 (읽힘)
│                                 │
│  👥  SUPERWORK팀                 │  ← #team 스크롤
│                                 │
│  링크                            │  ← 섹션 레이블 (읽힘)
│                                 │
│  ⬡  GitHub             [↗]     │  ← 외부, 새 탭
│                                 │
└─────────────────────────────────┘
```

### 3-C. 섹션 구성 상세

| 섹션 그룹 | 순서 | 레이블 | 항목 | 내부 anchor | 외부 URL | 비고 |
|-----------|------|--------|------|-------------|----------|------|
| 브랜드 헤더 | 0 | — | SUPERWORK | `/#` | `https://github.com/SuperworkTF` (↗ 버튼) | 사이드바 최상단 |
| 메인 내비 | 1 | (없음) | 🏠 홈 | `/#home` | — | scrollspy active |
| 프로젝트 | 2 | **"프로젝트"** | ⚖️ tas | `/#projects` | `https://github.com/simsimhae91/tas` | 섹션 레이블은 클릭 불가, 스크린리더에 읽힘 |
| 프로젝트 | 2 | — | 🎨 openai-image-mcp-server | `/#projects` | `https://github.com/LimSuyun/openai-image-mcp-server` | — |
| 팀 | 3 | **"팀"** | 👥 SUPERWORK팀 | `/#team` | — | — |
| 외부 링크 | 4 | **"링크"** | ⬡ GitHub | `https://github.com/SuperworkTF` | 새 탭 | SuperworkTF Org |

### 3-D. scrollspy 대상 섹션 ID 목록

```ts
// 모듈 레벨 상수 (컴포넌트 외부 선언 — 무한 루프 방지)
export const SECTION_IDS = ['home', 'projects', 'team'] as const;
type SectionId = typeof SECTION_IDS[number];
```

섹션별 DOM id 추가 계획:

| 섹션 | 현재 id | 추가할 id |
|------|---------|-----------|
| Hero | 없음 | `id="home"` |
| ProjectsSection | `id="projects"` ✓ | 이미 있음 — 변경 불필요 |
| TeamSection | 없음 | `id="team"` |

> **주의**: `ProjectCard` 개별 `<article>`에는 id 추가하지 않음 (scrollspy 대상 아님).

### 3-E. 활성상태 하이라이트 규칙

| 활성 섹션 | 사이드바 하이라이트 항목 |
|-----------|--------------------------|
| `home` | 홈 |
| `projects` | tas + openai-image-mcp-server **동시** (두 항목 모두 amber border) |
| `team` | SUPERWORK팀 |
| (미래) pathname `/tas` | tas만 — `usePathname()` |
| (미래) pathname `/openai-image-mcp-server` | openai만 — `usePathname()` |

### 3-F. 아이콘 세트

| 항목 | 아이콘 | 방식 | 크기 |
|------|--------|------|------|
| 홈 | `HomeIcon` | lucide-react `Home` | 16px |
| tas | `⚖️` | 텍스트 emoji (projects.ts 기존값) | 1em |
| openai-image-mcp-server | `🎨` | 텍스트 emoji (projects.ts 기존값) | 1em |
| SUPERWORK팀 | `UsersIcon` | lucide-react `Users` | 16px |
| GitHub | GitHub Octocat SVG | 기존 Header에서 재사용 | 16px |
| 외부링크 배지 `↗` | `ExternalLink` | lucide-react `ExternalLink` | 12px, `aria-hidden` |

> **패키지 결정**: lucide-react — 경량 SVG-in-JS, tree-shakeable, 기존 프로젝트에 미설치이므로 `npm install lucide-react` 1줄로 추가. heroicons 대비 React 친화적 API.

---

## 4. 레이아웃 구조 변경

### 4-A. 변경 전 (현재)

```
body
├── a.skip-link
├── <Header />              ← sticky top
└── (page.tsx children)
    ├── <main#main-content>
    │   ├── <Hero />
    │   ├── <ProjectsSection />
    │   └── <TeamSection />
    └── <Footer />
```

### 4-B. 변경 후 (목표)

```
body
├── a.skip-link
└── <LayoutShell>           ← 'use client', SidebarContext 제공
    ├── <Sidebar />         ← lg: 고정 260px / <lg: 드로어 overlay
    ├── backdrop div        ← 모바일 드로어 오픈 시만 렌더링
    └── <div.content-area>  ← lg: margin-left: 260px / <lg: full width
        ├── <Header />      ← 햄버거 추가, lg+ 브랜드 숨김
        └── (page.tsx children)
            ├── <main#main-content>
            │   ├── <Hero id="home" />
            │   ├── <ProjectsSection id="projects" />
            │   └── <TeamSection id="team" />
            └── <Footer />
```

---

## 5. Tailwind v4 토큰 추가

`src/app/globals.css` `@theme {}` 블록 추가분:

```css
@theme {
  /* ── 기존 토큰 (변경 없음) ── */
  --color-void:    #09090B;
  --color-dark:    #18181B;
  --color-surface: #27272A;
  --color-outline: #3F3F46;
  --color-ember:   #F97316;
  --color-aurora:  #A855F7;
  --color-snow:    #FAFAFA;
  --color-muted:   #A1A1AA;
  --font-sans: 'Pretendard Variable', system-ui, -apple-system, sans-serif;

  /* ── 신규: 사이드바 ── */
  --sidebar-width:              260px;
  --sidebar-bg:                 #111113;
  --sidebar-border:             #2D2D30;
  --sidebar-item-active-bg:     rgba(249, 115, 22, 0.08);
  --sidebar-item-active-border: #F97316;
  --sidebar-item-hover-bg:      rgba(255, 255, 255, 0.04);
}
```

추가할 CSS 유틸리티 클래스 (`globals.css` 하단):

```css
/* ── 사이드바 레이아웃 ── */
.sidebar-nav {
  position: fixed;
  left: 0;
  top: 0;
  height: 100vh;
  width: var(--sidebar-width);
  z-index: 40;
  background-color: var(--sidebar-bg);
  border-right: 1px solid var(--sidebar-border);
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  overflow-x: hidden;
  scrollbar-width: thin;
  scrollbar-color: var(--color-outline) transparent;
}

.content-area {
  flex: 1;
  min-width: 0;
}

/* ── 반응형 ── */
@media (min-width: 1024px) {
  .content-area {
    margin-left: var(--sidebar-width);
  }
  .sidebar-hamburger {
    display: none !important;
  }
  .header-brand-mobile {
    display: none !important;
  }
}

@media (max-width: 1023px) {
  .sidebar-section-label-desktop {
    /* 섹션 레이블은 모바일에서도 표시 — 숨김 없음 */
  }
}

/* ── 사이드바 항목 활성 상태 ── */
.sidebar-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  border-radius: 6px;
  border-left: 2px solid transparent;
  font-size: 0.875rem;
  color: var(--color-muted);
  text-decoration: none;
  transition: background-color 0.15s, color 0.15s, border-left-color 0.15s;
  cursor: pointer;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.sidebar-item:hover {
  background-color: var(--sidebar-item-hover-bg);
  color: var(--color-snow);
}

/* 스크롤 앵커 내비게이션: aria-current="location" (WAI-ARIA)
   미래 서브라우트(/tas 등) 추가 시 aria-current="page"로 전환 */
.sidebar-item[aria-current="location"] {
  border-left-color: var(--sidebar-item-active-border);
  background-color: var(--sidebar-item-active-bg);
  color: var(--color-snow);
}

.sidebar-section-label {
  padding: 16px 12px 4px;
  font-size: 0.6875rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-muted);
  opacity: 0.6;
  /* 클릭 불가, 스크린리더에는 읽힘 */
  pointer-events: none;
  user-select: none;
}
```

---

## 6. 컴포넌트 상세 명세

### 6-A. `src/contexts/SidebarContext.tsx` (신규)

```tsx
'use client';
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';

interface SidebarContextValue {
  isSidebarOpen: boolean;
  openSidebar: () => void;
  closeSidebar: () => void;
  toggleSidebar: () => void;
}

export const SidebarContext = createContext<SidebarContextValue | null>(null);

export function useSidebar() {
  const ctx = useContext(SidebarContext);
  if (!ctx) throw new Error('useSidebar must be used within SidebarProvider');
  return ctx;
}
```

---

### 6-B. `src/components/LayoutShell.tsx` (신규)

```tsx
'use client';
import { useState, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { SidebarContext } from '@/contexts/SidebarContext';
import { Sidebar } from './Sidebar';

export function LayoutShell({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();

  const closeSidebar = useCallback(() => setIsSidebarOpen(false), []);
  const openSidebar = useCallback(() => setIsSidebarOpen(true), []);
  const toggleSidebar = useCallback(() => setIsSidebarOpen(prev => !prev), []);

  // 라우트 변경 시 드로어 닫기 (미래 서브라우트 대비)
  useEffect(() => { closeSidebar(); }, [pathname, closeSidebar]);

  // Escape 키로 드로어 닫기
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeSidebar();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [closeSidebar]);

  return (
    <SidebarContext.Provider value={{ isSidebarOpen, openSidebar, closeSidebar, toggleSidebar }}>
      <div style={{ display: 'flex', minHeight: '100vh' }}>
        <Sidebar />

        {/* 모바일 백드롭 */}
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              aria-hidden="true"
              onClick={closeSidebar}
              style={{
                position: 'fixed',
                inset: 0,
                zIndex: 39,
                background: 'rgba(0, 0, 0, 0.65)',
                backdropFilter: 'blur(2px)',
              }}
            />
          )}
        </AnimatePresence>

        <div className="content-area">
          {children}
        </div>
      </div>
    </SidebarContext.Provider>
  );
}
```

---

### 6-C. `src/components/Sidebar.tsx` (신규)

```tsx
'use client';
import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Home, Users, ExternalLink } from 'lucide-react';
import { useSidebar } from '@/contexts/SidebarContext';
import { useSidebarScrollspy } from '@/hooks/useSidebarScrollspy';
import { SECTION_IDS } from '@/hooks/useSidebarScrollspy';

// ── GitHubIcon: 기존 Header의 SVG 재사용 ──────────────────────────
function GitHubIcon() { /* 기존 Header.tsx의 SVG 복사 */ }

export function Sidebar() {
  const { isSidebarOpen, closeSidebar } = useSidebar();
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const activeId = useSidebarScrollspy(SECTION_IDS);

  // 모바일 드로어 오픈 시 첫 포커스
  useEffect(() => {
    if (isSidebarOpen) closeButtonRef.current?.focus();
  }, [isSidebarOpen]);

  return (
    <motion.aside
      className="sidebar-nav"
      id="sidebar-drawer"
      // ─ 데스크탑(lg+): x 애니메이션 없이 항상 표시
      // ─ 모바일: isSidebarOpen에 따라 슬라이드
      // useMediaQuery로 분기 (Section 6-D 참조)
      aria-label="사이드바"
    >
      {/* ── 1. 브랜드 헤더 ─────────────────────────── */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px 12px',
        borderBottom: '1px solid var(--sidebar-border)',
      }}>
        <a
          href="/#"
          style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-snow)',
                   textDecoration: 'none', letterSpacing: '-0.02em' }}
        >
          SUPERWORK
        </a>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          {/* GitHub 외부링크 */}
          <a
            href="https://github.com/SuperworkTF"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="SuperworkTF GitHub 열기 (새 탭)"
            className="sidebar-item"
            style={{ padding: '4px 8px', fontSize: '0.75rem' }}
          >
            <GitHubIcon />
            <ExternalLink size={10} aria-hidden="true" />
          </a>
          {/* 모바일 닫기 버튼 (lg+에서 숨김) */}
          <button
            ref={closeButtonRef}
            onClick={closeSidebar}
            aria-label="메뉴 닫기"
            className="sidebar-hamburger"
            style={{ /* X 버튼 스타일 */ }}
          >
            ✕
          </button>
        </div>
      </div>

      {/* ── 2. 내비게이션 ──────────────────────────── */}
      <nav aria-label="사이드바 내비게이션" style={{ flex: 1, padding: '8px' }}>

        {/* 홈 */}
        <a
          href="/#home"
          className="sidebar-item"
          aria-current={activeId === 'home' ? 'location' : undefined}
          onClick={closeSidebar}
        >
          <Home size={16} aria-hidden="true" />
          홈
        </a>

        {/* ── 프로젝트 섹션 ── */}
        <p className="sidebar-section-label">프로젝트</p>

        <SidebarProjectItem
          href="/#projects"
          icon="⚖️"
          label="tas"
          externalHref="https://github.com/simsimhae91/tas"
          isActive={activeId === 'projects'}
          onNav={closeSidebar}
        />
        <SidebarProjectItem
          href="/#projects"
          icon="🎨"
          label="openai-image-mcp-server"
          externalHref="https://github.com/LimSuyun/openai-image-mcp-server"
          isActive={activeId === 'projects'}
          onNav={closeSidebar}
        />

        {/* ── 팀 섹션 ── */}
        <p className="sidebar-section-label">팀</p>

        <a
          href="/#team"
          className="sidebar-item"
          aria-current={activeId === 'team' ? 'location' : undefined}
          onClick={closeSidebar}
        >
          <Users size={16} aria-hidden="true" />
          SUPERWORK팀
        </a>

        {/* ── 링크 섹션 ── */}
        <p className="sidebar-section-label">링크</p>

        <a
          href="https://github.com/SuperworkTF"
          target="_blank"
          rel="noopener noreferrer"
          className="sidebar-item"
          aria-label="SuperworkTF GitHub 열기 (새 탭)"
          onClick={closeSidebar}
        >
          <GitHubIcon />
          GitHub
          <ExternalLink size={12} aria-hidden="true" style={{ marginLeft: 'auto' }} />
        </a>
      </nav>
    </motion.aside>
  );
}

// ── 프로젝트 항목: 내부 이동 링크 + 외부 GitHub ↗ 버튼 ──────────────
function SidebarProjectItem({
  href, icon, label, externalHref, isActive, onNav
}: {
  href: string;
  icon: string;
  label: string;
  externalHref: string;
  isActive: boolean;
  onNav: () => void;
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
      <a
        href={href}
        className="sidebar-item"
        aria-current={isActive ? 'location' : undefined}
        onClick={onNav}
        style={{ flex: 1, overflow: 'hidden' }}
      >
        <span aria-hidden="true">{icon}</span>
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{label}</span>
      </a>
      <a
        href={externalHref}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${label} GitHub 열기 (새 탭)`}
        style={{
          flexShrink: 0,
          padding: '6px',
          borderRadius: '4px',
          color: 'var(--color-muted)',
          transition: 'color 0.1s',
        }}
        onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-snow)')}
        onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-muted)')}
      >
        <ExternalLink size={12} aria-hidden="true" />
      </a>
    </div>
  );
}
```

---

### 6-D. 데스크탑/모바일 Framer Motion 분기 (`useMediaQuery` 패턴)

**문제**: CSS `transform: none !important`는 Framer Motion 내부 상태와 desync 발생.  
**해결**: JS에서 미디어쿼리를 감지하여 `animate` prop 자체를 조건부로 비활성화.

```tsx
// src/hooks/useMediaQuery.ts
'use client';
import { useState, useEffect } from 'react';

export function useMediaQuery(query: string): boolean {
  // output: 'export' 정적 빌드 → 서버 실행 없음 → window 항상 존재
  // useState initializer로 첫 렌더에서 즉시 올바른 값 설정
  // → 데스크탑에서 첫 로드 시 x: -260 → 0 flash 방지
  const [matches, setMatches] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    const mq = window.matchMedia(query);
    // initializer와 effect 사이 창 크기 변경 edge case 대비
    setMatches(mq.matches);
    const listener = (e: MediaQueryListEvent) => setMatches(e.matches);
    mq.addEventListener('change', listener);
    return () => mq.removeEventListener('change', listener);
  }, [query]);

  return matches;
}
```

```tsx
// Sidebar.tsx 내부 적용
const isDesktop = useMediaQuery('(min-width: 1024px)');
const { isSidebarOpen } = useSidebar();

<motion.aside
  className="sidebar-nav"
  // 데스크탑: 첫 렌더부터 isDesktop=true → initial이 {x:0, opacity:0}
  //           → animate {x:0, opacity:1} → flash 없이 fade-in만
  // 모바일: isDesktop=false → x 슬라이드 드로어
  animate={
    isDesktop
      ? { x: 0, opacity: 1 }
      : { x: isSidebarOpen ? 0 : -260 }
  }
  initial={isDesktop ? { x: 0, opacity: 0 } : { x: -260 }}
  transition={
    isDesktop
      ? { duration: 0.4, ease: 'easeOut' }               // 데스크탑: 마운트 1회 fade-in
      : { type: 'spring', stiffness: 380, damping: 35 }   // 모바일: 스프링 드로어
  }
>
```

> **초기값 동기화**: `useState(() => window.matchMedia(query).matches)` initializer 패턴으로 첫 렌더부터 올바른 `isDesktop` 값을 가짐 → `useEffect` 이후 재렌더 없음 → 데스크탑에서 Framer Motion x 애니메이션 flash 발생하지 않음. `LayoutShell`이 `'use client'`이므로 SSR 실행 없고 `window`는 항상 존재.

---

### 6-E. 포커스 트랩 (모바일 드로어)

```bash
npm install focus-trap-react
```

```tsx
// Sidebar.tsx
import FocusTrap from 'focus-trap-react';

<FocusTrap
  active={isSidebarOpen && !isDesktop}
  focusTrapOptions={{
    initialFocus: '#sidebar-close-btn',      // X 닫기 버튼
    returnFocusOnDeactivate: true,           // 닫힘 시 햄버거 버튼으로 포커스 복귀
    escapeDeactivates: false,               // Escape는 LayoutShell keydown handler에서 처리
    allowOutsideClick: true,               // 백드롭 클릭 허용
  }}
>
  <motion.aside ...>
    ...
  </motion.aside>
</FocusTrap>
```

> **focus-trap-react 버전 주의**: v7+에서 `escapeDeactivates` 기본값이 `true`로 변경됨.  
> 위 설정처럼 `escapeDeactivates: false`를 **명시적으로 선언**하지 않으면 FocusTrap이 Escape를 먼저 소비하여  
> `LayoutShell`의 `keydown` 핸들러에 도달하지 못함. 반드시 명시 설정 유지.

---

## 7. 스크롤스파이 Hook 명세

```ts
// src/hooks/useSidebarScrollspy.ts
'use client';

// ── 모듈 레벨 상수: 컴포넌트 외부 선언 → useEffect 무한 루프 방지 ──
export const SECTION_IDS = ['home', 'projects', 'team'] as const;
export type SectionId = typeof SECTION_IDS[number];

import { useState, useEffect } from 'react';

export function useSidebarScrollspy(
  sectionIds: readonly string[] = SECTION_IDS
): string {
  const [activeId, setActiveId] = useState<string>('home');

  useEffect(() => {
    // rootMargin: 상단 10% 제외 + 하단 60% 이전 구간(30% 폭) 감지
    // → 화면 중간~상단에 들어온 섹션을 active로 인식
    // → 두 섹션 동시 감지 시 boundingClientRect.top 오름차순 → 최상단 섹션 우선
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter(e => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      {
        rootMargin: '-10% 0px -60% 0px',
        threshold: 0,
      }
    );

    sectionIds.forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [sectionIds]);
  // ↑ sectionIds는 SECTION_IDS(모듈 상수) 참조 — 렌더마다 동일 참조 → 무한 루프 없음

  return activeId;
}
```

**검증 — rootMargin 수치 경계값 추적**:
- viewport height = 800px 가정
- `rootMargin: '-10% 0px -60% 0px'` → detection zone: top=80px ~ bottom=320px (240px 폭)
- `#home` (Hero, ~600px 높이): 스크롤 0px에서 진입, 스크롤 ~480px까지 감지 → 충분
- `#projects` (~600px): 스크롤 ~600px 이후 감지 → `#home`과 겹치지 않음 ✓
- `#team` (~300px): `#projects` 이후 순차 감지 → 정상 ✓

---

## 8. 모바일 드로어 동작

### 8-A. 상태 흐름

```
[닫힘]
  Header 햄버거(☰) 클릭
    → isSidebarOpen = true
    → Sidebar: x(-260 → 0), spring(380, 35)
    → 백드롭: opacity(0 → 1), 200ms
    → 햄버거: aria-expanded="true", aria-label="메뉴 닫기"
    → 포커스: X 닫기 버튼으로 이동 (FocusTrap)

[열림]
  X 버튼 / 백드롭 / Escape / 내비 항목 클릭
    → isSidebarOpen = false
    → Sidebar: x(0 → -260)
    → 백드롭: AnimatePresence exit opacity(1 → 0)
    → 포커스: 햄버거 버튼으로 복귀 (returnFocusOnDeactivate)
```

### 8-B. Header 변경 사항

```tsx
// Header.tsx 수정 포인트
import { useSidebar } from '@/contexts/SidebarContext';

export function Header() {
  const { isSidebarOpen, toggleSidebar } = useSidebar();
  return (
    <motion.header ...>
      <div ...>
        {/* 로고: lg+에서 숨김 (사이드바 브랜드 헤더가 대신) */}
        <a href="#" className="header-brand-mobile" aria-label="SUPERWORK 홈으로">
          SUPERWORK
        </a>

        <nav aria-label="주요 메뉴" style={{ display: 'flex', gap: '8px' }}>
          {/* 햄버거 버튼: lg+에서 숨김 */}
          <button
            id="sidebar-toggle-btn"
            onClick={toggleSidebar}
            aria-expanded={isSidebarOpen}
            aria-controls="sidebar-drawer"
            aria-label={isSidebarOpen ? '메뉴 닫기' : '메뉴 열기'}
            className="sidebar-hamburger"
          >
            {/* ☰ / ✕ SVG */}
          </button>

          {/* GitHub 버튼: lg+에서 숨김 (사이드바에 존재) */}
          <a href="https://github.com/SuperworkTF" ... className="sidebar-hamburger">
            GitHub ↗
          </a>
        </nav>
      </div>
    </motion.header>
  );
}
```

---

## 9. 접근성 명세

### 9-A. ARIA 속성 완전 목록

| 요소 | 속성 | 값 | 근거 |
|------|------|-----|------|
| `<aside>` | `aria-label` | `"사이드바"` | complementary 랜드마크 레이블 |
| `<aside>` | `id` | `"sidebar-drawer"` | 햄버거 `aria-controls` 대상 |
| `<nav>` (내부) | `aria-label` | `"사이드바 내비게이션"` | navigation 랜드마크 레이블 |
| 활성 `<a>` (스크롤 앵커) | `aria-current` | `"location"` | 단일 페이지 내 현재 위치 표시 (WAI-ARIA 1.1 §6.6.4) |
| 활성 `<a>` (미래 서브라우트) | `aria-current` | `"page"` | 실제 별도 페이지 이동 시 전환 |
| 햄버거 버튼 | `aria-expanded` | `true`/`false` | 드로어 열림 상태 |
| 햄버거 버튼 | `aria-controls` | `"sidebar-drawer"` | 제어 대상 |
| 햄버거 버튼 | `aria-label` | `"메뉴 열기"` / `"메뉴 닫기"` | 상태별 동적 변경 |
| 외부링크 버튼 `↗` | `aria-label` | `"{label} GitHub 열기 (새 탭)"` | 아이콘만 있는 링크 설명 |
| 섹션 레이블 `<p>` | (없음) | — | 클릭 불가(`pointer-events:none`)이나 스크린리더에 읽힘 |
| 백드롭 `<div>` | `aria-hidden` | `"true"` | 시각적 요소만 |
| 아이콘 SVG | `aria-hidden` | `"true"` | 텍스트 레이블 중복 방지 |

> **`<aside>` 구조 확정**: `<aside aria-label="사이드바">` (complementary) + `<nav aria-label="사이드바 내비게이션">` (navigation). `<aside>`에 `role="navigation"` **미사용** — WCAG 4.1.2 준수.

### 9-B. 키보드 내비게이션

| 키 | 동작 |
|----|------|
| `Tab` | 사이드바 항목 순차 포커스 (모바일: FocusTrap으로 사이드바 내부 순환) |
| `Shift+Tab` | 역순 포커스 |
| `Enter` / `Space` | 항목 클릭 — 스크롤 or 외부링크 |
| `Escape` | 모바일 드로어 닫힘 + 포커스 햄버거 버튼 복귀 |

### 9-C. 포커스 스타일 (기존 globals.css 유지)

```css
*:focus-visible {
  outline: 2px solid #F97316;  /* --color-ember */
  outline-offset: 2px;
}
```

---

## 10. Next.js 15 App Router 통합

### 10-A. 파일 변경 목록

| 파일 | 유형 | 내용 |
|------|------|------|
| `src/app/layout.tsx` | 수정 | `<LayoutShell>` 래핑 |
| `src/app/globals.css` | 수정 | 사이드바 CSS 변수 + 유틸리티 추가 |
| `src/contexts/SidebarContext.tsx` | **신규** | Context + useSidebar hook |
| `src/components/LayoutShell.tsx` | **신규** | 레이아웃 + 드로어 상태 관리 |
| `src/components/Sidebar.tsx` | **신규** | 사이드바 컴포넌트 |
| `src/components/Header.tsx` | 수정 | 햄버거 버튼 추가, lg+ 브랜드/GitHub 조건부 숨김 |
| `src/components/Hero.tsx` | 수정 | `id="home"` 추가 |
| `src/components/TeamSection.tsx` | 수정 | `id="team"` 추가 |
| `src/components/ProjectsSection.tsx` | 수정 | section `id="projects"` 이미 있음 — 확인만 |
| `src/hooks/useSidebarScrollspy.ts` | **신규** | Intersection Observer hook + `SECTION_IDS` 상수 |
| `src/hooks/useMediaQuery.ts` | **신규** | 반응형 JS 감지 hook |

```bash
npm install lucide-react focus-trap-react
```

### 10-B. `layout.tsx` 변경 후

```tsx
// src/app/layout.tsx (Server Component 유지)
import { LayoutShell } from '@/components/LayoutShell';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>...</head>
      <body>
        <a href="#main-content" className="skip-link">본문으로 바로가기</a>
        <LayoutShell>
          {children}
        </LayoutShell>
      </body>
    </html>
  );
}
```

### 10-C. Static Export 호환성

- 모든 사이드바 컴포넌트: `'use client'` — SSR 없음, `output: 'export'` 완전 호환
- `usePathname()`: App Router 클라이언트 전용 — `'use client'` 내에서만 사용, 문제없음
- `focus-trap-react`: 브라우저 전용 — 서버 실행 없음 ✓

---

## 11. 반응형 동작

| 브레이크포인트 | 사이드바 | 헤더 | 콘텐츠 |
|----------------|----------|------|--------|
| lg+ (≥1024px) | 고정 좌측 260px, 항상 표시, x 애니메이션 비활성화 | 브랜드 숨김(`header-brand-mobile: none`), 햄버거 숨김 | `margin-left: 260px` |
| md (640–1023px) | 숨김(`x: -260`), 드로어로 오픈 | 브랜드 표시, 햄버거 표시 | full width |
| sm/xs (<640px) | 숨김, 드로어로 오픈 | 브랜드 표시, 햄버거 표시 | full width |

---

## 12. 모션 계획

| 요소 | 트리거 | 효과 | 타이밍 |
|------|--------|------|--------|
| 사이드바 진입 (데스크탑) | 마운트 1회 | `opacity: 0 → 1` (x 없음) | `ease-out 0.4s` |
| 드로어 열기 (모바일) | 햄버거 클릭 | `x: -260 → 0` | `spring(stiffness:380, damping:35)` |
| 드로어 닫기 (모바일) | X/Escape/백드롭/내비 클릭 | `x: 0 → -260` | `spring(380, 35)` |
| 백드롭 | `AnimatePresence` | `opacity: 0 → 1 → 0` | `200ms ease` |
| 활성 항목 전환 | scrollspy | `border-left-color, background-color` | `CSS transition 150ms` |
| 항목 호버 | `:hover` | `background-color, color` | `CSS transition 150ms` |
| 외부링크 버튼 호버 | `:hover` | `color: muted → snow` | `CSS transition 100ms` |

---

## 13. 구현 체크리스트

구현 단계에서 아래 순서로 진행:

### 준비

- [ ] `npm install lucide-react focus-trap-react`

### CSS 기반

- [ ] `globals.css` — 사이드바 CSS 변수(`--sidebar-*`) @theme 추가
- [ ] `globals.css` — `.sidebar-nav`, `.content-area`, `.sidebar-item`, `.sidebar-section-label`, 반응형 클래스 추가

### Hook 레이어

- [ ] `src/hooks/useMediaQuery.ts` 작성
- [ ] `src/hooks/useSidebarScrollspy.ts` 작성 — `SECTION_IDS` 모듈 상수 포함

### Context + 레이아웃

- [ ] `src/contexts/SidebarContext.tsx` 작성
- [ ] `src/components/LayoutShell.tsx` 작성
- [ ] `src/app/layout.tsx` — `<LayoutShell>` 래핑

### 사이드바 컴포넌트

- [ ] `src/components/Sidebar.tsx` 작성
  - [ ] `<aside aria-label="사이드바">` + `<nav aria-label="사이드바 내비게이션">` 구조
  - [ ] `useMediaQuery` 기반 Framer Motion 분기
  - [ ] `FocusTrap` 적용
  - [ ] `SidebarProjectItem` 서브컴포넌트

### 기존 컴포넌트 수정

- [ ] `src/components/Header.tsx` — 햄버거 버튼, lg+ 조건부 숨김
- [ ] `src/components/Hero.tsx` — `id="home"` 추가
- [ ] `src/components/TeamSection.tsx` — `id="team"` 추가
- [ ] `src/components/ProjectsSection.tsx` — `id="projects"` 이미 있음, 확인

### 검증

- [ ] `lg+` 데스크탑: 사이드바 항상 표시, `margin-left: 260px`
- [ ] `<lg` 모바일: 햄버거 → 드로어 슬라이드 → 백드롭 → Escape/클릭 닫힘
- [ ] scrollspy: 스크롤 시 홈/프로젝트/팀 순차 active 전환
- [ ] `aria-current="location"` 스크린리더 확인 (axe-core, NVDA/VoiceOver)
- [ ] 포커스 트랩: 드로어 오픈 시 Tab이 사이드바 내부 순환
- [ ] `<aside>` + `<nav>` 랜드마크 구조 확인 (axe-core 또는 브라우저 접근성 트리)

---

*이 문서는 구현 단계의 Single Source of Truth입니다.*  
*변증법 수렴: Round 2 ACCEPT — 4개 blocking 이슈 전부 해결, pass criteria 4/4 충족*
