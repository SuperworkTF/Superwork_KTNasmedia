'use client';

import { motion } from 'framer-motion';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: 'easeOut' as const, delay } as const,
});

export function Hero() {
  return (
    <section
      id="home"
      className="section-full"
      style={{
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: '#09090B',
      }}
    >
      {/* Background gradient glow */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse 80% 60% at 50% -10%, #F97316 0%, #EC4899 40%, #A855F7 70%, transparent 100%)',
          animation: 'heroGlow 8s ease-in-out infinite',
          pointerEvents: 'none',
        }}
      />

      {/* Decorative grid pattern */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'linear-gradient(rgba(63,63,70,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(63,63,70,0.3) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
          maskImage: 'radial-gradient(ellipse 60% 80% at 50% 0%, black 0%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(ellipse 60% 80% at 50% 0%, black 0%, transparent 80%)',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          position: 'relative',
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 24px',
          textAlign: 'center',
        }}
      >
        {/* Badge */}
        <motion.div {...fadeUp(0)} style={{ marginBottom: '24px' }}>
          <span
            style={{
              display: 'inline-block',
              padding: '6px 16px',
              borderRadius: '9999px',
              border: '1px solid #3F3F46',
              backgroundColor: '#27272A',
              fontSize: '0.875rem',
              fontWeight: 500,
              color: '#A1A1AA',
            }}
          >
            SuperworkTF · 오픈소스 AI 도구
          </span>
        </motion.div>

        {/* H1 */}
        <motion.h1
          {...fadeUp(0.1)}
          style={{
            marginBottom: '24px',
            fontWeight: 700,
            fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
            lineHeight: 1.1,
            letterSpacing: '-0.03em',
          }}
        >
          <span
            style={{
              background: 'linear-gradient(135deg, #F97316 0%, #EC4899 50%, #A855F7 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            두 개의 AI 도구를
          </span>
          <br />
          <span style={{ color: '#FAFAFA' }}>오픈소스로 공개합니다</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          {...fadeUp(0.2)}
          style={{
            margin: '0 auto 40px',
            maxWidth: '640px',
            fontSize: 'clamp(1rem, 2vw, 1.25rem)',
            lineHeight: 1.6,
            color: '#A1A1AA',
          }}
        >
          Claude Code에서 두 에이전트가 논쟁하며 코드를 개선하는 TAS,{' '}
          DALL-E 3·gpt-image-1로 이미지를 생성·편집하는 MCP 서버입니다.
        </motion.p>

        {/* CTA */}
        <motion.div {...fadeUp(0.3)}>
          <a
            href="#projects"
            style={{
              display: 'inline-block',
              padding: '14px 32px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #F97316, #EC4899)',
              fontSize: '1rem',
              fontWeight: 600,
              color: '#FAFAFA',
              textDecoration: 'none',
              boxShadow: '0 0 24px rgba(249,115,22,0.35)',
              transition: 'transform 0.15s, box-shadow 0.15s',
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.transform = 'scale(1.02)';
              el.style.boxShadow = '0 0 40px rgba(249,115,22,0.55)';
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.transform = 'scale(1)';
              el.style.boxShadow = '0 0 24px rgba(249,115,22,0.35)';
            }}
          >
            프로젝트 보기 →
          </a>
        </motion.div>
      </div>
    </section>
  );
}
