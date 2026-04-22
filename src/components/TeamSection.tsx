'use client';

import { motion } from 'framer-motion';
import { team } from '@/data/team';

export function TeamSection() {
  return (
    <>
      {/* ── 인트로 섹션 ─────────────────────────────────────────────── */}
      <section
        aria-label="Superwork Team 소개"
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
              'radial-gradient(ellipse 70% 80% at 30% -20%, rgba(168,85,247,0.08) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        <div style={{ position: 'relative', maxWidth: '860px' }}>
          {/* Eyebrow */}
          <p
            style={{
              marginBottom: '16px',
              fontSize: '0.75rem',
              fontWeight: 600,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: '#BF7FFF',
            }}
          >
            SUPERWORK TEAM
          </p>

          {/* H1 */}
          <h1
            style={{
              fontSize: 'clamp(1.75rem, 4.5vw, 2.75rem)',
              fontWeight: 700,
              color: 'var(--color-snow)',
              letterSpacing: '-0.03em',
              lineHeight: 1.2,
              marginBottom: '20px',
            }}
          >
            Superwork: Think Deep, Acting Autonomous
          </h1>

          {/* Paragraph */}
          <p
            style={{
              color: 'var(--color-muted)',
              lineHeight: 1.75,
              fontSize: 'clamp(0.9375rem, 1.5vw, 1.0625rem)',
              maxWidth: '660px',
            }}
          >
            우리는 문제의 밑바닥까지 깊게 파고들어(Question & Re-define), AI 에이전트 워크플로우를 통해 가장 효율적인 방식으로 비즈니스 해답을 찾아냅니다. 기획부터 배포까지, 끊김 없는(Seamless) AI 네이티브 환경을 구축하는 것이 우리의 목표입니다.
          </p>
        </div>
      </section>

      {/* ── 멤버 카드 그리드 ───────────────────────────────────────────── */}
      <section
        aria-label="팀 멤버"
        style={{
          padding: 'clamp(48px, 6vw, 80px) clamp(16px, 4vw, 48px)',
          backgroundColor: '#09090B',
        }}
      >
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '24px',
          }}
        >
          {team.map((member, index) => (
            <motion.article
              key={member.username}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, ease: 'easeOut' as const, delay: index * 0.1 }}
              whileHover={{ y: -4 }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                borderRadius: '16px',
                border: '1px solid #3F3F46',
                backgroundColor: '#18181B',
                padding: '24px',
                transition: 'border-color 0.2s, box-shadow 0.2s',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = '#A855F7';
                el.style.boxShadow = '0 8px 32px rgba(0,0,0,0.4)';
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = '#3F3F46';
                el.style.boxShadow = 'none';
              }}
            >
              {/* 아바타 */}
              <a
                href={member.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${member.displayName} GitHub 프로필`}
                style={{ display: 'inline-block', width: 'fit-content' }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={member.avatarUrl}
                  alt={`${member.displayName} 프로필 이미지`}
                  width={64}
                  height={64}
                  style={{
                    borderRadius: '50%',
                    border: '2px solid #3F3F46',
                    display: 'block',
                  }}
                />
              </a>

              {/* displayName */}
              <h2
                style={{
                  fontSize: '1.125rem',
                  fontWeight: 600,
                  color: '#FAFAFA',
                  lineHeight: 1.3,
                  margin: 0,
                }}
              >
                {member.displayName}
              </h2>

              {/* role */}
              <p
                style={{
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  color: '#BF7FFF',
                  margin: 0,
                }}
              >
                {member.role}
              </p>

              {/* tagline (optional) */}
              {member.tagline && (
                <blockquote style={{ margin: 0, fontStyle: 'italic', color: 'var(--color-muted)' }}>
                  {member.tagline}
                </blockquote>
              )}

              {/* description */}
              <p
                style={{
                  fontSize: '0.9375rem',
                  lineHeight: 1.65,
                  color: '#A1A1AA',
                  margin: 0,
                  flex: 1,
                }}
              >
                {member.description}
              </p>

              {/* @username GitHub 링크 */}
              <a
                href={member.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontSize: '0.8125rem',
                  fontWeight: 500,
                  color: '#A1A1AA',
                  textDecoration: 'none',
                  transition: 'color 0.15s',
                  marginTop: 'auto',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.color = '#FAFAFA';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.color = '#A1A1AA';
                }}
              >
                @{member.username} →
              </a>
            </motion.article>
          ))}
        </div>
      </section>
    </>
  );
}
