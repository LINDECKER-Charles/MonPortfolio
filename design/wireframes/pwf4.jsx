// PWF4 — Strates : 3 bandes empilées plein écran, scroll vertical
function PWF4Strates() {
  return (
    <div className="wf" style={{ overflow:'auto', padding: '24px 32px' }}>
      <div style={{ marginBottom: 18 }}>
        <div className="kicker">Portfolio · v4 · Strates verticales</div>
        <h1>Parcours</h1>
        <div className="mono" style={{ marginTop:4, fontSize: 11, maxWidth: 540 }}>
          Trois strates plein-largeur, scroll continu. Chaque strate a son propre rythme : timeline, fiche, grille.
        </div>
      </div>

      {/* STRATE I — Expériences en frise horizontale */}
      <div style={{ marginBottom: 22 }}>
        <div className="row" style={{ justifyContent:'space-between', marginBottom: 10 }}>
          <div className="row" style={{ gap: 10 }}>
            <span style={{ fontFamily:'var(--serif)', fontSize: 22, color:'var(--blood)' }}>I.</span>
            <h2 className="underline-sketch">Expériences</h2>
          </div>
          <span className="mono">frise horizontale · 2019 → 2026</span>
        </div>
        <div style={{ position:'relative', padding:'18px 0 12px' }}>
          <div style={{ position:'absolute', left: 0, right: 0, top: '50%', height: 2,
            background:'repeating-linear-gradient(to right, var(--gold-dim) 0 8px, transparent 8px 14px)' }}></div>
          <div style={{ display:'grid', gridTemplateColumns:`repeat(${EXPERIENCES.length}, 1fr)`, gap: 8 }}>
            {EXPERIENCES.map((e, i) => (
              <div key={e.id} style={{ position:'relative', display:'flex', flexDirection:'column', alignItems:'center', gap: 8 }}>
                <div className="box-solid" style={{ padding: 8, width:'100%' }}>
                  <div className="mono" style={{ color:'var(--gold)', fontSize: 9 }}>{e.start}—{e.end}</div>
                  <div style={{ fontSize: 11, fontWeight: 700, marginTop: 2, lineHeight: 1.2 }}>{e.role}</div>
                  <div className="mono" style={{ fontSize: 9, marginTop: 2 }}>{e.company}</div>
                </div>
                <div className="dot dot-active" style={{ width: 12, height: 12, border:'2px solid var(--paper)' }}></div>
                <div className="row" style={{ gap: 3, flexWrap:'wrap', justifyContent:'center' }}>
                  {e.stack.slice(0,2).map(s => <span key={s} className="chip chip-mini" style={{ fontSize: 8 }}>{s}</span>)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* STRATE II — Formation, bande unique mise en valeur */}
      <div style={{ marginBottom: 22 }}>
        <div className="row" style={{ justifyContent:'space-between', marginBottom: 10 }}>
          <div className="row" style={{ gap: 10 }}>
            <span style={{ fontFamily:'var(--serif)', fontSize: 22, color:'var(--blood)' }}>II.</span>
            <h2 className="underline-sketch">Formation</h2>
          </div>
          <span className="mono">unique — bloc valorisé</span>
        </div>
        <div className="box-blood" style={{ padding: 18, display:'grid', gridTemplateColumns:'120px 1fr auto', gap: 18, alignItems:'center' }}>
          <div className="ph" style={{ height: 100, fontSize: 9 }}>sceau<br/>école</div>
          <div>
            <div className="kicker" style={{ marginBottom: 4 }}>{FORMATION.periode} · {FORMATION.mention}</div>
            <div className="h1" style={{ fontSize: 22, marginBottom: 6 }}>{FORMATION.diplome}</div>
            <div className="mono" style={{ fontSize: 11 }}>{FORMATION.ecole} · {FORMATION.ville}</div>
            <div style={{ marginTop: 8 }}>
              {FORMATION.details.map((d,i) => (
                <div key={i} style={{ fontSize: 13, color:'var(--ink-soft)' }}>· {d}</div>
              ))}
            </div>
          </div>
          <div className="col" style={{ gap: 6, alignItems:'flex-end' }}>
            <span className="chip chip-blood">Bac+5</span>
            <span className="chip">Master</span>
          </div>
        </div>
      </div>

      {/* STRATE III — Certifications grille */}
      <div>
        <div className="row" style={{ justifyContent:'space-between', marginBottom: 10 }}>
          <div className="row" style={{ gap: 10 }}>
            <span style={{ fontFamily:'var(--serif)', fontSize: 22, color:'var(--blood)' }}>III.</span>
            <h2 className="underline-sketch">Certifications</h2>
          </div>
          <div className="row" style={{ gap: 4 }}>
            <span className="chip chip-mini chip-on">Toutes ({CERTIFICATIONS.length})</span>
            {Object.entries(CERT_CAT).slice(0,4).map(([k,v]) => (
              <span key={k} className="chip chip-mini">{v.glyph} {v.label}</span>
            ))}
            <span className="chip chip-mini">+3</span>
          </div>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap: 8 }}>
          {CERTIFICATIONS.map(c => (
            <div key={c.id} className="box" style={{ padding: 10, display:'flex', gap: 10, opacity: c.active ? 1 : 0.55 }}>
              <span className="glyph" style={{ flexShrink: 0 }}>{CERT_CAT[c.cat].glyph}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, lineHeight: 1.2 }}>{c.title}</div>
                <div className="row" style={{ justifyContent:'space-between', marginTop: 4 }}>
                  <span className="mono" style={{ fontSize: 9 }}>{c.issuer}</span>
                  <span className="mono" style={{ fontSize: 9, color:'var(--gold)' }}>{c.year}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="annot" style={{ top: 100, right: 30, transform:'rotate(-3deg)', maxWidth: 140 }}>
        <div>frise horiz = vue<br/>compacte de toute<br/>la carrière</div>
      </div>
      <div className="annot" style={{ top: 400, right: 30, transform:'rotate(2deg)', maxWidth: 140 }}>
        <div>bande Formation<br/>= moment fort</div>
      </div>
    </div>
  );
}
window.PWF4Strates = PWF4Strates;
