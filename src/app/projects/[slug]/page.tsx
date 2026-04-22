import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { projects } from '@/data/projects';
import { withBasePath } from '@/lib/basePath';

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.id }));
  // Covers: 'tas', 'openai-image-mcp-server'
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
    title: `${project.title} — SUPERWORK`,
    description: project.description,
    openGraph: {
      title: `${project.title} — SUPERWORK`,
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

  return (
    <main id="main-content">
      <div
        style={{
          maxWidth: '800px',
          margin: '0 auto',
          padding: '48px 24px 96px',
        }}
      >
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
            alt={`${project.title} 프로젝트 대표 이미지`}
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
          <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>
            {project.icon}
          </div>
          <h1
            style={{
              fontSize: '1.75rem',
              fontWeight: 700,
              color: 'var(--color-snow)',
              letterSpacing: '-0.02em',
              marginBottom: '8px',
            }}
          >
            {project.title}
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
            {/* project.link is currently always a GitHub URL for both projects */}
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 18px',
                borderRadius: '8px',
                fontSize: '0.875rem',
                fontWeight: 600,
                backgroundColor: accentVar,
                color: '#fff',
                textDecoration: 'none',
              }}
            >
              GitHub에서 보기 ↗
            </a>
            <Link
              href="/#projects"
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
            marginBottom: '32px',
          }}
        >
          {project.description}
        </p>

        {/* ── Features as "사용 방법" ── */}
        <section>
          <h2
            style={{
              fontSize: '1.125rem',
              fontWeight: 700,
              color: 'var(--color-snow)',
              marginBottom: '16px',
            }}
          >
            사용 방법
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
