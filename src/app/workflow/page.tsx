import type { Metadata } from 'next';
import { heroCopy, workflowSections } from '@/data/workflow';
import { DetailSidebar } from '@/components/workflow/DetailSidebar';
import { SectionRenderer } from '@/components/workflow/SectionRenderer';

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
          padding: 'clamp(48px, 8vw, 96px) clamp(16px, 4vw, 48px) 64px',
          background: 'linear-gradient(180deg, #0C0C0F 0%, #09090B 100%)',
          borderBottom: '1px solid var(--color-outline)',
        }}
      >
        {/* 배경 글로우 */}
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

        <div style={{ position: 'relative', maxWidth: '860px' }}>
          {/* 배지 */}
          <div style={{ marginBottom: '20px' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 12px',
                borderRadius: '9999px',
                border: '1px solid var(--color-outline)',
                backgroundColor: 'var(--color-surface)',
                fontSize: '0.75rem',
                fontWeight: 600,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                color: 'var(--color-ember)',
              }}
            >
              AI 개발 방법론
            </span>
          </div>

          <h1
            style={{
              fontSize: 'clamp(1.75rem, 4.5vw, 2.75rem)',
              fontWeight: 700,
              color: 'var(--color-snow)',
              letterSpacing: '-0.03em',
              lineHeight: 1.2,
              marginBottom: '20px',
              whiteSpace: 'pre-line',
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
      </section>

      {/* ── 2단 레이아웃: 좌측 네비 + 우측 본문 ─────────────────── */}
      <div className="workflow-layout">
        {/* 좌측: 페이지 내 섹션 네비 (DetailSidebar가 desktop/mobile 내부 분기) */}
        <div className="workflow-sidebar-col">
          <DetailSidebar sections={workflowSections} />
        </div>

        {/* 우측: 본문 콘텐츠 */}
        <div className="workflow-content-col">
          {workflowSections.map((section) => (
            <SectionRenderer key={section.id} section={section} />
          ))}
        </div>
      </div>
    </main>
  );
}
