import { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    console.error('App error caught by boundary:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', minHeight: '100vh', padding: '30px',
          textAlign: 'center', background: '#F4F7F5'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '16px' }}>⚠️</div>
          <h2 style={{
            fontFamily: 'system-ui, sans-serif', fontSize: '1.1rem',
            fontWeight: '800', color: '#005C35', marginBottom: '10px'
          }}>
            Something went wrong
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#555', marginBottom: '24px', lineHeight: 1.6 }}>
            The app ran into an unexpected error.<br />
            Your saved data is safe — just reload to continue.
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              background: '#005C35', color: 'white', border: 'none',
              borderRadius: '12px', padding: '13px 28px',
              fontFamily: 'system-ui, sans-serif', fontWeight: '700',
              fontSize: '0.95rem', cursor: 'pointer'
            }}
          >
            Reload App
          </button>
        </div>
      )
    }
    return this.props.children
  }
}