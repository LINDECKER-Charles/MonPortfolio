// PWF2 — Spine : timeline centrale + formation insérée comme jalon + certifs en rail droit
function PWF2Spine() {
  return (
    <div className="wf">
      <div className="spread" style={{ marginBottom: 14 }}>
        <div>
          <div className="kicker">Portfolio · v2 · Spine chronologique</div>
          <h1>Parcours</h1>
          <div className="mono" style={{ marginTop:4, fontSize: 11, maxWidth: 500 }}>
            Une seule colonne vertébrale temporelle. Expérience et formation sur la spine, certifications en rail droit.
          </div>
        </div>
        <div className="row" style={{ gap: 8 }}>
          <span className="chip chip-mini chip-on">↑ récent</span>
          <span className="chip chip-mini">↓ ancien</span>
        </div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 280px', gap: 16, height:'calc(100% - 100px)' }}>
        {/* MAIN — Timeline */}
        <div style={{ position:'relative', paddingLeft: 40, overflow:'hidden' }}>
          <div style={{
            position:'absolute', left: 14, top: 0, bottom: 0, width: 2,
            background:'repeating-linear-gradient(to bottom, var(--gold-dim) 0 8px, transparent 8px 14px)'
          }}></div>

          {/* Année repère */}
          <div style={{ position:'absolute', left: -10, top: 0 }}>
            <div className="box-blood" style={{ padding:'2px 8px', fontFamily:'var(--serif)', fontSize: 12, letterSpacing:'0.18em', color:'var(--blood)' }}>2026</div>
          </div>

          <div className="col" style={{ gap: 10 }}>
            {EXPERIENCES.slice(0,3).map((e, i) => (
              <div key={e.id} style={{ position:'relative' }}>
                <div style={{ position:'absolute', left:-32, top: 14 }}>
                  <div className="dot dot-active" style={{ width: 12, height: 12, border:'2px solid var(--paper)' }}></div>
                </div>
                <div className="box-solid" style={{ padding: 10 }}>
                  <div className="row" style={{ justifyContent:'space-between' }}>
                    <span className="mono" style={{ color:'var(--gold)' }}>{e.period}</span>
                    <span className="chip chip-mini">{e.type}</span>
                  </div>
                  <div className="h2" style={{ fontSize: 14, marginTop: 4 }}>{e.role}</div>
                  <div className="mono" style={{ fontSize: 10 }}>{e.company} · {e.location}</div>
                  <div className="row" style={{ gap: 4, marginTop: 6, flexWrap:'wrap' }}>
                    {e.stack.map(s => <span key={s} className="chip chip-mini">{s}</span>)}
                  </div>
                </div>
              </div>
            ))}

            {/* Jalon FORMATION inséré dans la timeline */}
            <div style={{ position:'relative' }}>
              <div style={{ position:'absolute', left:-32, top: 14 }}>
                <div className="dot" style={{ width: 14, height: 14, background:'var(--gold)', border:'2px solid var(--paper)', borderRadius: 0, transform:'rotate(45deg)' }}></div>
              </div>
              <div className="box-blood" style={{ padding: 12, borderColor:'var(--gold-dim)' }}>
                <div className="kicker">{FORMATION.periode} · Formation</div>
                <div className="h2" style={{ fontSize: 14, marginTop: 4, color:'var(--gold)' }}>{FORMATION.diplome}</div>
                <div className="mono" style={{ fontSize: 10 }}>{FORMATION.ecole} · {FORMATION.mention}</div>
              </div>
            </div>

            {EXPERIENCES.slice(3).map(e => (
              <div key={e.id} style={{ position:'relative' }}>
                <div style={{ position:'absolute', left:-32, top: 14 }}>
                  <div className="dot dot-archived" style={{ width: 12, height: 12, border:'2px solid var(--paper)' }}></div>
                </div>
                <div className="box" style={{ padding: 10 }}>
                  <div className="row" style={{ justifyContent:'space-between' }}>
                    <span className="mono" style={{ color:'var(--ink-soft)' }}>{e.period}</span>
                    <span className="chip chip-mini">{e.type}</span>
                  </div>
                  <div className="h2" style={{ fontSize: 13, marginTop: 4 }}>{e.role}</div>
                  <div className="mono" style={{ fontSize: 10 }}>{e.company}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RAIL — Certifications */}
        <div className="col" style={{ gap: 8, overflow:'hidden' }}>
          <div className="row" style={{ justifyContent:'space-between' }}>
            <h3>Certifications</h3>
            <span className="mono">{CERTIFICATIONS.length}</span>
          </div>
          <div className="divider"></div>
          <div className="col" style={{ gap: 5 }}>
            {CERTIFICATIONS.map(c => (
              <div key={c.id} className="row" style={{ padding:'5px 0', gap: 8, borderBottom:'1px dashed var(--ink-faint)', opacity: c.active ? 1 : 0.5 }}>
                <span className="mono" style={{ fontSize: 10, color:'var(--gold)', width: 28 }}>{c.year}</span>
                <span className="glyph" style={{ width: 18, height: 18, fontSize: 9 }}>{CERT_CAT[c.cat].glyph}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 11, lineHeight: 1.15, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{c.title}</div>
                  <div className="mono" style={{ fontSize: 8 }}>{c.issuer}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="annot" style={{ top: 130, left: '34%', transform:'rotate(-3deg)', maxWidth: 150 }}>
        <div>la formation = jalon<br/>doré dans la spine</div>
      </div>
      <div className="annot" style={{ top: 110, right: 16, transform:'rotate(3deg)', maxWidth: 140 }}>
        <div>rail certif compact,<br/>1 ligne = 1 certif</div>
      </div>
    </div>
  );
}
window.PWF2Spine = PWF2Spine;
