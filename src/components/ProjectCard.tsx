'use client';

import { motion } from 'framer-motion';
import type { Project } from '@/data/projects';

interface ProjectCardProps {
  project: Project;
  index: number;
}

export function ProjectCard({ project, index }: ProjectCardProps) {
  const accentColor = project.accentColor === 'ember' ? '#F97316' : '#BF7FFF';
  const tagBg =
    project.accentColor === 'ember'
      ? 'rgba(249,115,22,0.12)'
      : 'rgba(168,85,247,0.12)';
  const tagBorder =
    project.accentColor === 'ember'
      ? 'rgba(249,115,22,0.3)'
      : 'rgba(168,85,247,0.3)';

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, ease: 'easeOut' as const, delay: index * 0.1 }}
      whileHover={{ y: -6 }}
      style={{
        position: 'relative',
        borderRadius: '16px',
        border: '1px solid #3F3F46',
        backgroundColor: '#27272A',
        padding: '32px',
        transition: 'border-color 0.2s, box-shadow 0.2s',
        cursor: 'default',
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.borderColor = accentColor;
        el.style.boxShadow = `0 8px 40px rgba(0,0,0,0.5), 0 0 0 1px ${accentColor}`;
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.borderColor = '#3F3F46';
        el.style.boxShadow = 'none';
      }}
    >
      {/* Header row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          marginBottom: '20px',
        }}
      >
        {/* Icon */}
        <div
          aria-hidden="true"
          style={{
            width: '52px',
            height: '52px',
            borderRadius: '12px',
            background: `linear-gradient(135deg, ${project.gradientFrom}, ${project.gradientTo})`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.5rem',
            flexShrink: 0,
          }}
        >
          {project.icon}
        </div>

        {/* GitHub link */}
        <a
          href={project.link}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${project.title} GitHub 리포지토리 방문`}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            padding: '6px 12px',
            borderRadius: '6px',
            border: '1px solid #3F3F46',
            fontSize: '0.75rem',
            fontWeight: 500,
            color: '#A1A1AA',
            textDecoration: 'none',
            transition: 'border-color 0.15s, color 0.15s',
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget as HTMLAnchorElement;
            el.style.borderColor = accentColor;
            el.style.color = '#FAFAFA';
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLAnchorElement;
            el.style.borderColor = '#3F3F46';
            el.style.color = '#A1A1AA';
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
          </svg>
          GitHub ↗
        </a>
      </div>

      {/* Title & description */}
      <h3
        style={{
          fontSize: '1.5rem',
          fontWeight: 600,
          color: '#FAFAFA',
          marginBottom: '4px',
          lineHeight: 1.3,
        }}
      >
        {project.title}
      </h3>
      <p
        style={{
          fontSize: '1rem',
          fontWeight: 500,
          color: accentColor,
          marginBottom: '12px',
        }}
      >
        {project.subtitle}
      </p>
      <p
        style={{
          fontSize: '1rem',
          lineHeight: 1.6,
          color: '#A1A1AA',
          marginBottom: '24px',
        }}
      >
        {project.description}
      </p>

      {/* Divider */}
      <div
        aria-hidden="true"
        style={{
          height: '1px',
          backgroundColor: '#3F3F46',
          marginBottom: '20px',
        }}
      />

      {/* Feature list */}
      <ul
        style={{ listStyle: 'none', padding: 0, margin: '0 0 24px', display: 'flex', flexDirection: 'column', gap: '10px' }}
        aria-label={`${project.title} 주요 기능`}
      >
        {project.features.map((feature, i) => (
          <li
            key={i}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '8px',
              fontSize: '0.875rem',
              lineHeight: 1.5,
              color: '#A1A1AA',
            }}
          >
            <span
              aria-hidden="true"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                background: `linear-gradient(135deg, ${project.gradientFrom}, ${project.gradientTo})`,
                fontSize: '9px',
                color: '#fff',
                flexShrink: 0,
                marginTop: '2px',
              }}
            >
              ✓
            </span>
            {feature}
          </li>
        ))}
      </ul>

      {/* Tags */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
        {project.tags.map((tag) => (
          <span
            key={tag}
            style={{
              padding: '4px 10px',
              borderRadius: '9999px',
              fontSize: '0.75rem',
              fontWeight: 500,
              backgroundColor: tagBg,
              color: accentColor,
              border: `1px solid ${tagBorder}`,
              transition: 'opacity 0.1s',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLSpanElement).style.opacity = '0.75';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLSpanElement).style.opacity = '1';
            }}
          >
            {tag}
          </span>
        ))}
      </div>
    </motion.article>
  );
}
