'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion, MotionConfig } from 'framer-motion';
import { SidebarContext } from '@/contexts/SidebarContext';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { Footer } from './Footer';
import { ErrorBoundary } from './ErrorBoundary';

export function LayoutShell({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();

  const closeSidebar = useCallback(() => setIsSidebarOpen(false), []);
  const openSidebar = useCallback(() => setIsSidebarOpen(true), []);
  const toggleSidebar = useCallback(() => setIsSidebarOpen((prev) => !prev), []);

  // 라우트 변경 시 드로어 닫기 (미래 서브라우트 대비)
  useEffect(() => {
    closeSidebar();
  }, [pathname, closeSidebar]);

  // Escape 키로 드로어 닫기 (focus-trap의 escapeDeactivates:false와 함께 동작)
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeSidebar();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [closeSidebar]);

  const ctxValue = useMemo(
    () => ({ isSidebarOpen, openSidebar, closeSidebar, toggleSidebar }),
    [isSidebarOpen, openSidebar, closeSidebar, toggleSidebar]
  );

  return (
    <MotionConfig reducedMotion="user">
    <SidebarContext.Provider value={ctxValue}>
      <div style={{ display: 'flex', minHeight: '100vh' }}>
        <ErrorBoundary>
          <Sidebar />
        </ErrorBoundary>

        {/* 모바일 백드롭 — AnimatePresence로 exit 애니메이션 보장 */}
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.div
              key="sidebar-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              aria-hidden="true"
              onClick={closeSidebar}
              style={{
                position: 'fixed',
                inset: 0,
                zIndex: 39,
                background: 'rgba(0, 0, 0, 0.65)',
                backdropFilter: 'blur(2px)',
                WebkitBackdropFilter: 'blur(2px)',
              }}
            />
          )}
        </AnimatePresence>

        {/* 콘텐츠 영역 — lg+: margin-left: 260px, <lg: full width */}
        <div className="content-area">
          <Header />
          {children}
          <Footer />
        </div>
      </div>
    </SidebarContext.Provider>
    </MotionConfig>
  );
}
