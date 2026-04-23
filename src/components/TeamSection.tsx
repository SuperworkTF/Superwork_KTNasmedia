'use client';

import { motion } from 'framer-motion';
import { team } from '@/data/team';

export function TeamSection() {
  return (
    <>
      {/* ── 인트로 섹션 ─────────────────────────────────────────────── */}
      <section
        id="team"
        aria-label="Superwork Team 소개"
        style={{
          position: 'relative',
          overflow: 'hidden',
          /* 수직 padding 만 section 담당 — 수평은 내부 1400 centered wrapper 가
             담당해 아래 멤버 그리드와 edge 1:1 정렬 */
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
              'radial-gradient(ellipse 70% 80% at 30% -20%, rgba(168,85,247,0.08) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        {/* 멤버 그리드와 동일한 max-width + horizontal padding 토큰 — edge 정렬 */}
        <div
          style={{
            position: 'relative',
            maxWidth: '1400px',
            margin: '0 auto',
            padding: '0 clamp(20px, 2vw, 32px)',
          }}
        >
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
              wordBreak: 'keep-all',
            }}
          >
            Superwork: Think Deeply, Act Autonomously
          </h1>

          {/* Paragraph — 1400 래퍼와 동일 폭으로 흘려, 와이드 뷰포트에서도 edge 정렬 유지 */}
          <p
            style={{
              color: 'var(--color-muted)',
              lineHeight: 1.75,
              fontSize: 'clamp(0.9375rem, 1.5vw, 1.0625rem)',
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
          /* 수직 padding 만 section 담당, 수평은 내부 1400 centered wrapper 가 담당 */
          padding: 'clamp(48px, 6vw, 80px) 0',
          backgroundColor: '#09090B',
        }}
      >
        <div
          style={{
            /* 인트로 섹션과 동일한 max-width + horizontal padding — edge 1:1 정렬 */
            maxWidth: '1400px',
            margin: '0 auto',
            padding: '0 clamp(20px, 2vw, 32px)',
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
              viewport={{ once: true, amount: 0.05 }}
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
                onMouseEnter={(e) => {
                  const img = e.currentTarget.querySelector('img') as HTMLImageElement | null;
                  if (img) img.style.borderColor = '#A855F7';
                }}
                onMouseLeave={(e) => {
                  const img = e.currentTarget.querySelector('img') as HTMLImageElement | null;
                  if (img) img.style.borderColor = '#3F3F46';
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={member.avatarUrl}
                  alt={`${member.displayName} 프로필 이미지`}
                  width={64}
                  height={64}
                  loading="lazy"
                  decoding="async"
                  style={{
                    borderRadius: '50%',
                    border: '2px solid #3F3F46',
                    display: 'block',
                    transition: 'border-color 0.15s ease-out',
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
                <blockquote style={{ margin: 0, fontStyle: 'italic', color: 'var(--color-muted)', fontSize: '0.875rem' }}>
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
