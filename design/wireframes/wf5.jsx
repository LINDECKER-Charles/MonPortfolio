// WF5 — Pilier + Onglets : hero d'un projet phare, le reste en onglets compacts
function WF5Pilier() {
  const [active, setActive] = React.useState('app');
  const pillar = PROJECTS[0]; // Omnicard
  const tabItems = PROJECTS.filter(p => p.type === active);
  const t = TYPE_META[pillar.type];

  const MiniCard = ({ p }) => {
    const tt = TYPE_META[p.type];
    const ss = STATUS_META[p.status];
    return (
      <div className="box-solid" style={{ padding: 10, display:'flex', flexDirection:'column', gap: 6 }}>
        <div className="ph" style={{ height: 80 }}>visuel</div>
        <div className="row" style={{ justifyContent:'space-between' }}>
          <div className="h2" style={{ fontSize: 13, letterSpacing:'0.05em' }}>{p.title}</div>
          <span className={`dot ${ss.dot}`}></span>
        </div>
        <div className="mono" style={{ fontSize: 9 }}>{p.year} · {p.role}</div>
        <div className="row" style={{ gap: 4, flexWrap:'wrap' }}>
          {p.stack.slice(0,2).map(s => <span key={s} className="chip chip-mini">{s}</span>)}
        </div>
      </div>
    );
  };

  return (
    <div className="wf">
      <div className="spread" style={{ marginBottom: 14 }}>
        <div>
          <div className="kicker">Portfolio · v5 · Pilier + Onglets</div>
          <h1>Projets</h1>
        </div>
        <div className="row" style={{ gap: 8 }}>
          <div className="search" style={{ width: 220 }}><span>⌕</span><span>chercher…</span></div>
        </div>
      </div>

      {/* HERO Pilier */}
      <div className="box-solid" style={{ padding: 18, display:'grid', gridTemplateColumns: '1.3fr 1fr', gap: 18, marginBottom: 20, position:'relative' }}>
        <div style={{ position:'absolute', top: -10, left: 18, padding:'2px 12px', background:'var(--blood)', color:'var(--paper)', fontFamily:'var(--mono)', fontSize: 9, letterSpacing:'0.2em' }}>PROJET PILIER</div>
        <div className="ph" style={{ height: 220 }}>visuel · 16:9 · large</div>
        <div className="col" style={{ gap: 10, justifyContent:'space-between' }}>
          <div>
            <div className="kicker">{t.label} · {pillar.year}</div>
            <div className="h1" style={{ fontSize: 28, marginTop: 4 }}>{pillar.title}</div>
            <div className="mono" style={{ marginTop: 8, fontSize: 11, lineHeight: 1.5, color:'var(--ink)' }}>
              Jeu de cartes stratégique avec moteur métier custom, architecture modulaire et logique temps réel. Description courte mais qui donne envie.
            </div>
          </div>
          <div className="col" style={{ gap: 6 }}>
            <div className="row" style={{ gap: 4, flexWrap:'wrap' }}>
              {pillar.stack.map(s => <span key={s} className="chip chip-mini">{s}</span>)}
            </div>
            <div className="row" style={{ gap: 4, flexWrap:'wrap' }}>
              {pillar.tags.map(tg => <span key={tg} className="chip chip-mini" style={{ borderColor:'var(--ink-faint)' }}>#{tg}</span>)}
            </div>
            <div className="divider" style={{ margin: '6px 0' }}></div>
            <div className="row" style={{ gap: 8 }}>
              <span className="chip chip-blood chip-on">↗ Voir la démo</span>
              <span className="chip">↗ Code</span>
              <span className="chip">📝 Étude de cas</span>
            </div>
          </div>
        </div>
      </div>

      {/* ONGLETS */}
      <div className="row" style={{ gap: 0, borderBottom:'1.5px solid var(--ink-soft)', marginBottom: 14 }}>
        {Object.entries(TYPE_META).map(([k,v]) => {
          const count = PROJECTS.filter(p => p.type===k).length;
          const on = k === active;
          return (
            <div key={k} onClick={() => setActive(k)} style={{
              padding:'10px 16px',
              borderBottom: on ? '2px solid var(--blood)' : '2px solid transparent',
              marginBottom: -1.5,
              cursor: 'pointer',
              display:'flex', alignItems:'baseline', gap: 8
            }}>
              <span style={{ color: on?'var(--blood)':'var(--gold)', fontFamily:'var(--serif)', fontSize: 14 }}>{v.glyph}</span>
              <span style={{
                fontFamily:'var(--serif)', fontSize: 13, letterSpacing:'0.14em', textTransform:'uppercase',
                color: on ? 'var(--ink)' : 'var(--ink-soft)'
              }}>{v.plural}</span>
              <span className="mono" style={{ fontSize: 9, opacity: 0.6 }}>{count}</span>
            </div>
          );
        })}
        <div style={{ flex: 1 }}></div>
        <div className="row" style={{ gap: 6, paddingBottom: 8 }}>
          <span className="mono">tri :</span>
          <span className="chip chip-mini chip-on">RÉCENT</span>
          <span className="chip chip-mini">A→Z</span>
        </div>
      </div>

      <div className="mono" style={{ fontSize: 11, marginBottom: 12, color:'var(--ink-soft)' }}>
        {TYPE_META[active].sub} · {tabItems.length} entrée{tabItems.length>1?'s':''}
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap: 12 }}>
        {tabItems.map(p => <MiniCard key={p.id} p={p} />)}
        {/* placeholders pour les vides */}
        {Array.from({ length: Math.max(0, 4 - tabItems.length) }).map((_, i) => (
          <div key={i} className="box-faint" style={{ minHeight: 160 }}></div>
        ))}
      </div>

      <div className="annot" style={{ top: 110, left: 12, transform:'rotate(-3deg)', maxWidth: 130 }}>
        <div>UN projet mis en<br/>avant — pas dilué ↓</div>
      </div>
      <div className="annot" style={{ top: 320, right: 18, transform:'rotate(3deg)', maxWidth: 130 }}>
        <div>onglets =<br/>navigation rapide</div>
      </div>
      <div className="annot" style={{ bottom: 30, left: 14, transform:'rotate(-2deg)', maxWidth: 160 }}>
        <div>OSS et CLI<br/>traités à égalité<br/>avec les apps</div>
      </div>
    </div>
  );
}

window.WF5Pilier = WF5Pilier;
