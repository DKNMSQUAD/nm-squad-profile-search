import CompanyCard from './CompanyCard'

export default function CompanyGrid({ companies, criteria, results, selectedCriteria }) {
  const noSelection = selectedCriteria.length === 0

  if (!noSelection && results.length === 0) {
    return (
      <div style={{ maxWidth: 1400, margin: '60px auto', padding: '0 40px', textAlign: 'center' }}>
        <h2 style={{ fontFamily: 'Playfair Display', fontSize: 26, color: '#1a1a1a', marginBottom: 8 }}>No matches found</h2>
        <p style={{ fontFamily: 'IBM Plex Mono', fontSize: 11, color: '#888', letterSpacing: '0.06em' }}>TRY REMOVING A CRITERION TO BROADEN YOUR RESULTS</p>
      </div>
    )
  }

  if (noSelection) {
    return (
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '32px 40px 60px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, marginBottom: 24, borderBottom: '1px solid #c8bfa8', paddingBottom: 12 }}>
          <h2 style={{ fontFamily: 'Playfair Display', fontSize: 26, fontWeight: 800, color: '#1a1a1a' }}>All Companies</h2>
          <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 11, color: '#888', letterSpacing: '0.1em', fontWeight: 600 }}>{companies.length} AVAILABLE</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 12 }}>
          {companies.map(c => <CompanyCard key={c.id} company={c} criteria={criteria} selectedCriteria={[]} />)}
        </div>
      </div>
    )
  }

  const bands = groupByScore(results)
  return (
    <div style={{ maxWidth: 1400, margin: '0 auto', padding: '32px 40px 60px' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, marginBottom: 32, borderBottom: '1px solid #c8bfa8', paddingBottom: 12 }}>
        <h2 style={{ fontFamily: 'Playfair Display', fontSize: 26, fontWeight: 800, color: '#1a1a1a' }}>Matched Companies</h2>
        <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 11, color: '#888', letterSpacing: '0.1em', fontWeight: 600 }}>{results.length} RESULTS</span>
      </div>
      {bands.map(band => (
        <div key={band.label} style={{ marginBottom: 44 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: '50%', background: band.color, flexShrink: 0 }} />
            <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 11, fontWeight: 700, color: band.color, letterSpacing: '0.14em', textTransform: 'uppercase' }}>{band.label}</span>
            <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 10, color: '#aaa', letterSpacing: '0.06em' }}>
              {band.min === 80 ? '80-100%' : band.min === 50 ? '50-79%' : 'below 50%'}
            </span>
            <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 10, color: '#aaa', letterSpacing: '0.06em' }}>
              &middot; {band.items.length} compan{band.items.length > 1 ? 'ies' : 'y'}
            </span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 12 }}>
            {band.items.map(c => <CompanyCard key={c.id} company={c} criteria={criteria} selectedCriteria={selectedCriteria} />)}
          </div>
        </div>
      ))}
    </div>
  )
}

function groupByScore(matches) {
  const bands = [
    { label: 'Strong Match', min: 80, max: 100, color: '#16a34a' },
    { label: 'Good Match',   min: 50, max: 79,  color: '#d97706' },
    { label: 'Partial Match',min: 1,  max: 49,  color: '#6b7280' },
  ]
  return bands
    .map(band => ({ ...band, items: matches.filter(c => c.score >= band.min && c.score <= band.max) }))
    .filter(band => band.items.length > 0)
}
