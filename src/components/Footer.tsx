'use client';

export function Footer() {
  return (
    <footer
      style={{
        borderTop: '1px solid #3F3F46',
        backgroundColor: '#09090B',
        padding: '48px 0',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 24px',
          textAlign: 'center',
        }}
      >
        <p
          style={{
            fontSize: '1.125rem',
            fontWeight: 700,
            color: '#FAFAFA',
            marginBottom: '8px',
            letterSpacing: '-0.01em',
          }}
        >
          SUPERWORK
        </p>
        <a
          href="https://github.com/SuperworkTF"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-block',
            marginBottom: '16px',
            fontSize: '0.875rem',
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
          github.com/SuperworkTF
        </a>
        <p style={{ fontSize: '0.75rem', color: '#A1A1AA' }}>
          © 2026 SuperworkTF. MIT License.
        </p>
      </div>
    </footer>
  );
}
