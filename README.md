# SUPERWORK Homepage

SuperworkTF 팀의 오픈소스 AI 도구를 소개하는 정적 홈페이지입니다.

**라이브**: https://superworktf.github.io/Superwork_KTNasmedia/

## 소개 프로젝트

| 프로젝트 | 설명 | 링크 |
|---------|------|------|
| **tas** | 두 AI 에이전트가 논쟁하며 더 나은 코드를 만드는 Claude Code 플러그인 | [simsimhae91/tas](https://github.com/simsimhae91/tas) |
| **openai-image-mcp-server** | gpt-image-1,2로 이미지를 생성·편집·변형하는 MCP 서버 | [LimSuyun/openai-image-mcp-server](https://github.com/LimSuyun/openai-image-mcp-server) |

## 기술 스택

- **Next.js 15** (App Router, Static Export)
- **React 19**
- **Tailwind CSS v4** (CSS-first `@theme {}`)
- **Framer Motion 12**
- **TypeScript 5**

## 로컬 개발

```bash
# 의존성 설치
npm install

# 개발 서버 실행 (http://localhost:3000)
npm run dev

# 정적 빌드 (./out 디렉토리 생성)
npm run build
```

## 배포

### GitHub Actions 자동 배포

`main` 브랜치에 push하면 GitHub Actions가 자동으로 빌드하고 `gh-pages` 브랜치에 배포합니다.

```
main → (Actions) npm ci + npm run build → peaceiris/actions-gh-pages → gh-pages 브랜치
```

배포 대상 레포: [SuperworkTF/Superwork_KTNasmedia](https://github.com/SuperworkTF/Superwork_KTNasmedia)

### 원격 저장소 연결

```bash
# 원격 저장소 추가
git remote add origin https://github.com/SuperworkTF/Superwork_KTNasmedia.git

# 현재 원격 확인
git remote -v

# main 브랜치로 push (첫 push)
git push -u origin main
```

### GitHub Pages 설정

1. 레포 → Settings → Pages
2. Source: `Deploy from a branch`
3. Branch: `gh-pages` / `/ (root)`
4. Save

첫 배포 후 `https://superworktf.github.io/Superwork_KTNasmedia/` 에서 확인할 수 있습니다.

## 디렉토리 구조

```
superwork_homepage/
├── .github/workflows/deploy.yml   # GitHub Actions 자동 배포
├── src/
│   ├── app/
│   │   ├── layout.tsx             # 루트 레이아웃 (Pretendard 폰트)
│   │   ├── page.tsx               # 홈 페이지
│   │   └── globals.css            # Tailwind v4 @theme 토큰
│   ├── components/
│   │   ├── Header.tsx             # sticky 헤더
│   │   ├── Hero.tsx               # 히어로 섹션
│   │   ├── ProjectCard.tsx        # 프로젝트 카드
│   │   ├── ProjectsSection.tsx    # 프로젝트 섹션
│   │   ├── TeamSection.tsx        # 팀 섹션
│   │   └── Footer.tsx             # 푸터
│   └── data/
│       ├── projects.ts            # 프로젝트 데이터
│       └── team.ts                # 팀원 데이터
├── next.config.ts                 # output: export, basePath
├── postcss.config.mjs             # @tailwindcss/postcss
├── package.json
└── tsconfig.json
```

## 라이선스

MIT License © 2026 SuperworkTF
