// PWF1 — Triptyque : 3 colonnes (Expérience | Formation | Certifications)
function PWF1Triptyque() {
  return (
    <div className="wf">
      <div className="spread" style={{ marginBottom: 18 }}>
        <div>
          <div className="kicker">Portfolio · v1 · Triptyque</div>
          <h1>Parcours</h1>
          <div className="mono" style={{ marginTop:4, fontSize: 11, maxWidth: 480 }}>
            Trois colonnes côte à côte — comparable d'un seul regard, mais peu de place pour les détails.
          </div>
        </div>
        <div className="row" style={{ gap: 8 }}>
          <span className="chip chip-mini chip-on">Tout</span>
          <span className="chip chip-mini">Pro</span>
          <span className="chip chip-mini">Études</span>
          <span className="chip chip-mini">Certifs</span>
        </div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1.4fr 1fr 1.3fr', gap: 14, height: 'calc(100% - 110px)' }}>
        {/* COL 1 — EXPÉRIENCES */}
        <div className="col" style={{ gap: 10 }}>
          <div className="row" style={{ justifyContent:'space-between' }}>
            <h2 className="underline-sketch" style={{ fontSize:16 }}>I · Expérience</h2>
            <span className="mono">{EXPERIENCES.length} postes</span>
          </div>
          <div className="col" style={{ gap: 8, overflow:'hidden' }}>
            {EXPERIENCES.map(e => (
              <div key={e.id} className="box" style={{ padding: 9 }}>
                <div className="row" style={{ justifyContent:'space-between' }}>
                  <span className="mono" style={{ color:'var(--gold)' }}>{e.period}</span>
                  <span className="chip chip-mini">{e.type}</span>
                </div>
                <div className="h2" style={{ fontSize: 13, marginTop: 4, letterSpacing:'0.04em' }}>{e.role}</div>
                <div className="mono" style={{ fontSize: 10, marginTop: 2 }}>{e.company} · {e.location}</div>
                <div className="row" style={{ gap: 4, marginTop: 6, flexWrap:'wrap' }}>
                  {e.stack.slice(0,4).map(s => <span key={s} className="chip chip-mini">{s}</span>)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* COL 2 — FORMATION */}
        <div className="col" style={{ gap: 10 }}>
          <div className="row" style={{ justifyContent:'space-between' }}>
            <h2 className="underline-sketch" style={{ fontSize:16 }}>II · Formation</h2>
            <span className="mono">unique</span>
          </div>
          <div className="box-blood" style={{ padding: 14, position:'relative' }}>
            <div className="kicker" style={{ marginBottom: 8 }}>{FORMATION.periode}</div>
            <div className="h2" style={{ fontSize: 16, marginBottom: 6, lineHeight: 1.2 }}>{FORMATION.diplome}</div>
            <div className="mono" style={{ fontSize: 10, marginBottom: 4 }}>{FORMATION.ecole}</div>
            <div className="mono" style={{ fontSize: 10, marginBottom: 10 }}>{FORMATION.ville} · {FORMATION.mention}</div>
            <div className="divider" style={{ marginBottom: 8 }}></div>
            {FORMATION.details.map((d,i) => (
              <div key={i} style={{ fontSize: 13, marginBottom: 4, color:'var(--ink-soft)' }}>· {d}</div>
            ))}
          </div>
          <div className="ph" style={{ height: 90, marginTop: 4 }}>logo école / sceau</div>
          <div className="note" style={{ fontSize: 16, transform:'rotate(-2deg)', marginTop: 6 }}>
            une seule formation = bloc unique, à valoriser
          </div>
        </div>

        {/* COL 3 — CERTIFICATIONS */}
        <div className="col" style={{ gap: 10 }}>
          <div className="row" style={{ justifyContent:'space-between' }}>
            <h2 className="underline-sketch" style={{ fontSize:16 }}>III · Certifications</h2>
            <span className="mono">{CERTIFICATIONS.length}</span>
          </div>
          <div className="row" style={{ gap: 4, flexWrap:'wrap', marginBottom: 4 }}>
            <span className="chip chip-mini chip-on">Toutes</span>
            {Object.entries(CERT_CAT).map(([k,v]) => (
              <span key={k} className="chip chip-mini">{v.glyph} {v.label}</span>
            ))}
          </div>
          <div className="col" style={{ gap: 5, overflow:'hidden' }}>
            {CERTIFICATIONS.map(c => (
              <div key={c.id} className="box-faint row" style={{ padding:'6px 9px', gap: 10, opacity: c.active ? 1 : 0.55 }}>
                <span className="glyph" style={{ width: 22, height: 22, fontSize: 11 }}>{CERT_CAT[c.cat].glyph}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, lineHeight: 1.2, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{c.title}</div>
                  <div className="mono" style={{ fontSize: 9 }}>{c.issuer}</div>
                </div>
                <span className="mono" style={{ fontSize: 10, color:'var(--gold)' }}>{c.year}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="annot" style={{ top: 60, left: '36%', maxWidth: 140 }}>
        <div>3 piliers, lecture<br/>parallèle ↔</div>
      </div>
      <div className="annot" style={{ bottom: 14, right: 24, transform:'rotate(2deg)', maxWidth: 160 }}>
        <div>colonne certifs scrolle<br/>indépendamment</div>
      </div>
    </div>
  );
}
window.PWF1Triptyque = PWF1Triptyque;
