'use client';

import { motion } from 'framer-motion';
import { team } from '@/data/team';

export function TeamSection() {
  return (
    <section
      id="team"
      className="section-full"
      style={{ backgroundColor: '#09090B' }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, ease: 'easeOut' as const }}
          style={{ marginBottom: '64px', textAlign: 'center' }}
        >
          <p
            style={{
              marginBottom: '12px',
              fontSize: '0.75rem',
              fontWeight: 600,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: '#BF7FFF',
            }}
          >
            만든 사람들
          </p>
          <h2
            style={{
              fontSize: '2.25rem',
              fontWeight: 700,
              color: '#FAFAFA',
              lineHeight: 1.2,
              letterSpacing: '-0.02em',
              marginBottom: '16px',
            }}
          >
            SUPERWORK팀
          </h2>
          <p
            style={{
              maxWidth: '480px',
              margin: '0 auto',
              fontSize: '1rem',
              lineHeight: 1.6,
              color: '#A1A1AA',
            }}
          >
            SuperworkTF는 AI 도구를 직접 만들고 실무에서 쓰는 개발자 팀입니다.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid-2col" style={{ maxWidth: '640px', margin: '0 auto' }}>
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
                alignItems: 'center',
                gap: '14px',
                borderRadius: '12px',
                border: '1px solid #3F3F46',
                backgroundColor: '#27272A',
                padding: '16px 18px',
                transition: 'border-color 0.2s, box-shadow 0.2s',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = '#A855F7';
                el.style.boxShadow = '0 6px 24px rgba(0,0,0,0.4)';
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = '#3F3F46';
                el.style.boxShadow = 'none';
              }}
            >
              {/* Avatar */}
              <a
                href={member.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${member.displayName} GitHub 프로필`}
                style={{ flexShrink: 0 }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={member.avatarUrl}
                  alt={`${member.displayName} 프로필 이미지`}
                  width={48}
                  height={48}
                  style={{
                    borderRadius: '50%',
                    border: '2px solid #3F3F46',
                    transition: 'border-color 0.2s',
                    display: 'block',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLImageElement).style.borderColor = '#A855F7';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLImageElement).style.borderColor = '#3F3F46';
                  }}
                />
              </a>

              {/* Info */}
              <div style={{ minWidth: 0, display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <h3
                  style={{
                    fontSize: '1rem',
                    fontWeight: 600,
                    color: '#FAFAFA',
                    lineHeight: 1.3,
                  }}
                >
                  {member.displayName}
                </h3>
                <a
                  href={member.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 500,
                    color: '#A1A1AA',
                    textDecoration: 'none',
                    transition: 'color 0.15s',
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
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
