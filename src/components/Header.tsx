'use client';

import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useSidebar } from '@/contexts/SidebarContext';

export function Header() {
  const { isSidebarOpen, toggleSidebar } = useSidebar();

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        width: '100%',
        borderBottom: '1px solid #3F3F46',
        backgroundColor: 'rgba(9,9,11,0.85)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 24px',
          height: '64px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* 모바일 전용 브랜드 로고 (lg+: CSS로 숨김) */}
        <a
          href="#home"
          className="header-brand-mobile"
          style={{
            fontSize: '1.25rem',
            fontWeight: 700,
            letterSpacing: '-0.02em',
            color: '#FAFAFA',
            textDecoration: 'none',
          }}
          aria-label="SUPERWORK 홈으로"
        >
          SUPERWORK
        </a>

        <nav aria-label="주요 메뉴" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* 모바일 전용 GitHub 버튼 (lg+: CSS로 숨김 — 사이드바에 존재) */}
          <a
            href="https://github.com/SuperworkTF"
            target="_blank"
            rel="noopener noreferrer"
            className="sidebar-hamburger"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              borderRadius: '8px',
              border: '1px solid #3F3F46',
              fontSize: '0.875rem',
              fontWeight: 500,
              color: '#A1A1AA',
              textDecoration: 'none',
              transition: 'border-color 0.15s, color 0.15s',
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.borderColor = '#F97316';
              el.style.color = '#FAFAFA';
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.borderColor = '#3F3F46';
              el.style.color = '#A1A1AA';
            }}
          >
            GitHub
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path d="M2.5 9.5L9.5 2.5M9.5 2.5H4.5M9.5 2.5V7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>

          {/* 햄버거 버튼 — 모바일 전용 (lg+: CSS로 숨김) */}
          <button
            id="sidebar-toggle-btn"
            onClick={toggleSidebar}
            aria-expanded={isSidebarOpen}
            aria-controls="sidebar-drawer"
            aria-label={isSidebarOpen ? '메뉴 닫기' : '메뉴 열기'}
            className="sidebar-hamburger"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '40px',
              height: '40px',
              borderRadius: '8px',
              border: '1px solid #3F3F46',
              backgroundColor: 'transparent',
              color: '#A1A1AA',
              cursor: 'pointer',
              transition: 'border-color 0.15s, color 0.15s',
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLButtonElement;
              el.style.borderColor = '#F97316';
              el.style.color = '#FAFAFA';
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLButtonElement;
              el.style.borderColor = '#3F3F46';
              el.style.color = '#A1A1AA';
            }}
          >
            {isSidebarOpen ? (
              <X size={18} aria-hidden="true" />
            ) : (
              <Menu size={18} aria-hidden="true" />
            )}
          </button>
        </nav>
      </div>
    </motion.header>
  );
}
