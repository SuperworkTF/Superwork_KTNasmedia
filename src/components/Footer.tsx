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
        <p style={{ fontSize: '0.75rem', color: '#A1A1AA' }}>
          © 2026 Superwork. MIT License.
        </p>
      </div>
    </footer>
  );
}
