'use client';

import { useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Home, Users, ExternalLink, X } from 'lucide-react';
import FocusTrap from 'focus-trap-react';
import { useSidebar } from '@/contexts/SidebarContext';
import { useSidebarScrollspy, SECTION_IDS } from '@/hooks/useSidebarScrollspy';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { projects } from '@/data/projects';

// ── GitHub Octocat SVG (기존 Header 스타일에 맞춤) ──────────────────
function GitHubIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

// ── 프로젝트 항목: 상세 라우트 Link + 외부 GitHub ↗ 버튼 ─────────────
// isActive: pathname.startsWith(`/projects/${project.id}`) → aria-current="page"
function SidebarProjectItem({
  icon,
  label,
  href,
  externalHref,
  isActive,
  onNav,
}: {
  icon: string;
  label: string;
  href: string;
  externalHref: string;
  isActive: boolean;
  onNav: () => void;
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
      <Link
        href={href}
        className="sidebar-item"
        aria-current={isActive ? 'page' : undefined}
        onClick={onNav}
        style={{ flex: 1, minWidth: 0 }}
      >
        <span aria-hidden="true" style={{ flexShrink: 0 }}>
          {icon}
        </span>
        <span
          style={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {label}
        </span>
      </Link>
      <a
        href={externalHref}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${label} GitHub 열기 (새 탭)`}
        style={{
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '28px',
          height: '28px',
          borderRadius: '4px',
          color: 'var(--color-muted)',
          transition: 'color 0.1s, background-color 0.1s',
          textDecoration: 'none',
        }}
        onMouseEnter={(e) => {
          const el = e.currentTarget as HTMLAnchorElement;
          el.style.color = 'var(--color-snow)';
          el.style.backgroundColor = 'var(--sidebar-item-hover-bg)';
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget as HTMLAnchorElement;
          el.style.color = 'var(--color-muted)';
          el.style.backgroundColor = 'transparent';
        }}
      >
        <ExternalLink size={12} aria-hidden="true" />
      </a>
    </div>
  );
}

// ── 메인 Sidebar 컴포넌트 ───────────────────────────────────────────
export function Sidebar() {
  const { isSidebarOpen, closeSidebar } = useSidebar();
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const activeId = useSidebarScrollspy(SECTION_IDS);
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const pathname = usePathname();

  // 모바일 드로어 오픈 시 X 버튼으로 포커스 이동
  useEffect(() => {
    if (isSidebarOpen && !isDesktop) {
      closeButtonRef.current?.focus();
    }
  }, [isSidebarOpen, isDesktop]);

  const sidebarContent = (
    <motion.aside
      className="sidebar-nav"
      id="sidebar-drawer"
      aria-label="사이드바"
      // inert 대신 Framer Motion transitionEnd로 visibility 관리:
      // - 닫힐 때: 슬라이드 완료 후 visibility:hidden → 포커스·스크린리더 차단
      // - 열릴 때: visibility:visible 즉시 적용 → FocusTrap이 tabbable 노드 접근 가능
      animate={
        isDesktop
          ? { x: 0, opacity: 1, visibility: 'visible' as const }
          : isSidebarOpen
          ? { x: 0, visibility: 'visible' as const }
          : { x: -260, transitionEnd: { visibility: 'hidden' as const } }
      }
      initial={
        isDesktop
          ? { x: 0, opacity: 0, visibility: 'visible' as const }
          : { x: -260, visibility: 'hidden' as const }
      }
      transition={
        isDesktop
          ? { duration: 0.4, ease: 'easeOut' }
          : isSidebarOpen
          // 열릴 때: spring으로 자연스러운 슬라이드인
          ? { type: 'spring', stiffness: 380, damping: 35 }
          // 닫힐 때: tween으로 x=-260px에 정확히 착지 (spring 잔여 offset ~0.4px 제거)
          : { duration: 0.22, ease: [0.4, 0, 0.6, 1] }
      }
    >
      {/* ── 1. 브랜드 헤더 ─────────────────────────────── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 12px',
          borderBottom: '1px solid var(--sidebar-border)',
          flexShrink: 0,
        }}
      >
        <Link
          href="/#home"
          onClick={closeSidebar}
          style={{
            fontSize: '1rem',
            fontWeight: 700,
            color: 'var(--color-snow)',
            textDecoration: 'none',
            letterSpacing: '-0.02em',
          }}
        >
          SUPERWORK
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          {/* GitHub 외부링크 (항상 표시) */}
          <a
            href="https://github.com/SuperworkTF"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="SuperworkTF GitHub 열기 (새 탭)"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '4px 8px',
              borderRadius: '6px',
              color: 'var(--color-muted)',
              textDecoration: 'none',
              fontSize: '0.75rem',
              transition: 'color 0.1s, background-color 0.1s',
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.color = 'var(--color-snow)';
              el.style.backgroundColor = 'var(--sidebar-item-hover-bg)';
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.color = 'var(--color-muted)';
              el.style.backgroundColor = 'transparent';
            }}
          >
            <GitHubIcon size={14} />
            <ExternalLink size={10} aria-hidden="true" />
          </a>

          {/* 모바일 전용 닫기 버튼 (lg+: CSS로 숨김) */}
          <button
            ref={closeButtonRef}
            id="sidebar-close-btn"
            onClick={closeSidebar}
            aria-label="메뉴 닫기"
            className="sidebar-hamburger"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '32px',
              height: '32px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: 'transparent',
              color: 'var(--color-muted)',
              cursor: 'pointer',
              transition: 'color 0.1s, background-color 0.1s',
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLButtonElement;
              el.style.color = 'var(--color-snow)';
              el.style.backgroundColor = 'var(--sidebar-item-hover-bg)';
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLButtonElement;
              el.style.color = 'var(--color-muted)';
              el.style.backgroundColor = 'transparent';
            }}
          >
            <X size={16} aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* ── 2. 내비게이션 ─────────────────────────────── */}
      <nav
        aria-label="사이드바 내비게이션"
        style={{ flex: 1, padding: '8px', overflowY: 'auto' }}
      >
        {/* 홈 */}
        <Link
          href="/#home"
          className="sidebar-item"
          aria-current={activeId === 'home' ? 'location' : undefined}
          onClick={closeSidebar}
        >
          <Home size={16} aria-hidden="true" />
          홈
        </Link>

        {/* ── 프로젝트 섹션 ── */}
        {/* 카테고리 레이블이 scrollspy 하이라이트 소유 (ember 색상 변화) */}
        <p
          className="sidebar-section-label"
          aria-current={activeId === 'projects' ? 'location' : undefined}
          style={activeId === 'projects' ? { color: 'var(--sidebar-item-active-border)' } : undefined}
        >
          프로젝트
        </p>

        {/* projects.ts 단일 출처 → 사이드바와 ProjectsSection 동기화 */}
        {projects.map((project) => (
          <SidebarProjectItem
            key={project.id}
            icon={project.icon}
            label={project.title}
            href={`/projects/${project.id}`}
            externalHref={project.link}
            isActive={pathname.startsWith(`/projects/${project.id}`)}
            onNav={closeSidebar}
          />
        ))}

        {/* ── 팀 섹션 ── */}
        <p className="sidebar-section-label">팀</p>

        <Link
          href="/#team"
          className="sidebar-item"
          aria-current={activeId === 'team' ? 'location' : undefined}
          onClick={closeSidebar}
        >
          <Users size={16} aria-hidden="true" />
          SUPERWORK팀
        </Link>

        {/* ── 링크 섹션 ── */}
        <p className="sidebar-section-label">링크</p>

        <a
          href="https://github.com/SuperworkTF"
          target="_blank"
          rel="noopener noreferrer"
          className="sidebar-item"
          aria-label="SuperworkTF GitHub 열기 (새 탭)"
          onClick={closeSidebar}
        >
          <GitHubIcon size={16} />
          GitHub
          <ExternalLink
            size={12}
            aria-hidden="true"
            style={{ marginLeft: 'auto', flexShrink: 0 }}
          />
        </a>
      </nav>
    </motion.aside>
  );

  return (
    <FocusTrap
      active={isSidebarOpen && !isDesktop}
      focusTrapOptions={{
        initialFocus: '#sidebar-close-btn',
        returnFocusOnDeactivate: true,
        // Escape는 LayoutShell keydown handler에서 처리
        escapeDeactivates: false,
        allowOutsideClick: true,
        // Framer Motion이 visibility:hidden→visible 전환을 완료한 뒤 활성화
        checkCanFocusTrap: (containers: Array<HTMLElement | SVGElement>) =>
          new Promise<void>((resolve) => {
            const id = setInterval(() => {
              const ready = containers.every((el: HTMLElement | SVGElement) => {
                const s = window.getComputedStyle(el);
                return s.visibility !== 'hidden' && s.display !== 'none';
              });
              if (ready) { clearInterval(id); resolve(); }
            }, 10);
          }),
      }}
    >
      {sidebarContent}
    </FocusTrap>
  );
}
