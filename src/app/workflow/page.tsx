import type { Metadata } from 'next';
import { heroCopy, workflowSections } from '@/data/workflow';

export const metadata: Metadata = {
  title: 'Superwork Workflow — SUPERWORK',
  description:
    'TAS(bmad-orchestrator) 기반 AI 개발 방법론. 아이디어부터 배포까지 전 과정을 자동화합니다.',
  openGraph: {
    title: 'Superwork Workflow — SUPERWORK',
    description:
      'TAS(bmad-orchestrator) 기반 AI 개발 방법론. 아이디어부터 배포까지 전 과정을 자동화합니다.',
  },
};

export default function WorkflowPage() {
  return (
    <main id="main-content">
      <div
        style={{
          maxWidth: '960px',
          margin: '0 auto',
          padding: '48px 24px 96px',
        }}
      >
        {/* ── 히어로 ─────────────────────────────────────────────────── */}
        <section
          style={{
            marginBottom: '72px',
            paddingBottom: '48px',
            borderBottom: '1px solid var(--color-outline)',
          }}
        >
          <h1
            style={{
              fontSize: 'clamp(1.75rem, 4vw, 2.625rem)',
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
              fontSize: '1rem',
              maxWidth: '620px',
              marginBottom: '28px',
            }}
          >
            {heroCopy.subcopy}
          </p>
          {heroCopy.ctaLabel && (
            <a
              href="#overview"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '10px 20px',
                borderRadius: '8px',
                fontSize: '0.875rem',
                fontWeight: 600,
                backgroundColor: 'var(--color-ember)',
                color: '#fff',
                textDecoration: 'none',
              }}
            >
              {heroCopy.ctaLabel} ↓
            </a>
          )}
        </section>

        {/* ── 섹션 목록 스켈레톤 (chunk 3에서 다뎁스 네비 + 본문 확장) ── */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '48px',
          }}
        >
          {workflowSections.map((section) => (
            <section key={section.id} id={section.id}>
              {/* 섹션 헤딩 */}
              <h2
                style={{
                  fontSize: '1.25rem',
                  fontWeight: 700,
                  color: 'var(--color-snow)',
                  letterSpacing: '-0.02em',
                  marginBottom: '12px',
                }}
              >
                {section.title}
              </h2>

              {/* 섹션 본문 */}
              {section.body && (
                <p
                  style={{
                    color: 'var(--color-muted)',
                    lineHeight: 1.75,
                    fontSize: '0.9375rem',
                    marginBottom: section.children ? '20px' : 0,
                    whiteSpace: 'pre-line',
                  }}
                >
                  {section.body}
                </p>
              )}

              {/* 하위 항목 카드 목록 */}
              {section.children && section.children.length > 0 && (
                <ul
                  style={{
                    listStyle: 'none',
                    padding: 0,
                    margin: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                  }}
                >
                  {section.children.map((child) => (
                    <li
                      key={child.id}
                      id={child.id}
                      style={{
                        padding: '16px 20px',
                        borderRadius: '10px',
                        background: 'var(--color-surface)',
                        border: '1px solid var(--color-outline)',
                      }}
                    >
                      <p
                        style={{
                          fontSize: '0.9375rem',
                          fontWeight: 600,
                          color: 'var(--color-snow)',
                          marginBottom: child.body ? '8px' : 0,
                          letterSpacing: '-0.01em',
                        }}
                      >
                        {child.title}
                      </p>
                      {child.body && (
                        <p
                          style={{
                            fontSize: '0.875rem',
                            color: 'var(--color-muted)',
                            lineHeight: 1.7,
                            whiteSpace: 'pre-line',
                          }}
                        >
                          {child.body}
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
