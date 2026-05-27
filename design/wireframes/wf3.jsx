// WF3 — Codex : sidebar filtres + liste dense en colonnes
function WF3Codex() {
  return (
    <div className="wf" style={{ padding: 28 }}>
      <div className="spread" style={{ marginBottom: 14 }}>
        <div>
          <div className="kicker">Portfolio · v3 · Codex</div>
          <h1 style={{ fontSize: 32 }}>Projets</h1>
        </div>
        <div className="row" style={{ gap: 8 }}>
          <div className="search" style={{ width: 240 }}><span>⌕</span><span>chercher…</span></div>
          <span className="chip chip-mini chip-on">≣ liste</span>
          <span className="chip chip-mini">▦ grille</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 18 }}>

        {/* SIDEBAR */}
        <div className="box" style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 14, alignSelf:'flex-start' }}>
          <div>
            <div className="h3 underline-sketch" style={{ marginBottom: 8 }}>Type</div>
            <div className="col" style={{ gap: 4 }}>
              {[
                {l:'Tous', c: PROJECTS.length, on:true},
                ...Object.entries(TYPE_META).map(([k,v]) => ({
                  l: v.plural, c: PROJECTS.filter(p=>p.type===k).length, on:false, g: v.glyph
                }))
              ].map((r,i) => (
                <div key={i} className="row" style={{ justifyContent:'space-between', padding:'4px 0', borderBottom: '1px dotted var(--ink-faint)' }}>
                  <span className="row" style={{ gap: 6 }}>
                    {r.g && <span style={{ color: r.on ? 'var(--blood)' : 'var(--ink-soft)', fontFamily:'var(--serif)' }}>{r.g}</span>}
                    <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: r.on?'var(--blood)':'var(--ink)', letterSpacing:'0.06em' }}>
                      {r.l}
                    </span>
                  </span>
                  <span className="mono" style={{ fontSize: 9, color: 'var(--ink-soft)' }}>{r.c}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="h3 underline-sketch" style={{ marginBottom: 8 }}>Statut</div>
            <div className="col" style={{ gap: 5 }}>
              {Object.entries(STATUS_META).map(([k,v]) => (
                <label key={k} className="row" style={{ gap: 8, fontFamily:'var(--mono)', fontSize: 10 }}>
                  <span className="box-faint" style={{ width:12, height:12, display:'inline-flex', alignItems:'center', justifyContent:'center', fontSize:9, color:'var(--blood)' }}>{k==='active'?'✓':''}</span>
                  <span className={`dot ${v.dot}`}></span>
                  {v.label}
                </label>
              ))}
            </div>
          </div>

          <div>
            <div className="h3 underline-sketch" style={{ marginBottom: 8 }}>Année</div>
            <div className="row" style={{ gap: 4, flexWrap:'wrap' }}>
              {['2026','2025','2024','2023','2022'].map(y => (
                <span key={y} className={`chip chip-mini ${y==='2024'?'chip-on':''}`}>{y}</span>
              ))}
            </div>
          </div>

          <div>
            <div className="h3 underline-sketch" style={{ marginBottom: 8 }}>Stack</div>
            <div className="row" style={{ gap: 4, flexWrap:'wrap' }}>
              {ALL_STACKS.slice(0, 10).map(s => (
                <span key={s} className="chip chip-mini" style={{ borderColor:'var(--ink-faint)' }}>{s}</span>
              ))}
              <span className="mono" style={{ fontSize: 9 }}>+5</span>
            </div>
          </div>

          <div className="box-blood" style={{ padding: 8, fontFamily: 'var(--hand)', fontSize: 15, color: 'var(--blood)' }}>
            ↳ filtres combinables<br/><span style={{ fontSize: 11, color: 'var(--ink-soft)', fontFamily:'var(--mono)' }}>15 résultats</span>
          </div>
        </div>

        {/* LIST */}
        <div>
          {/* header de table */}
          <div className="row" style={{ padding:'6px 12px', gap: 12, color:'var(--ink-soft)' }}>
            <div style={{ width: 60 }} className="mono">VISUEL</div>
            <div style={{ flex: 1.4 }} className="mono">PROJET</div>
            <div style={{ flex: 1 }} className="mono">STACK</div>
            <div style={{ width: 90 }} className="mono">STATUT</div>
            <div style={{ width: 50 }} className="mono">ANNÉE</div>
            <div style={{ width: 70 }} className="mono">LIENS</div>
          </div>
          <div className="divider" style={{ marginBottom: 4 }}></div>

          {PROJECTS.slice(0, 11).map((p, i) => {
            const t = TYPE_META[p.type];
            const s = STATUS_META[p.status];
            return (
              <div key={p.id} className="row" style={{
                padding: '8px 12px', gap: 12, borderBottom: '1px dotted var(--ink-faint)',
                background: i===0 ? 'rgba(194,54,62,0.04)' : 'transparent'
              }}>
                <div className="ph" style={{ width: 60, height: 36, fontSize: 8 }}>img</div>
                <div style={{ flex: 1.4 }}>
                  <div className="row" style={{ gap: 6 }}>
                    <span style={{ color:'var(--gold)', fontFamily:'var(--serif)' }}>{t.glyph}</span>
                    <span className="h2" style={{ fontSize: 13, letterSpacing:'0.04em' }}>{p.title}</span>
                    {i===0 && <span className="chip chip-mini chip-blood">PILIER</span>}
                  </div>
                  <div className="mono" style={{ fontSize: 9, marginTop: 2 }}>{t.label} · {p.role} · #{p.tags.join(' #')}</div>
                </div>
                <div style={{ flex: 1 }} className="row" style={{ gap: 4, flexWrap:'wrap' }}>
                  {p.stack.slice(0,3).map(st => <span key={st} className="chip chip-mini">{st}</span>)}
                </div>
                <div style={{ width: 90 }} className="row">
                  <span className={`dot ${s.dot}`}></span>
                  <span className="mono" style={{ fontSize: 10, marginLeft: 6 }}>{s.label}</span>
                </div>
                <div style={{ width: 50 }} className="mono">{p.year}</div>
                <div style={{ width: 70 }} className="row" style={{ gap: 8 }}>
                  <span className="mono" style={{ fontSize: 10 }}>↗</span>
                  <span className="mono" style={{ fontSize: 10 }}>⌥</span>
                  <span className="mono" style={{ fontSize: 10 }}>▶</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="annot" style={{ top: 130, left: 240, transform:'rotate(-3deg)', maxWidth: 130 }}>
        <div>filtres riches,<br/>tj visibles ↘</div>
      </div>
      <div className="annot" style={{ top: 110, right: 30, transform:'rotate(2deg)', maxWidth: 160 }}>
        <div>vue dense :<br/>15 projets en 1 page</div>
      </div>
      <div className="annot" style={{ bottom: 30, right: 60, transform:'rotate(-2deg)', maxWidth: 140 }}>
        <div>hover ligne = preview<br/>en flottant à droite</div>
      </div>
    </div>
  );
}

window.WF3Codex = WF3Codex;
