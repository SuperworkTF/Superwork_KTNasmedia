# SUPERWORK 홈페이지 — 최종 기획 사양서

> **변증법 수렴 완료** — Round 2 ACCEPT (5/5 기준 충족)  
> 이 문서는 기획 단계의 최종 산출물입니다. 구현 단계에서 이 사양서를 기준으로 삼습니다.

---

## 목차

1. [레퍼런스 사이트 분석](#1-레퍼런스-사이트-분석)
2. [프로젝트 카드 콘텐츠](#2-프로젝트-카드-콘텐츠)
3. [디자인 시스템](#3-디자인-시스템)
4. [기술 스택 & 디렉토리 구조](#4-기술-스택--디렉토리-구조)
5. [배포 전략](#5-배포-전략)
6. [정보 구조(IA) & 카피](#6-정보-구조ia--카피)
7. [구현 단계 주의사항](#7-구현-단계-주의사항)

---

## 1. 레퍼런스 사이트 분석

**대상**: https://adk.mo.ai.kr/ko (MoAI-ADK Documentation)  
**분석 방법**: `reference-site-full.png` 스크린샷 실측

### 레퍼런스 디자인 언어 요약

| 항목 | 실측 내용 |
|------|-----------|
| 레이아웃 | 2단 — 좌측 고정 사이드바 + 우측 메인 콘텐츠 영역 |
| 헤더 | 사이트명 + Copy Page / Star 버튼 + 언어 선택 |
| 히어로 | 전폭 일러스트 (이스터섬 Moai 캐릭터 × 일몰, 따뜻한 오렌지·코랄 톤) |
| 컬러 | 히어로: 오렌지·코랄 warm gradient / 배경: 흰색·라이트그레이 / 링크: 파란 계열 |
| 타이포 | 한국어 산세리프, 계층적 헤딩 |
| 섹션 구성 | 주요 기능(불릿 리스트) → 시작하기 → 문서 구조 (수직 스크롤) |
| 사이드바 | 접이식 트리 내비게이션 (시작하기/주요기능/에이전트/시스템) |
| 플랫폼 | Docusaurus / VitePress 계열 추정 |

### SUPERWORK 홈페이지에 적용할 요소

| 레퍼런스 요소 | SUPERWORK 적용 방향 |
|-------------|-------------------|
| 따뜻한 오렌지·코랄 히어로 컬러 | Primary accent `#F97316` (Ember) + 히어로 gradient 채용 |
| 일러스트 히어로 이미지 | SVG/CSS 기반 기하학적 히어로 시각 요소 또는 생성 이미지 배너 |
| 기능 불릿 리스트 패턴 | 카드 내 기능 태그·불릿 리스트로 변환 |
| 한국어 계층적 타이포 | Pretendard Variable 한국어 폰트 동일 채용 |
| 단일 페이지 수직 스크롤 | 사이드바 제거, 풀페이지 랜딩 섹션으로 변환 |
| 기술적·명확한 한국어 카피 | 카피 톤 가이드 동일 방향 유지 |

---

## 2. 프로젝트 카드 콘텐츠

### Card A — `tas`

| 필드 | 내용 |
|------|------|
| **제목** | tas |
| **부제** | 변증법적 AI 워크플로우 플러그인 |
| **한 줄 설명** | 두 AI 에이전트가 논쟁하며 더 나은 코드를 만드는 Claude Code 플러그인 |
| **링크** | https://github.com/simsimhae91/tas |
| **태그** | `Python` · `Claude Code` · `AI Agent` · `Dialectic` |
| **대표 시각 요소** | ⚖️ 저울 아이콘 + 오렌지-퍼플 그라데이션 배지 + "정 → 반 → 합" 흐름 텍스트 |

**주요 기능 (README 실측 기반)**:
- `/tas` — 기획→구현→검증→테스트 정반합 워크플로우 실행
- 다중 에이전트 오케스트레이션 (정 · 반 · 합)
- 자동 복잡도 분류 (`simple` / `medium` / `complex`)
- 누적 학습 (`lessons.md` 자동 기록)
- 컨텍스트 3계층 격리 — 토큰 소비 최소화
- `/tas-review` · `/tas-verify` · `/tas-explain` · `/tas-workspace` 보조 명령어

---

### Card B — `openai-image-mcp-server`

| 필드 | 내용 |
|------|------|
| **제목** | openai-image-mcp-server |
| **부제** | OpenAI 이미지 생성 MCP 서버 |
| **한 줄 설명** | gpt-image-1,2로 이미지를 생성·편집·변형하는 MCP 서버 |
| **링크** | https://github.com/LimSuyun/openai-image-mcp-server |
| **태그** | `Node.js` · `MCP` · `Image AI` |
| **대표 시각 요소** | 🎨 팔레트 아이콘 + 핑크-퍼플 그라데이션 배지 + 이미지 생성 격자 패턴 |

**주요 기능 (README 실측 기반)**:
- 텍스트 프롬프트 → 이미지 생성 (gpt-image-1,2)
- 이미지 편집 & 인페인팅 마스킹
- 스타일 변형 생성
- 게임 캐릭터 3프레임 스프라이트 시트 자동 생성
- Claude Desktop · Cursor · VS Code 멀티플랫폼 지원

---

## 3. 디자인 시스템

### 컬러 팔레트

| 역할 | 토큰명 | HEX | 사용처 |
|------|--------|-----|--------|
| 배경 Primary | `--color-void` | `#09090B` | 페이지 전체 배경 |
| 배경 Secondary | `--color-dark` | `#18181B` | 섹션 교대 배경 |
| Surface | `--color-surface` | `#27272A` | 카드 배경 |
| Border | `--color-outline` | `#3F3F46` | 카드·구분선 테두리 |
| Accent Primary | `--color-ember` | `#F97316` | CTA, 히어로 accent, Card A 배지 |
| Accent Secondary | `--color-aurora` | `#A855F7` | Card B 배지, 태그 highlight |
| Gradient Hero | — | `#F97316 → #EC4899 → #A855F7` | 히어로 텍스트 gradient, 배경 glow |
| Text Primary | `--color-snow` | `#FAFAFA` | 제목, 본문 주요 텍스트 |
| Text Secondary | `--color-muted` | `#A1A1AA` | 설명, 캡션 |

### 타이포그래피 스케일

```
Font Family : Pretendard Variable (한국어 최적화)
CDN         : https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/variable/pretendardvariable.css
Fallback    : -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif

역할              크기                          굵기   행간
─────────────────────────────────────────────────────────────
Hero Title       clamp(2.5rem, 5vw, 4.5rem)    700    1.1
Hero Subtitle    clamp(1rem, 2vw, 1.25rem)      400    1.6
Section Title    2.25rem (36px)                 700    1.2
Card Title       1.5rem  (24px)                 600    1.3
Card Subtitle    1rem    (16px)                 500    1.4
Body             1rem    (16px)                 400    1.6
Caption / Tag    0.875rem(14px)                 400    1.5
```

### 간격 & 그리드

```
Container max-width : 1200px, centered, padding: 0 24px
Section padding     : 96px 수직 (모바일: 48px)
Card gap            : 24px
Card padding        : 32px
Card border-radius  : 16px
Button border-radius: 8px

Projects / Team Grid:
  Desktop (≥ 1024px) : 2-column (1fr 1fr)
  Tablet  (640–1023px): 1-column
  Mobile  (< 640px)  : 1-column
```

### 반응형 브레이크포인트

| 이름 | 범위 |
|------|------|
| xs | < 480px (소형 모바일) |
| sm | 480–639px (모바일) |
| md | 640–1023px (태블릿) |
| lg | 1024–1279px (데스크탑) |
| xl | ≥ 1280px (와이드) |

### 모션 & 인터랙션 원칙

| 요소 | 트리거 | 효과 | 타이밍 |
|------|--------|------|--------|
| Hero 텍스트 | 페이지 로드 | fadeIn + slideUp, staggered 0.1s | ease-out 0.6s |
| Section 요소 | Intersection Observer (20% 진입) | fadeIn + translateY(24px → 0) | ease-out 0.5s |
| 프로젝트 카드 | :hover | translateY(-6px) + box-shadow elevation + border-color → accent | 0.2s |
| CTA 버튼 | :hover | background glow + scale(1.02) | 0.15s |
| 히어로 배경 | 연속 | 미묘한 gradient shift (8s infinite linear) | — |
| 태그 배지 | :hover | opacity 0.8 | 0.1s |
| 스크롤 | 사용자 스크롤 | scroll-behavior: smooth | CSS native |

---

## 4. 기술 스택 & 디렉토리 구조

### 확정 기술 스택

```json
{
  "dependencies": {
    "next": "^15.3",
    "react": "^19",
    "react-dom": "^19",
    "framer-motion": "^12"
  },
  "devDependencies": {
    "tailwindcss": "^4",
    "@tailwindcss/postcss": "^4",
    "typescript": "^5",
    "@types/node": "^22",
    "@types/react": "^19",
    "@types/react-dom": "^19"
  }
}
```

**Tailwind v4 설정 방식**: CSS-first (`globals.css @theme {}`) — `tailwind.config.ts` 없음

```css
/* src/app/globals.css */
@import "tailwindcss";

@theme {
  --color-void:    #09090B;
  --color-dark:    #18181B;
  --color-surface: #27272A;
  --color-outline: #3F3F46;
  --color-ember:   #F97316;
  --color-aurora:  #A855F7;
  --color-snow:    #FAFAFA;
  --color-muted:   #A1A1AA;
  --font-sans: 'Pretendard Variable', system-ui, -apple-system, sans-serif;
}
```

```js
// postcss.config.mjs
export default {
  plugins: {
    '@tailwindcss/postcss': {},
  },
};
```

### 디렉토리 구조

```
superwork_homepage/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions → GitHub Pages 자동 배포
├── public/
│   └── favicon.ico
├── src/
│   ├── app/
│   │   ├── layout.tsx          # 루트 레이아웃 (Pretendard 로드, 메타데이터)
│   │   ├── page.tsx            # 홈 페이지 (섹션 조합)
│   │   └── globals.css         # @import "tailwindcss" + @theme {} 커스텀 토큰
│   ├── components/
│   │   ├── Header.tsx          # sticky 상단 내비게이션
│   │   ├── Hero.tsx            # 히어로 섹션
│   │   ├── ProjectCard.tsx     # 재사용 프로젝트 카드 컴포넌트
│   │   ├── ProjectsSection.tsx # 카드 그리드 섹션
│   │   ├── TeamSection.tsx     # 팀 소개 섹션 (2인 카드)
│   │   └── Footer.tsx          # 푸터
│   └── data/
│       ├── projects.ts         # 프로젝트 카드 데이터 + 타입
│       └── team.ts             # 팀원 데이터 + 타입
├── next.config.ts              # output: 'export', basePath, images
├── postcss.config.mjs          # @tailwindcss/postcss 등록
├── package.json
└── tsconfig.json
```

### `next.config.ts` 핵심 설정

```ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/Superwork_KTNasmedia',
  images: {
    unoptimized: true,  // GitHub Pages 정적 배포 + GitHub avatar 외부 이미지 허용
  },
};

export default nextConfig;
```

---

## 5. 배포 전략

| 항목 | 내용 |
|------|------|
| **배포 레포** | https://github.com/SuperworkTF/Superwork_KTNasmedia |
| **배포 방식** | GitHub Actions + GitHub Pages (gh-pages 브랜치) |
| **트리거** | `push` to `main` |
| **빌드 출력** | `next build` → `/out` 디렉토리 (정적 HTML/CSS/JS) |
| **배포 액션** | `peaceiris/actions-gh-pages@v3` |
| **접근 URL** | `https://superworktf.github.io/Superwork_KTNasmedia/` |

```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./out
```

---

## 6. 정보 구조(IA) & 카피

### 섹션 구성

```
[Header — sticky]
  SUPERWORK                                      [GitHub ↗]

[Hero]
  배지  : SuperworkTF · 오픈소스 AI 도구
  H1   : 두 개의 AI 도구를
         오픈소스로 공개합니다
  Sub  : Claude Code에서 두 에이전트가 논쟁하며 코드를 개선하는 TAS,
         gpt-image-1,2로 이미지를 생성·편집하는 MCP 서버입니다.
  CTA  : [프로젝트 보기 →]

[Projects]
  레이블 : 우리가 만든 것들
  H2    : Projects
  [Card: tas]                    [Card: openai-image-mcp-server]

[Team]
  레이블 : 만든 사람들
  H2    : SUPERWORK팀
  Sub   : SuperworkTF는 AI 도구를 직접 만들고 실무에서 쓰는 개발자 팀입니다.
  [Card: simsimhae91]            [Card: LimSuyun]

[Footer]
  SUPERWORK
  github.com/SuperworkTF
  © 2026 SuperworkTF. MIT License.
```

### 팀원 카드 데이터

```ts
// src/data/team.ts
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
    username: 'simsimhae91',
    displayName: 'simsimhae91',
    role: 'TAS 개발자',
    description: 'Claude Code 플러그인 · 다중 에이전트 오케스트레이션',
    project: 'tas',
    githubUrl: 'https://github.com/simsimhae91',
    avatarUrl: 'https://github.com/simsimhae91.png',
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
];
```

> **Note**: GitHub avatar URL(`github.com/{username}.png`)은 HTTP 301 리다이렉트 후 `avatars.githubusercontent.com`으로 연결됨.  
> `<img>` 태그 직접 사용 시 문제없음. Next.js `<Image>` 컴포넌트 사용 시 `next.config.ts`의 `remotePatterns`에 `avatars.githubusercontent.com` 추가 필요.

### 카피 톤 가이드

| 원칙 | 설명 | 예시 |
|------|------|------|
| **명확성 우선** | 기능을 과장 없이 정확하게 | "두 AI가 논쟁하여 코드를 개선" ✓ / "혁신적인 AI 솔루션" ✗ |
| **개발자 언어** | 기술 용어를 한국어 맥락에서 자연스럽게 | "MCP 서버", "인페인팅", "오케스트레이션" 그대로 사용 |
| **능동태·간결체** | 짧고 직접적인 문장 | "만든다", "실행한다", "지원한다" |
| **한국어 기반** | 핵심 기술 용어만 영문, 나머지 한국어 | "gpt-image-1,2로 이미지를 생성합니다" ✓ |
| **실용 가치 강조** | 사용자가 얻는 것을 구체적으로 | "Claude Code에서 /tas 명령 하나로 시작" ✓ |

---

## 7. 구현 단계 주의사항

1. **`basePath` + 정적 에셋 경로**  
   `public/` 폴더 내 에셋을 `<img src="/logo.png">` 방식으로 참조하면 `/Superwork_KTNasmedia/logo.png`가 되어야 함.  
   Next.js `<Image>` 컴포넌트 및 `next/link`는 `basePath`를 자동 처리하므로 이들을 우선 사용.  
   `<img>` 직접 사용 시 경로에 `basePath` prefix 수동 추가 필요.

2. **GitHub Avatar `<Image>` 사용 시**  
   `next.config.ts`에 추가:
   ```ts
   images: {
     unoptimized: true,
     remotePatterns: [
       { protocol: 'https', hostname: 'avatars.githubusercontent.com' },
     ],
   }
   ```

3. **Framer Motion + Next.js App Router**  
   `'use client'` 지시어 필요. 애니메이션 컴포넌트는 모두 Client Component로 선언.

4. **Tailwind v4 클래스 확인**  
   커스텀 토큰(`--color-ember` 등)은 Tailwind v4 CSS 변수 방식으로 유틸리티 클래스 자동 생성됨.  
   사용 예: `bg-ember`, `text-aurora`, `border-outline` 등.
