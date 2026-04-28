'use client';

import Link from 'next/link';

export function Footer() {
  return (
    <footer
      style={{
        borderTop: '1px solid #3F3F46',
        backgroundColor: '#09090B',
        padding: '48px 0 32px',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 24px',
        }}
      >
        {/* 3-column 그리드: 브랜드 / 탐색 / 프로젝트 */}
        <div className="footer-grid">
          {/* 브랜드 */}
          <div>
            <p
              style={{
                fontSize: '1rem',
                fontWeight: 700,
                color: '#FAFAFA',
                marginBottom: '8px',
                letterSpacing: '-0.01em',
              }}
            >
              SUPERWORK
            </p>
            <p
              style={{
                fontSize: '0.8125rem',
                color: '#A1A1AA',
                lineHeight: 1.6,
              }}
            >
              오픈소스 AI 도구
            </p>
          </div>

          {/* 탐색 내비게이션 */}
          <nav aria-label="푸터 탐색">
            <p className="footer-col-heading">탐색</p>
            <ul
              style={{
                listStyle: 'none',
                padding: 0,
                margin: 0,
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}
            >
              <li>
                <Link href="/" className="footer-link">
                  홈
                </Link>
              </li>
              <li>
                <Link href="/workflow" className="footer-link">
                  Workflow
                </Link>
              </li>
              <li>
                <Link href="/team" className="footer-link">
                  Team
                </Link>
              </li>
            </ul>
          </nav>

          {/* 프로젝트 내비게이션 */}
          <nav aria-label="프로젝트 목록">
            <p className="footer-col-heading">프로젝트</p>
            <ul
              style={{
                listStyle: 'none',
                padding: 0,
                margin: 0,
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}
            >
              <li>
                <Link href="/projects/tas" className="footer-link">
                  TAS
                </Link>
              </li>
              <li>
                <Link
                  href="/projects/minigame-assets-mcp"
                  className="footer-link"
                >
                  Minigame Assets MCP
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        {/* 하단 바 */}
        <div
          style={{
            borderTop: '1px solid #3F3F46',
            marginTop: '32px',
            paddingTop: '20px',
            textAlign: 'center',
          }}
        >
          <p style={{ fontSize: '0.75rem', color: '#71717A' }}>
            © 2026 Superwork. MIT License.
          </p>
        </div>
      </div>
    </footer>
  );
}
