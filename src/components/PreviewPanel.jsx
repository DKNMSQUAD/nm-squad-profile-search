import { useEffect, useRef, useState } from 'react'

export default function PreviewPanel({ company, onClose }) {
  const [blocked, setBlocked] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const iframeRef = useRef(null)
  const timerRef = useRef(null)

  useEffect(() => {
    setBlocked(false)
    setLoaded(false)
    // If iframe doesn't fire onLoad within 8s, assume blocked
    timerRef.current = setTimeout(() => {
      if (!loaded) setBlocked(true)
    }, 8000)
    return () => clearTimeout(timerRef.current)
  }, [company?.id])

  const handleLoad = () => {
    clearTimeout(timerRef.current)
    setLoaded(true)
    // Try to detect X-Frame-Options block (cross-origin, so we check if contentDocument is null)
    try {
      const doc = iframeRef.current?.contentDocument
      if (doc === null || doc === undefined) {
        setBlocked(true)
      }
    } catch {
      // cross-origin — iframe loaded but we can't read it, that's fine (site is showing)
      setLoaded(true)
    }
  }

  const handleError = () => {
    clearTimeout(timerRef.current)
    setBlocked(true)
  }

  if (!company) return null

  const hasWebsite = company.website && company.website.toLowerCase() !== 'no website'

  // Mobile = bottom sheet, Desktop = right panel
  return (
    <>
      {/* Backdrop for mobile */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 40,
          display: 'none',
        }}
        className="preview-backdrop"
      />

      <div className="preview-panel" style={{
        position: 'fixed', zIndex: 50,
        background: '#fff', boxShadow: '-4px 0 32px rgba(0,0,0,0.12)',
        display: 'flex', flexDirection: 'column',
        // desktop: right side
        top: 0, right: 0, bottom: 0, width: '45%',
        // transition
        transition: 'transform 0.3s ease',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12,
          padding: '14px 18px', borderBottom: '2px solid #1a1a1a',
          background: '#eee8d9', flexShrink: 0,
        }}>
          {company.logo && company.logo !== '' && (
            <img src={company.logo} alt={company.name}
              style={{ width: 32, height: 32, objectFit: 'contain', borderRadius: 3, border: '1px solid #d9d0c0', background: '#fff', flexShrink: 0 }}
              onError={e => { e.target.style.display = 'none' }} />
          )}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: 'Playfair Display', fontSize: 17, fontWeight: 800, color: '#1a1a1a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {company.name}
            </div>
            {hasWebsite && (
              <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 9, color: '#888', letterSpacing: '0.04em', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {company.website.replace(/^https?:\/\//, '').replace(/\/$/, '')}
              </div>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
            {hasWebsite && (
              <a href={company.website} target="_blank" rel="noopener noreferrer"
                style={{ fontFamily: 'IBM Plex Mono', fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', color: '#1a1a1a', border: '1px solid #1a1a1a', padding: '5px 12px', borderRadius: 2, textDecoration: 'none', background: 'transparent', whiteSpace: 'nowrap' }}>
                OPEN
              </a>
            )}
            <button onClick={onClose}
              style={{ fontFamily: 'IBM Plex Mono', fontSize: 18, fontWeight: 400, color: '#888', border: 'none', background: 'none', cursor: 'pointer', lineHeight: 1, padding: '2px 4px' }}>
              x
            </button>
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
          {!hasWebsite ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', flexDirection: 'column', gap: 12, padding: 40 }}>
              <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 11, color: '#aaa', letterSpacing: '0.08em', textAlign: 'center' }}>NO WEBSITE AVAILABLE</div>
            </div>
          ) : blocked ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', flexDirection: 'column', gap: 16, padding: 40, textAlign: 'center' }}>
              <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#f0ece4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 20, fontWeight: 700, color: '#b5a98a' }}>
                  {company.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div style={{ fontFamily: 'Playfair Display', fontSize: 20, fontWeight: 800, color: '#1a1a1a' }}>{company.name}</div>
              <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 10, color: '#aaa', letterSpacing: '0.06em', lineHeight: 1.8 }}>
                THIS SITE RESTRICTS PREVIEW.<br />OPEN IT DIRECTLY BELOW.
              </div>
              <a href={company.website} target="_blank" rel="noopener noreferrer"
                style={{ fontFamily: 'IBM Plex Mono', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', color: '#fff', background: '#1a1a1a', border: 'none', padding: '10px 24px', borderRadius: 2, textDecoration: 'none', cursor: 'pointer' }}>
                OPEN WEBSITE
              </a>
            </div>
          ) : (
            <>
              {!loaded && (
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fafaf8' }}>
                  <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 11, color: '#aaa', letterSpacing: '0.08em' }}>LOADING...</div>
                </div>
              )}
              <iframe
                ref={iframeRef}
                src={company.website}
                onLoad={handleLoad}
                onError={handleError}
                style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
                title={company.name}
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
              />
            </>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .preview-backdrop { display: block !important; }
          .preview-panel {
            top: auto !important;
            right: 0 !important;
            bottom: 0 !important;
            left: 0 !important;
            width: 100% !important;
            height: 82vh !important;
            border-radius: 16px 16px 0 0 !important;
            box-shadow: 0 -8px 40px rgba(0,0,0,0.2) !important;
          }
        }
      `}</style>
    </>
  )
}
