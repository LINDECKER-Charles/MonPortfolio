// PWF3 — Codex : onglets pour basculer entre 3 sections
function PWF3Codex() {
  return (
    <div className="wf">
      <div style={{ marginBottom: 14 }}>
        <div className="kicker">Portfolio · v3 · Codex à onglets</div>
        <h1>Parcours</h1>
        <div className="mono" style={{ marginTop:4, fontSize: 11, maxWidth: 480 }}>
          Trois onglets, une seule vue à la fois. Section active = plein écran. Idéal pour densité par section.
        </div>
      </div>

      {/* Onglets */}
      <div className="row" style={{ gap: 0, marginBottom: 0, borderBottom:'1.5px solid var(--ink-soft)' }}>
        <div className="box-solid" style={{ padding:'10px 22px', borderBottom:'none', borderColor:'var(--ink)', background:'var(--paper-3)', cursor:'pointer' }}>
          <div className="row" style={{ gap: 8 }}>
            <span style={{ fontFamily:'var(--serif)', color:'var(--blood)' }}>I</span>
            <span className="h2" style={{ fontSize: 13 }}>Expérience</span>
            <span className="chip chip-mini" style={{ background:'var(--blood)', color:'var(--ink)', borderColor:'var(--blood)' }}>{EXPERIENCES.length}</span>
          </div>
        </div>
        <div style={{ padding:'10px 22px', cursor:'pointer', opacity: 0.6 }}>
          <div className="row" style={{ gap: 8 }}>
            <span style={{ fontFamily:'var(--serif)', color:'var(--gold)' }}>II</span>
            <span className="h2" style={{ fontSize: 13 }}>Formation</span>
            <span className="chip chip-mini">1</span>
          </div>
        </div>
        <div style={{ padding:'10px 22px', cursor:'pointer', opacity: 0.6 }}>
          <div className="row" style={{ gap: 8 }}>
            <span style={{ fontFamily:'var(--serif)', color:'var(--gold)' }}>III</span>
            <span className="h2" style={{ fontSize: 13 }}>Certifications</span>
            <span className="chip chip-mini">{CERTIFICATIONS.length}</span>
          </div>
        </div>
        <div style={{ flex: 1 }}></div>
        <div className="row" style={{ gap: 6, paddingBottom: 8 }}>
          <div className="search" style={{ width: 180, padding:'4px 10px' }}><span>⌕</span><span>chercher…</span></div>
        </div>
      </div>

      {/* Panneau actif = Expérience (détaillé) */}
      <div className="box-faint" style={{ padding: 18, marginTop: 0, borderTop: 'none', height: 'calc(100% - 170px)', overflow:'hidden' }}>
        <div style={{ display:'grid', gridTemplateColumns:'120px 1fr', gap: 16 }}>
          {/* mini-nav latérale d'années */}
          <div className="col" style={{ gap: 4 }}>
            <div className="h3" style={{ marginBottom: 6 }}>Années</div>
            {['2024+','2022','2021','2020','2019'].map((y,i) => (
              <div key={y} className={`row chip chip-mini ${i===0?'chip-on':''}`} style={{ padding:'5px 9px', justifyContent:'space-between' }}>
                <span>{y}</span><span style={{ opacity:0.6 }}>›</span>
              </div>
            ))}
            <div className="divider" style={{ marginTop: 10 }}></div>
            <div className="mono" style={{ fontSize: 9, marginTop: 6 }}>~5 ans XP</div>
            <div className="mono" style={{ fontSize: 9 }}>4 entreprises</div>
          </div>

          {/* contenu — cartes étendues */}
          <div className="col" style={{ gap: 12, overflow:'hidden' }}>
            {EXPERIENCES.slice(0,3).map(e => (
              <div key={e.id} className="box-solid" style={{ padding: 14, display:'grid', gridTemplateColumns:'auto 1fr auto', gap: 14, alignItems:'start' }}>
                <div style={{ textAlign:'center' }}>
                  <div className="mono" style={{ color:'var(--gold)', fontSize: 10 }}>{e.start}</div>
                  <div style={{ width: 1, height: 30, background:'var(--ink-faint)', margin:'4px auto' }}></div>
                  <div className="mono" style={{ color:'var(--ink-soft)', fontSize: 10 }}>{e.end}</div>
                </div>
                <div>
                  <div className="row" style={{ gap: 8 }}>
                    <span className="h2" style={{ fontSize: 16 }}>{e.role}</span>
                    <span className="chip chip-mini chip-blood">{e.type}</span>
                  </div>
                  <div className="mono" style={{ fontSize: 11, marginTop: 3 }}>{e.company} · {e.location}</div>
                  <ul style={{ margin:'8px 0 0 0', padding:'0 0 0 14px', fontSize: 12, color:'var(--ink-soft)', lineHeight: 1.4 }}>
                    {e.bullets.map((b,i) => <li key={i} style={{ marginBottom: 2 }}>{b}</li>)}
                  </ul>
                  <div className="row" style={{ gap: 4, marginTop: 8, flexWrap:'wrap' }}>
                    {e.stack.map(s => <span key={s} className="chip chip-mini">{s}</span>)}
                  </div>
                </div>
                <div className="ph" style={{ width: 70, height: 70, fontSize: 8 }}>logo</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="annot" style={{ top: 150, right: 24, transform:'rotate(-3deg)', maxWidth: 150 }}>
        <div>onglets = sections<br/>autonomes, dense</div>
      </div>
      <div className="annot" style={{ bottom: 28, left: 130, transform:'rotate(-2deg)', maxWidth: 140 }}>
        <div>cartes XP détaillées<br/>avec bullets visibles</div>
      </div>
    </div>
  );
}
window.PWF3Codex = PWF3Codex;
