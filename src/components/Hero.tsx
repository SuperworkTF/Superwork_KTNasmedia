'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export function Hero() {
  const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: 'easeOut' as const, delay } as const,
  });

  return (
    <section
      id="home"
      className="section-full"
      style={{
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: '#09090B',
        minHeight: '100svh',
        display: 'flex',
        alignItems: 'center',
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
          /* flex 자식의 min-width: auto 로 인한 가로 오버플로우 방지
             (좁은 뷰포트에서 자식 min-content 가 부모를 밀어내는 문제) */
          width: '100%',
          minWidth: 0,
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 clamp(16px, 4vw, 24px)',
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
            AI 네이티브 개발 조직
          </span>
        </motion.div>

        {/* H1 — 모바일에선 min 2.5rem 이 375px 뷰포트를 밀어내 오버플로우가 나던 문제를
            해결하기 위해 min 을 1.875rem 으로 낮춤. 모바일 vw 스케일에서 여유있게 렌더 */}
        <motion.h1
          {...fadeUp(0.1)}
          style={{
            marginBottom: '24px',
            fontWeight: 700,
            fontSize: 'clamp(1.875rem, 7vw, 4.5rem)',
            lineHeight: 1.15,
            letterSpacing: '-0.03em',
            wordBreak: 'keep-all',
          }}
        >
          <span
            style={{
              background: 'linear-gradient(135deg, #F97316 0%, #EC4899 50%, #A855F7 100%)',
              color: '#F97316', /* gradient-clip 미지원 환경 폴백 */
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            SUPERWORK를 소개합니다
          </span>
          <br />
          <span
            style={{
              color: '#FAFAFA',
              /* line 2는 supporting statement — line 1 (hero)과 sub(body) 사이 중간 계층.
                 모바일 min 을 1rem 으로 내려서 좁은 뷰포트에서도 안전하게 렌더 */
              fontSize: 'clamp(1rem, 3.5vw, 2rem)',
              fontWeight: 600,
            }}
          >
            기획·개발·검증·배포 전 과정을 AI 에이전트가 주도합니다.
          </span>
        </motion.h1>

        {/* Subtitle — 와이드에서 한 줄 렌더링을 위해 외부 래퍼(1200px) 내 거의 풀폭으로 확장 */}
        <motion.p
          {...fadeUp(0.2)}
          style={{
            margin: '0 auto 40px',
            maxWidth: '1120px',
            fontSize: 'clamp(1rem, 2vw, 1.25rem)',
            lineHeight: 1.6,
            color: '#A1A1AA',
          }}
        >
          Superwork Workflow 프로세스와 공개된 오픈소스 프로젝트를 살펴보세요.
        </motion.p>

        {/* CTAs — Primary: Workflow(filled), Secondary: Team(outlined, 퍼플 호버)
            grid 1fr 1fr 로 두 버튼 폭 동일 보장. 좁은 뷰포트는 min(240px, 100%)
            트릭으로 컬럼 min 을 컨테이너 폭 이하로 제약해 자연스럽게 1-col 로 스택됨 */}
        <motion.div
          {...fadeUp(0.3)}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(240px, 100%), 1fr))',
            gap: '12px',
            width: '100%',
            maxWidth: '560px',
            margin: '0 auto',
          }}
        >
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
            <Link
              href="/workflow"
              style={{
                display: 'block',
                padding: '14px 32px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #F97316, #EC4899)',
                fontSize: '1rem',
                fontWeight: 600,
                color: '#09090B', /* 어두운 텍스트로 WCAG AA 확보 */
                textDecoration: 'none',
                textAlign: 'center',
                boxShadow: '0 0 24px rgba(249,115,22,0.35)',
                transition: 'box-shadow 0.15s ease-out',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.boxShadow =
                  '0 0 40px rgba(249,115,22,0.55)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.boxShadow =
                  '0 0 24px rgba(249,115,22,0.35)';
              }}
            >
              Superwork Workflow →
            </Link>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
            <Link
              href="/team"
              style={{
                display: 'block',
                padding: '14px 32px',
                borderRadius: '8px',
                border: '1px solid #3F3F46',
                backgroundColor: 'transparent',
                fontSize: '1rem',
                fontWeight: 600,
                color: '#FAFAFA',
                textDecoration: 'none',
                textAlign: 'center',
                transition: 'border-color 0.15s ease-out, background-color 0.15s ease-out',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLAnchorElement;
                el.style.borderColor = '#BF7FFF';
                el.style.backgroundColor = 'rgba(191,127,255,0.04)';
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLAnchorElement;
                el.style.borderColor = '#3F3F46';
                el.style.backgroundColor = 'transparent';
              }}
            >
              Superwork Team →
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
