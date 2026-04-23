import type { Metadata } from 'next';
import { heroCopy, workflowSections } from '@/data/workflow';
import { SectionRenderer } from '@/components/workflow/SectionRenderer';
import { DetailSidebar } from '@/components/workflow/DetailSidebar';

export const metadata: Metadata = {
  title: 'Superwork Workflow — SUPERWORK',
  description:
    'TAS 기반 AI 개발 방법론. 아이디어부터 배포까지 전 과정을 자동화합니다.',
  openGraph: {
    title: 'Superwork Workflow — SUPERWORK',
    description:
      'TAS 기반 AI 개발 방법론. 아이디어부터 배포까지 전 과정을 자동화합니다.',
  },
};

export default function WorkflowPage() {
  return (
    <main id="main-content">
      {/* ── 히어로 ─────────────────────────────────────────────── */}
      <section
        aria-label="Superwork Workflow 소개"
        style={{
          position: 'relative',
          overflow: 'hidden',
          /* 수직 padding 만 section 이 담당 — 수평은 내부 1400 centered wrapper 가 담당해
             .workflow-layout 과 좌/우 edge 가 1:1 정렬됨 */
          padding: 'clamp(48px, 8vw, 96px) 0 clamp(40px, 6vw, 64px)',
          background: 'linear-gradient(180deg, #0C0C0F 0%, #09090B 100%)',
          borderBottom: '1px solid var(--color-outline)',
        }}
      >
        {/* 배경 글로우 — section 에 full-bleed */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '50%',
            background:
              'radial-gradient(ellipse 70% 80% at 30% -20%, rgba(249,115,22,0.08) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        {/* workflow-layout 과 동일한 max-width + 수평 padding 토큰 — edge 정렬 */}
        <div
          style={{
            position: 'relative',
            maxWidth: '1400px',
            margin: '0 auto',
            padding: '0 clamp(20px, 2vw, 32px)',
          }}
        >
          <div style={{ maxWidth: '860px' }}>
          {/* Eyebrow — Team 섹션과 동일한 편집 레이블 패턴 (pill 대신 text kicker) */}
          <p
            style={{
              margin: '0 0 16px',
              fontSize: '0.75rem',
              fontWeight: 600,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--color-ember)',
            }}
          >
            AI 개발 방법론
          </p>

          <h1
            style={{
              fontSize: 'clamp(1.75rem, 4.5vw, 2.75rem)',
              fontWeight: 700,
              color: 'var(--color-snow)',
              letterSpacing: '-0.03em',
              lineHeight: 1.2,
              marginBottom: '20px',
              whiteSpace: 'pre-line',
              wordBreak: 'keep-all',
            }}
          >
            {heroCopy.headline}
          </h1>

          <p
            style={{
              color: 'var(--color-muted)',
              lineHeight: 1.75,
              fontSize: 'clamp(0.9375rem, 1.5vw, 1.0625rem)',
              maxWidth: '600px',
              marginBottom: '32px',
            }}
          >
            {heroCopy.subcopy}
          </p>

          {heroCopy.ctaLabel && (
            <a href="#overview" className="workflow-cta-btn">
              {heroCopy.ctaLabel} ↓
            </a>
          )}
          </div>
        </div>
      </section>

      {/* ── 좌측 TOC + 본문 (데스크톱 3단: 글로벌 사이드바 + TOC + 본문) ─── */}
      <div className="workflow-layout">
        <aside className="workflow-toc-col" aria-label="이 페이지에서">
          <DetailSidebar sections={workflowSections} />
        </aside>
        <div className="workflow-content-col">
          {workflowSections.map((section) => (
            <SectionRenderer key={section.id} section={section} />
          ))}
        </div>
      </div>
    </main>
  );
}
