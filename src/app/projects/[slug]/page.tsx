import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { projects } from '@/data/projects';
import { withBasePath } from '@/lib/basePath';

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.id }));
  // Covers: 'tas', 'minigame-assets-mcp'
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = projects.find((p) => p.id === slug);
  if (!project) return {};
  return {
    title: `${project.displayTitle} — SUPERWORK`,
    description: project.description,
    openGraph: {
      title: `${project.displayTitle} — SUPERWORK`,
      description: project.description,
    },
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = projects.find((p) => p.id === slug);
  if (!project) notFound();

  const accentVar =
    project.accentColor === 'ember' ? 'var(--color-ember)' : 'var(--color-aurora)';

  const breadcrumbJsonLd = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: '홈' },
      { '@type': 'ListItem', position: 2, name: '프로젝트' },
      { '@type': 'ListItem', position: 3, name: project.displayTitle },
    ],
  });

  return (
    <main id="main-content">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: breadcrumbJsonLd }}
      />
      <div
        style={{
          maxWidth: '800px',
          margin: '0 auto',
          padding: '48px 24px 96px',
        }}
      >
        {/* ── 브레드크럼 ── */}
        <nav aria-label="탐색 경로" style={{ marginBottom: '24px' }}>
          <ol className="breadcrumb">
            <li>
              <Link href="/" className="breadcrumb-link">
                홈
              </Link>
            </li>
            <li aria-hidden="true" className="breadcrumb-sep">/</li>
            <li>
              <Link href="/#projects" className="breadcrumb-link">
                프로젝트
              </Link>
            </li>
            <li aria-hidden="true" className="breadcrumb-sep">/</li>
            <li aria-current="page" className="breadcrumb-current">
              {project.displayTitle}
            </li>
          </ol>
        </nav>

        {/* ── Hero banner image ── */}
        <div
          style={{
            position: 'relative',
            marginBottom: '24px',
            borderRadius: '12px',
            overflow: 'hidden',
            border: `1px solid ${project.gradientFrom}33`,
            aspectRatio: '1600 / 914',
            backgroundColor: 'var(--color-surface)',
          }}
        >
          <Image
            src={withBasePath(`/projects/${project.id}.jpg`)}
            alt={`${project.displayTitle} 프로젝트 대표 이미지`}
            fill
            sizes="(max-width: 800px) 100vw, 800px"
            priority
            style={{ objectFit: 'cover' }}
          />
        </div>

        {/* ── Header accent card ── */}
        <div
          style={{
            background: `linear-gradient(135deg, ${project.gradientFrom}1A, ${project.gradientTo}0D)`,
            border: `1px solid ${project.gradientFrom}33`,
            borderRadius: '12px',
            padding: '32px',
            marginBottom: '32px',
          }}
        >
          <div style={{ fontSize: '2rem', marginBottom: '12px' }}>
            {project.icon}
          </div>
          <h1
            style={{
              fontSize: 'clamp(1.75rem, 3vw, 2.25rem)',
              fontWeight: 700,
              color: 'var(--color-snow)',
              letterSpacing: '-0.02em',
              marginBottom: '8px',
              wordBreak: 'keep-all',
            }}
          >
            {project.displayTitle}
          </h1>
          <p style={{ color: 'var(--color-muted)', marginBottom: '16px' }}>
            {project.subtitle}
          </p>

          {/* Tags */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '8px',
              marginBottom: '24px',
            }}
          >
            {project.tags.map((tag) => (
              <span
                key={tag}
                style={{
                  padding: '2px 10px',
                  borderRadius: '999px',
                  fontSize: '0.75rem',
                  background: 'rgba(255,255,255,0.06)',
                  color: 'var(--color-muted)',
                  border: '1px solid var(--color-outline)',
                }}
              >
                {tag}
              </span>
            ))}
          </div>

          {/* CTAs */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
            {/* link 없는 비공개 프로젝트는 GitHub CTA 숨김 */}
            {project.link && (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="project-cta-primary"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 18px',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  backgroundColor: accentVar,
                  color: 'var(--color-void)', /* 흰 텍스트 2.81:1(fail) → 어두운 텍스트 7.06:1+ (WCAG AA) */
                  textDecoration: 'none',
                  width: '100%',
                }}
              >
                GitHub에서 보기 ↗
              </a>
            )}
            <Link
              href="/#projects"
              className="project-cta-secondary"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 18px',
                borderRadius: '8px',
                fontSize: '0.875rem',
                fontWeight: 500,
                background: 'transparent',
                color: 'var(--color-muted)',
                border: '1px solid var(--color-outline)',
                textDecoration: 'none',
                width: '100%',
              }}
            >
              ← 프로젝트 목록으로
            </Link>
          </div>
        </div>

        {/* ── Description ── */}
        <p
          style={{
            color: 'var(--color-muted)',
            lineHeight: 1.75,
            marginBottom: project.relatedWorkflowId ? '16px' : '32px',
          }}
        >
          {project.description}
        </p>

        {/* ── 관련 워크플로우 링크 ── */}
        {project.relatedWorkflowId && (
          <div style={{ marginBottom: '32px' }}>
            <Link
              href={`/workflow#${project.relatedWorkflowId}`}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.875rem',
                color: accentVar,
                textDecoration: 'none',
                fontWeight: 500,
              }}
            >
              Superwork Workflow에서 보기 →
            </Link>
          </div>
        )}

        {/* ── Features as "주요 기능" ── */}
        <section>
          <h2
            style={{
              fontSize: '1.125rem',
              fontWeight: 700,
              color: 'var(--color-snow)',
              marginBottom: '16px',
            }}
          >
            주요 기능
          </h2>
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
            {project.features.map((feature, i) => (
              <li
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  background: 'var(--color-surface)',
                  border: '1px solid var(--color-outline)',
                  fontSize: '0.875rem',
                  color: 'var(--color-snow)',
                  lineHeight: 1.6,
                }}
              >
                <span
                  style={{ color: accentVar, flexShrink: 0, fontWeight: 700 }}
                  aria-hidden="true"
                >
                  →
                </span>
                {feature}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
}
