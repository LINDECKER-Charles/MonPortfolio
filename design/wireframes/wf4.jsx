// WF4 — Chronique : timeline verticale (gauche/droite) avec marqueurs d'année
function WF4Chronique() {
  const byYear = {};
  PROJECTS.forEach(p => { (byYear[p.year] = byYear[p.year] || []).push(p); });
  const years = Object.keys(byYear).sort((a,b) => b.localeCompare(a));

  const Node = ({ p, side }) => {
    const t = TYPE_META[p.type];
    const s = STATUS_META[p.status];
    return (
      <div style={{ display:'flex', flexDirection: side==='right' ? 'row' : 'row-reverse', alignItems:'center', gap: 14, width:'100%' }}>
        <div className="box-solid" style={{ flex: 1, padding: 10, display:'flex', gap: 10 }}>
          <div className="ph" style={{ width: 70, height: 50, fontSize: 8, flexShrink: 0 }}>img</div>
          <div style={{ flex: 1 }}>
            <div className="row" style={{ justifyContent:'space-between' }}>
              <div className="row" style={{ gap: 6 }}>
                <span style={{ color:'var(--gold)', fontFamily:'var(--serif)' }}>{t.glyph}</span>
                <span className="h2" style={{ fontSize: 13, letterSpacing:'0.04em' }}>{p.title}</span>
              </div>
              <span className={`dot ${s.dot}`}></span>
            </div>
            <div className="mono" style={{ fontSize: 9, marginTop: 2 }}>{t.label} · {p.role}</div>
            <div className="row" style={{ gap: 4, marginTop: 5, flexWrap:'wrap' }}>
              {p.stack.slice(0,3).map(st => <span key={st} className="chip chip-mini">{st}</span>)}
            </div>
          </div>
        </div>
        {/* connecteur */}
        <div style={{ width: 40, display:'flex', alignItems:'center' }}>
          <div style={{
            flex: 1, height: 1,
            background: 'repeating-linear-gradient(to right, var(--ink-faint) 0 4px, transparent 4px 8px)'
          }}></div>
          <div className="dot dot-active" style={{ marginLeft: -3, width: 10, height: 10, border:'2px solid var(--paper)' }}></div>
        </div>
      </div>
    );
  };

  return (
    <div className="wf">
      <div className="spread" style={{ marginBottom: 14 }}>
        <div>
          <div className="kicker">Portfolio · v4 · Chronique</div>
          <h1>Projets</h1>
          <div className="mono" style={{ marginTop:4, fontSize: 11, maxWidth: 460 }}>
            Lecture chronologique. L'évolution se raconte d'elle-même.
          </div>
        </div>
        <div className="row" style={{ gap: 8 }}>
          <div className="search" style={{ width: 220 }}><span>⌕</span><span>chercher…</span></div>
          <span className="chip chip-mini chip-on">↑ récent</span>
          <span className="chip chip-mini">↓ ancien</span>
        </div>
      </div>

      {/* Filtre type compact */}
      <div className="row" style={{ gap: 6, flexWrap:'wrap', marginBottom: 14 }}>
        <span className="h3" style={{ fontSize: 10 }}>Filtrer :</span>
        <span className="chip chip-mini chip-on">Tous</span>
        {Object.entries(TYPE_META).map(([k,v]) => (
          <span key={k} className="chip chip-mini">{v.glyph} {v.plural}</span>
        ))}
      </div>

      <div style={{ position:'relative' }}>
        {/* Spine centrale */}
        <div style={{
          position:'absolute', left:'50%', top: 0, bottom: 0, width: 2, transform: 'translateX(-50%)',
          background: 'repeating-linear-gradient(to bottom, var(--gold-dim) 0 8px, transparent 8px 14px)'
        }}></div>

        {years.map((y, yi) => (
          <div key={y} style={{ marginBottom: 18 }}>
            {/* Year marker */}
            <div style={{ display:'flex', justifyContent:'center', marginBottom: 10 }}>
              <div className="box-blood" style={{ padding:'4px 16px', fontFamily:'var(--serif)', fontSize: 18, letterSpacing:'0.18em', color:'var(--blood)' }}>
                {y}
              </div>
            </div>

            <div className="col" style={{ gap: 10 }}>
              {byYear[y].map((p, i) => {
                const side = i % 2 === 0 ? 'right' : 'left';
                return (
                  <div key={p.id} style={{ display:'grid', gridTemplateColumns: '1fr 1fr', gap: 0 }}>
                    {side==='right' ? (
                      <>
                        <div></div>
                        <Node p={p} side="right" />
                      </>
                    ) : (
                      <>
                        <Node p={p} side="left" />
                        <div></div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="annot" style={{ top: 30, right: 250, transform:'rotate(-3deg)', maxWidth: 150 }}>
        <div>la spine = ta carrière<br/>↓ se lit comme un récit</div>
      </div>
      <div className="annot" style={{ top: 240, left: 8, transform:'rotate(-4deg)', maxWidth: 130 }}>
        <div>alternance G/D<br/>= équilibre visuel</div>
      </div>
      <div className="annot" style={{ bottom: 30, right: 16, transform:'rotate(3deg)', maxWidth: 150 }}>
        <div>filtrer cache des<br/>nœuds mais garde<br/>la spine intacte</div>
      </div>
    </div>
  );
}

window.WF4Chronique = WF4Chronique;
