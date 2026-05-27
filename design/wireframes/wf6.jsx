// WF6 — Atlas : carte/constellation, projets disposés en clusters par type
function WF6Atlas() {
  // positions fixes pour le visuel (en %)
  const NODES = [
    { id:'omnicard',   x: 22, y: 30, type:'app' },
    { id:'hexcalibur', x: 14, y: 50, type:'app' },
    { id:'moonlit',    x: 28, y: 18, type:'app' },
    { id:'coven',      x: 30, y: 50, type:'app' },

    { id:'penumbra',   x: 60, y: 18, type:'cli' },
    { id:'watchman',   x: 72, y: 28, type:'cli' },
    { id:'pyre',       x: 66, y: 40, type:'cli' },

    { id:'vellum',     x: 85, y: 50, type:'lib' },
    { id:'specter',    x: 88, y: 65, type:'lib' },
    { id:'crypt',      x: 78, y: 60, type:'lib' },

    { id:'lantern',    x: 48, y: 70, type:'oss' },
    { id:'wraith',     x: 58, y: 78, type:'oss' },
    { id:'sable',      x: 42, y: 80, type:'oss' },

    { id:'reliquary',  x: 18, y: 78, type:'xp' },
    { id:'tomb',       x: 8,  y: 68, type:'xp' },
  ];
  const EDGES = [
    ['omnicard','hexcalibur'], ['omnicard','coven'],          // shared: React/Vue/Svelte (frontend)
    ['penumbra','watchman'], ['pyre','watchman'],             // CLI
    ['vellum','wraith'], ['vellum','sable'],                  // TS
    ['lantern','sable'],                                      // SSR/SSG
    ['reliquary','tomb'],                                     // WebGL
    ['hexcalibur','crypt'], ['omnicard','vellum'],            // cross-type
  ];

  const byId = Object.fromEntries(PROJECTS.map(p => [p.id, p]));
  const COLORS = {
    app: 'var(--blood)',
    cli: 'var(--gold)',
    lib: '#c8b890',
    oss: '#7a8b6a',
    xp:  '#8a7aa8',
  };

  const selected = byId['omnicard'];
  const tSel = TYPE_META[selected.type];

  return (
    <div className="wf">
      <div className="spread" style={{ marginBottom: 12 }}>
        <div>
          <div className="kicker">Portfolio · v6 · Atlas</div>
          <h1>Projets</h1>
          <div className="mono" style={{ marginTop: 4, fontSize: 11, maxWidth: 420 }}>
            Carte visuelle. Clusters par type, traits = stack partagée.
          </div>
        </div>
        <div className="row" style={{ gap: 8 }}>
          <div className="search" style={{ width: 220 }}><span>⌕</span><span>chercher (illumine)…</span></div>
          <span className="chip chip-mini chip-on">⊕ zoom</span>
          <span className="chip chip-mini">⊖</span>
          <span className="chip chip-mini">↻</span>
        </div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 280px', gap: 16 }}>
        {/* LA CARTE */}
        <div className="box" style={{ position:'relative', height: 560, padding: 0, overflow:'hidden' }}>
          {/* fond étoilé */}
          <svg width="100%" height="100%" style={{ position:'absolute', inset:0 }}>
            <defs>
              <pattern id="stars" width="40" height="40" patternUnits="userSpaceOnUse">
                <circle cx="5" cy="8"   r="0.5" fill="rgba(216,203,168,0.25)"/>
                <circle cx="22" cy="30" r="0.4" fill="rgba(216,203,168,0.18)"/>
                <circle cx="34" cy="15" r="0.3" fill="rgba(216,203,168,0.12)"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#stars)"/>

            {/* edges */}
            {EDGES.map(([a,b], i) => {
              const A = NODES.find(n=>n.id===a);
              const B = NODES.find(n=>n.id===b);
              if (!A||!B) return null;
              return <line key={i} x1={`${A.x}%`} y1={`${A.y}%`} x2={`${B.x}%`} y2={`${B.y}%`}
                stroke="var(--ink-faint)" strokeWidth="1" strokeDasharray="3 3" opacity="0.55"/>;
            })}
          </svg>

          {/* zones de clusters */}
          {[
            { x:'18%', y:'32%', label:'Tomes Majeurs',   sub:'apps',  c: COLORS.app },
            { x:'66%', y:'24%', label:'Outils du Chasseur', sub:'cli',  c: COLORS.cli },
            { x:'83%', y:'58%', label:'Reliques',         sub:'libs',  c: COLORS.lib },
            { x:'50%', y:'78%', label:'Pactes',           sub:'OSS',   c: COLORS.oss },
            { x:'12%', y:'76%', label:'Rêveries',         sub:'xp',    c: COLORS.xp },
          ].map((cl, i) => (
            <div key={i} style={{
              position:'absolute', left: cl.x, top: cl.y, transform:'translate(-50%, -50%)',
              fontFamily:'var(--serif)', fontSize: 11, letterSpacing:'0.22em', textTransform:'uppercase',
              color: cl.c, pointerEvents:'none', textAlign:'center', opacity: 0.55
            }}>
              <div style={{ width: 160, height: 110, border:`1px dotted ${cl.c}`, borderRadius:'50%', position:'absolute', left:'50%', top:'50%', transform:'translate(-50%, -50%)', opacity: 0.4 }}></div>
              <div>{cl.label}</div>
              <div className="mono" style={{ fontSize: 9, marginTop: 2, opacity: 0.7 }}>· {cl.sub} ·</div>
            </div>
          ))}

          {/* nodes */}
          {NODES.map(n => {
            const p = byId[n.id];
            const isSel = n.id === selected.id;
            const c = COLORS[n.type];
            return (
              <div key={n.id} style={{
                position:'absolute', left: `${n.x}%`, top: `${n.y}%`, transform:'translate(-50%, -50%)',
                textAlign: 'center'
              }}>
                <div style={{
                  width: isSel ? 16 : 10, height: isSel ? 16 : 10, borderRadius: '50%',
                  background: c, margin:'0 auto',
                  boxShadow: isSel ? `0 0 14px ${c}` : `0 0 4px ${c}`,
                  border: isSel ? '2px solid var(--ink)' : 'none'
                }}></div>
                <div className="mono" style={{ fontSize: 9, marginTop: 4, color: isSel?'var(--ink)':'var(--ink-soft)', letterSpacing:'0.06em' }}>
                  {p.title}
                </div>
              </div>
            );
          })}

          {/* mini-map (corner) */}
          <div style={{ position:'absolute', bottom: 10, right: 10, width: 90, height: 60, border:'1px dashed var(--ink-faint)', background:'rgba(20,16,12,0.7)' }}>
            <div className="mono" style={{ fontSize: 8, padding: 2, color:'var(--ink-soft)' }}>MINI-MAP</div>
          </div>

          {/* légende */}
          <div style={{ position:'absolute', top: 10, left: 10, padding: 8, background:'rgba(20,16,12,0.75)', border:'1px dashed var(--ink-faint)' }}>
            <div className="h3" style={{ fontSize: 9, marginBottom: 4 }}>Légende</div>
            {Object.entries(TYPE_META).map(([k,v]) => (
              <div key={k} className="row" style={{ gap: 6, fontFamily:'var(--mono)', fontSize: 10 }}>
                <span className="dot" style={{ background: COLORS[k] }}></span>{v.plural}
              </div>
            ))}
          </div>
        </div>

        {/* PANEL DROITE — détail node sélectionnée */}
        <div className="box-solid" style={{ padding: 14, display:'flex', flexDirection:'column', gap: 10 }}>
          <div className="kicker">Sélection</div>
          <div className="ph" style={{ height: 130 }}>visuel</div>
          <div className="row" style={{ gap: 8, alignItems:'baseline' }}>
            <span style={{ color:'var(--blood)', fontFamily:'var(--serif)', fontSize: 16 }}>{tSel.glyph}</span>
            <div className="h1" style={{ fontSize: 22 }}>{selected.title}</div>
          </div>
          <div className="mono" style={{ fontSize: 10 }}>{tSel.label} · {selected.year} · {selected.role}</div>
          <div className="row"><span className={`dot ${STATUS_META[selected.status].dot}`}></span><span className="mono" style={{ marginLeft: 6, fontSize: 10 }}>{STATUS_META[selected.status].label}</span></div>
          <div className="row" style={{ gap: 4, flexWrap:'wrap' }}>
            {selected.stack.map(s => <span key={s} className="chip chip-mini">{s}</span>)}
          </div>
          <div className="mono" style={{ fontSize: 10, lineHeight: 1.4, color:'var(--ink-soft)' }}>
            Description courte du projet, deux lignes. Le clic ouvre la fiche complète.
          </div>
          <div className="divider"></div>
          <div className="row" style={{ gap: 6, flexWrap:'wrap' }}>
            <span className="chip chip-blood chip-on">↗ Démo</span>
            <span className="chip">↗ Code</span>
          </div>
          <div className="divider"></div>
          <div>
            <div className="h3" style={{ fontSize: 9, marginBottom: 5 }}>Liens (stack partagée)</div>
            <div className="col" style={{ gap: 3 }}>
              <span className="mono" style={{ fontSize: 10 }}>→ Hexcalibur</span>
              <span className="mono" style={{ fontSize: 10 }}>→ Vellum</span>
              <span className="mono" style={{ fontSize: 10 }}>→ Coven</span>
            </div>
          </div>
        </div>
      </div>

      <div className="annot" style={{ top: 130, left: 14, transform:'rotate(-3deg)', maxWidth: 140 }}>
        <div>les types sont des<br/>constellations<br/>visuellement séparées ↘</div>
      </div>
      <div className="annot" style={{ top: 360, left: 40, transform:'rotate(2deg)', maxWidth: 160 }}>
        <div>traits = stack<br/>partagée → ton ADN<br/>technique apparaît</div>
      </div>
      <div className="annot" style={{ bottom: 100, right: 18, transform:'rotate(-2deg)', maxWidth: 130 }}>
        <div>panel détail<br/>en sticky ↑</div>
      </div>
    </div>
  );
}

window.WF6Atlas = WF6Atlas;
