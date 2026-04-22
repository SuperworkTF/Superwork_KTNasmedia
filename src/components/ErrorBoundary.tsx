'use client';

import React from 'react';

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('[ErrorBoundary] Sidebar error caught:', error, info.componentStack);
    console.warn('[ErrorBoundary] Rendering fallback UI — click "다시 시도" to recover.');
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <aside
            style={{
              position: 'fixed',
              left: 0,
              top: 0,
              width: '260px',
              height: '100vh',
              background: '#111113',
              borderRight: '1px solid #2D2D30',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              padding: '16px',
              zIndex: 60,
            }}
          >
            <p
              style={{
                color: '#A1A1AA',
                fontSize: '0.875rem',
                textAlign: 'center',
                margin: 0,
              }}
            >
              사이드바를 불러올 수 없습니다.
            </p>
            <button
              onClick={this.handleRetry}
              style={{
                padding: '6px 14px',
                borderRadius: '6px',
                border: '1px solid #3F3F46',
                background: 'transparent',
                color: '#FAFAFA',
                fontSize: '0.8125rem',
                cursor: 'pointer',
              }}
            >
              다시 시도
            </button>
          </aside>
        )
      );
    }

    return this.props.children;
  }
}
