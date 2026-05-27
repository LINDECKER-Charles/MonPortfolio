// PWF5 — Manuscrit : double-page reliée. Gauche = parcours pro chronologique, Droite = formation + certifs en blason
function PWF5Manuscrit() {
  return (
    <div className="wf" style={{ padding: 0 }}>
      {/* En-tête flottant */}
      <div style={{ padding:'24px 32px 14px', borderBottom:'1px dashed var(--ink-faint)' }}>
        <div className="spread">
          <div>
            <div className="kicker">Portfolio · v5 · Manuscrit (double-page)</div>
            <h1>Parcours</h1>
          </div>
          <div className="mono" style={{ fontSize: 11, maxWidth: 360, textAlign:'right' }}>
            Métaphore livre ouvert. Page gauche = récit du parcours pro,<br/>page droite = identité académique + sceaux gagnés.
          </div>
        </div>
      </div>

      {/* Double-page */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1px 1fr', height:'calc(100% - 100px)', position:'relative' }}>
        {/* PAGE GAUCHE — Expériences narratives */}
        <div style={{ padding: '20px 32px', overflow:'hidden' }}>
          <div className="row" style={{ justifyContent:'space-between', marginBottom: 12 }}>
            <h2 className="underline-sketch" style={{ fontSize: 16 }}>Chronique professionnelle</h2>
            <span className="mono" style={{ fontSize: 10 }}>fol. I — recto</span>
          </div>
          <div className="col" style={{ gap: 14 }}>
            {EXPERIENCES.slice(0,4).map((e,i) => (
              <div key={e.id} style={{ display:'grid', gridTemplateColumns:'60px 1fr', gap: 12 }}>
                <div style={{ textAlign:'right', borderRight:'1px solid var(--ink-faint)', paddingRight: 8 }}>
                  <div style={{ fontFamily:'var(--serif)', fontSize: 18, color:'var(--blood)', letterSpacing:'0.05em' }}>{e.start}</div>
                  <div className="mono" style={{ fontSize: 9, color:'var(--ink-faint)' }}>↓ {e.end}</div>
                </div>
                <div>
                  <div className="h2" style={{ fontSize: 14, letterSpacing:'0.03em' }}>{e.role}</div>
                  <div className="mono" style={{ fontSize: 10, marginBottom: 4 }}>{e.company} — {e.location} · {e.type}</div>
                  {e.bullets.slice(0,2).map((b,bi) => (
                    <div key={bi} style={{ fontSize: 12, color:'var(--ink-soft)', lineHeight: 1.35 }}>“ {b} ”</div>
                  ))}
                  <div className="row" style={{ gap: 4, marginTop: 5, flexWrap:'wrap' }}>
                    {e.stack.slice(0,4).map(s => <span key={s} className="chip chip-mini">{s}</span>)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Reliure */}
        <div style={{
          background:'repeating-linear-gradient(to bottom, var(--gold-dim) 0 4px, transparent 4px 10px)',
          width: 1, position:'relative'
        }}>
          {[80, 220, 360, 500, 640].map(y => (
            <div key={y} style={{ position:'absolute', left:-3, top: y, width: 7, height: 7, background:'var(--gold)', borderRadius:'50%', border:'1px solid var(--paper)' }}></div>
          ))}
        </div>

        {/* PAGE DROITE — Formation + Certifs */}
        <div style={{ padding: '20px 32px', overflow:'hidden' }}>
          <div className="row" style={{ justifyContent:'space-between', marginBottom: 12 }}>
            <h2 className="underline-sketch" style={{ fontSize: 16 }}>Formation & sceaux</h2>
            <span className="mono" style={{ fontSize: 10 }}>fol. I — verso</span>
          </div>

          {/* Formation — encart enluminé */}
          <div className="box-blood" style={{ padding: 12, marginBottom: 14, position:'relative' }}>
            <div style={{ position:'absolute', top:-8, left:-8, width: 16, height: 16, border:'1.5px solid var(--gold)', background:'var(--paper)' }}></div>
            <div style={{ position:'absolute', top:-8, right:-8, width: 16, height: 16, border:'1.5px solid var(--gold)', background:'var(--paper)' }}></div>
            <div className="kicker">{FORMATION.periode} · {FORMATION.mention}</div>
            <div className="h2" style={{ fontSize: 15, marginTop: 4, lineHeight: 1.2 }}>{FORMATION.diplome}</div>
            <div className="mono" style={{ fontSize: 10 }}>{FORMATION.ecole} · {FORMATION.ville}</div>
          </div>

          {/* Certifs — grille en blason */}
          <div className="row" style={{ justifyContent:'space-between', marginBottom: 8 }}>
            <h3>Sceaux obtenus · {CERTIFICATIONS.length}</h3>
            <div className="row" style={{ gap: 3 }}>
              {Object.entries(CERT_CAT).map(([k,v]) => (
                <span key={k} className="chip chip-mini" style={{ padding:'2px 5px', fontSize: 8 }}>{v.glyph}</span>
              ))}
            </div>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap: 6 }}>
            {CERTIFICATIONS.map(c => (
              <div key={c.id} className="box-faint" style={{
                padding: 8, textAlign:'center', position:'relative',
                opacity: c.active ? 1 : 0.5,
              }}>
                <div className="glyph" style={{ margin:'0 auto 4px', width: 28, height: 28, fontSize: 13, borderColor:'var(--gold-dim)', color:'var(--gold)' }}>
                  {CERT_CAT[c.cat].glyph}
                </div>
                <div style={{ fontSize: 9, lineHeight: 1.15, height: 24, overflow:'hidden' }}>
                  {c.title.split(' ').slice(0,3).join(' ')}…
                </div>
                <div className="mono" style={{ fontSize: 8, color:'var(--gold)', marginTop: 3 }}>{c.year}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="annot" style={{ top: 160, left: '46%', transform:'rotate(-4deg)', maxWidth: 110 }}>
        <div>reliure cousue<br/>= séparation forte</div>
      </div>
      <div className="annot" style={{ top: 280, left: 20, transform:'rotate(-2deg)', maxWidth: 130 }}>
        <div>citations entre<br/>guillemets = ton<br/>narratif</div>
      </div>
      <div className="annot" style={{ bottom: 30, right: 24, transform:'rotate(3deg)', maxWidth: 140 }}>
        <div>certifs petites cartes<br/>style "sceau"</div>
      </div>
    </div>
  );
}
window.PWF5Manuscrit = PWF5Manuscrit;
