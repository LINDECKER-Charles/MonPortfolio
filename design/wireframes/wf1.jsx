// WF1 — Grimoire : grille dense type bestiaire
// Toutes les infos en grille 3 colonnes compactes
function WF1Grimoire() {
  const cats = [
    { id:'all', label:'Tous', count: PROJECTS.length },
    { id:'app', label:'Apps', count: 4 },
    { id:'cli', label:'CLI', count: 3 },
    { id:'lib', label:'Reliques', count: 3 },
    { id:'oss', label:'Pactes', count: 3 },
    { id:'xp',  label:'Rêveries', count: 2 },
  ];

  const Card = ({ p, featured }) => {
    const t = TYPE_META[p.type];
    const s = STATUS_META[p.status];
    return (
      <div className="box-solid" style={{ padding: 12, display:'flex', flexDirection:'column', gap: 8, position:'relative' }}>
        {featured && (
          <div style={{ position:'absolute', top:-7, right:10, padding:'1px 8px', background:'var(--blood)', color:'var(--paper)', fontFamily:'var(--mono)', fontSize:8, letterSpacing:'0.18em' }}>PILIER</div>
        )}
        <div className="ph" style={{ height: 96 }}>visuel · 16:9</div>
        <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:8 }}>
          <div>
            <div className="row" style={{ gap:6 }}>
              <span className="glyph" style={{ width:18, height:18, fontSize:10 }}>{t.glyph}</span>
              <div className="h2" style={{ fontSize:14, letterSpacing:'0.08em' }}>{p.title}</div>
            </div>
            <div className="mono" style={{ marginTop:2, fontSize:9 }}>{t.label.toUpperCase()} · {p.year}</div>
          </div>
          <div className="row" style={{ gap:6 }}>
            <span className={`dot ${s.dot}`}></span>
          </div>
        </div>
        <div className="row" style={{ gap:5, flexWrap:'wrap' }}>
          {p.stack.slice(0,3).map(s => <span key={s} className="chip chip-mini">{s}</span>)}
        </div>
        <div className="divider" />
        <div className="row" style={{ justifyContent:'space-between' }}>
          <div className="mono" style={{ fontSize:9, color:'var(--ink-soft)' }}>{p.role}</div>
          <div className="row" style={{ gap:6 }}>
            <span className="mono" style={{ fontSize:9 }}>↗ demo</span>
            <span className="mono" style={{ fontSize:9 }}>↗ code</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="wf">
      <div className="spread" style={{ marginBottom: 14 }}>
        <div>
          <div className="kicker">Portfolio · v1 · Grimoire</div>
          <h1>Projets</h1>
        </div>
        <div className="col" style={{ alignItems:'flex-end', gap:8 }}>
          <div className="search" style={{ width: 280 }}>
            <span>⌕</span> <span>chercher un projet…</span>
          </div>
          <div className="row" style={{ gap:8 }}>
            <span className="mono">trier :</span>
            <span className="chip chip-mini chip-on">RÉCENT</span>
            <span className="chip chip-mini">POPULAIRE</span>
            <span className="chip chip-mini">A→Z</span>
          </div>
        </div>
      </div>

      {/* Filtres horizontaux compacts */}
      <div className="box" style={{ padding:'10px 14px', marginBottom: 12 }}>
        <div className="row" style={{ gap: 8, flexWrap:'wrap' }}>
          <span className="h3" style={{ fontSize: 10 }}>Catégorie</span>
          {cats.map(c => (
            <span key={c.id} className={`chip chip-mini ${c.id==='all'?'chip-on':''}`}>
              {c.label} <span style={{ opacity:0.6 }}>· {c.count}</span>
            </span>
          ))}
          <span className="divider-v" style={{ margin:'0 6px' }}></span>
          <span className="h3" style={{ fontSize: 10 }}>Statut</span>
          <span className="chip chip-mini"><span className="dot dot-active" style={{ width:6, height:6 }}></span> actif</span>
          <span className="chip chip-mini"><span className="dot dot-wip" style={{ width:6, height:6 }}></span> en cours</span>
          <span className="chip chip-mini"><span className="dot dot-archived" style={{ width:6, height:6 }}></span> archivé</span>
        </div>
        <div className="row" style={{ gap: 6, flexWrap:'wrap', marginTop: 8 }}>
          <span className="h3" style={{ fontSize: 10 }}>Tags</span>
          {ALL_TAGS.slice(0,10).map(t => (
            <span key={t} className="chip chip-mini" style={{ borderColor:'var(--ink-faint)' }}>#{t}</span>
          ))}
          <span className="mono" style={{ fontSize: 9 }}>+ {ALL_TAGS.length - 10} autres</span>
        </div>
      </div>

      {/* Grille 3 colonnes */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap: 14 }}>
        {PROJECTS.slice(0, 9).map((p, i) => (
          <Card key={p.id} p={p} featured={i===0} />
        ))}
      </div>

      <div className="row" style={{ justifyContent:'center', marginTop: 16, gap: 8 }}>
        <span className="mono">page</span>
        <span className="chip chip-mini chip-on">1</span>
        <span className="chip chip-mini">2</span>
        <span className="mono">/ 2</span>
      </div>

      {/* Annotations manuscrites */}
      <div className="annot" style={{ top: 30, left: 380, transform:'rotate(-4deg)' }}>
        <div>← une seule barre<br/>de filtres compacte</div>
      </div>
      <div className="annot" style={{ top: 380, right: 24, transform:'rotate(3deg)', maxWidth: 130 }}>
        <div>hover sur la carte<br/>→ preview anim ↘</div>
      </div>
      <div className="annot" style={{ bottom: 90, left: 30, transform:'rotate(-2deg)', maxWidth: 160 }}>
        <div>tout visible<br/>sans scroller à l'infini</div>
      </div>
    </div>
  );
}

window.WF1Grimoire = WF1Grimoire;
