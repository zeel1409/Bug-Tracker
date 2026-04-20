import { Link } from 'react-router-dom';
import { Bug, Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#f1f5f9',
      fontFamily: "'Inter', sans-serif",
      padding: '24px 16px',
    }}>
      <div style={{ textAlign: 'center', maxWidth: 420 }}>

        {/* Logo */}
        <div style={{
          width: 56, height: 56,
          borderRadius: 16,
          background: 'linear-gradient(135deg, #5865f2, #7c3aed)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 24px',
          boxShadow: '0 8px 24px rgba(88,101,242,0.35)',
        }}>
          <Bug size={26} color="white" />
        </div>

        {/* 404 */}
        <div style={{
          fontSize: 96,
          fontWeight: 900,
          lineHeight: 1,
          background: 'linear-gradient(135deg, #5865f2, #7c3aed)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          marginBottom: 8,
          letterSpacing: '-4px',
        }}>
          404
        </div>

        <h1 style={{
          fontSize: 22,
          fontWeight: 700,
          color: '#1e293b',
          margin: '0 0 10px',
          letterSpacing: '-0.4px',
        }}>
          Page Not Found
        </h1>

        <p style={{
          fontSize: 14,
          color: '#94a3b8',
          margin: '0 0 32px',
          lineHeight: 1.6,
        }}>
          Looks like this bug got away. The page you're looking for doesn't exist or has been moved.
        </p>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link
            to="/dashboard"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 7,
              padding: '10px 20px',
              background: 'linear-gradient(135deg, #5865f2, #7c3aed)',
              color: 'white',
              borderRadius: 10,
              fontSize: 13.5,
              fontWeight: 600,
              textDecoration: 'none',
              boxShadow: '0 4px 16px rgba(88,101,242,0.35)',
              transition: 'transform 0.15s, box-shadow 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(88,101,242,0.45)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 4px 16px rgba(88,101,242,0.35)'; }}
          >
            <Home size={15} /> Go to Dashboard
          </Link>

          <button
            onClick={() => window.history.back()}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 7,
              padding: '10px 20px',
              background: '#ffffff',
              color: '#64748b',
              border: '1.5px solid #e2e8f0',
              borderRadius: 10,
              fontSize: 13.5,
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: "'Inter', sans-serif",
              transition: 'background 0.15s, color 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.color = '#1e293b'; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#ffffff'; e.currentTarget.style.color = '#64748b'; }}
          >
            <ArrowLeft size={15} /> Go Back
          </button>
        </div>

        {/* Footer hint */}
        <p style={{ fontSize: 12, color: '#cbd5e1', marginTop: 36 }}>
          BugTracker · Issue Tracker
        </p>
      </div>
    </div>
  );
}
