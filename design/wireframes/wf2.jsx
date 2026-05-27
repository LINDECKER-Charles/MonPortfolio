// WF2 — Chapitres : sections par type, scroll horizontal par chapitre
function WF2Chapitres() {
  const sections = ['app', 'cli', 'lib', 'oss', 'xp'];

  const SmallCard = ({ p, big }) => {
    const t = TYPE_META[p.type];
    const s = STATUS_META[p.status];
    const w = big ? 220 : 170;
    return (
      <div className="box-solid" style={{ width: w, flexShrink: 0, padding: 10, display:'flex', flexDirection:'column', gap: 6 }}>
        <div className="ph" style={{ height: big ? 110 : 84 }}>visuel</div>
        <div className="row" style={{ justifyContent:'space-between' }}>
          <div className="h2" style={{ fontSize: 13, letterSpacing:'0.06em' }}>{p.title}</div>
          <span className={`dot ${s.dot}`}></span>
        </div>
        <div className="mono" style={{ fontSize: 9 }}>{p.year} · {p.role}</div>
        <div className="row" style={{ gap: 4, flexWrap:'wrap' }}>
          {p.stack.slice(0,2).map(st => <span key={st} className="chip chip-mini">{st}</span>)}
        </div>
      </div>
    );
  };

  const Chapter = ({ typeId, big }) => {
    const items = PROJECTS.filter(p => p.type === typeId);
    const t = TYPE_META[typeId];
    return (
      <div style={{ marginBottom: 14 }}>
        <div className="spread" style={{ marginBottom: 8 }}>
          <div className="row" style={{ gap: 12, alignItems:'baseline' }}>
            <span className="glyph" style={{ borderColor:'var(--gold-dim)', color:'var(--gold)' }}>{t.glyph}</span>
            <div>
              <div className="h2" style={{ fontSize: 16 }}>{t.plural}</div>
              <div className="mono" style={{ fontSize: 9, color:'var(--ink-soft)' }}>{t.sub} · {items.length} entrées</div>
            </div>
          </div>
          <div className="row" style={{ gap: 8 }}>
            <span className="chip chip-mini">‹</span>
            <span className="chip chip-mini">›</span>
            <span className="mono" style={{ fontSize:10 }}>voir tout →</span>
          </div>
        </div>
        <div style={{ display:'flex', gap: 10, overflow:'hidden', position:'relative' }}>
          {items.map(p => <SmallCard key={p.id} p={p} big={big} />)}
          {/* fade-out à droite pour indiquer scroll */}
          <div style={{ position:'absolute', right:0, top:0, bottom:0, width: 60, background:'linear-gradient(to right, transparent, var(--paper))', pointerEvents:'none' }}></div>
        </div>
      </div>
    );
  };

  return (
    <div className="wf">
      <div className="spread" style={{ marginBottom: 14 }}>
        <div>
          <div className="kicker">Portfolio · v2 · Chapitres</div>
          <h1>Projets</h1>
          <div className="mono" style={{ marginTop: 4, fontSize: 11, maxWidth: 460 }}>
            Cinq chapitres, un rythme propre à chaque type. Glisser à l'horizontale dans chacun.
          </div>
        </div>
        <div className="col" style={{ alignItems:'flex-end' }}>
          <div className="search" style={{ width: 260 }}>
            <span>⌕</span><span>chercher…</span>
          </div>
          <div className="row" style={{ gap: 6, marginTop: 8 }}>
            <span className="chip chip-mini chip-on">Tous</span>
            <span className="chip chip-mini">Actifs</span>
            <span className="chip chip-mini">Archives</span>
          </div>
        </div>
      </div>

      <div className="divider" style={{ marginBottom: 12 }}></div>

      <Chapter typeId="app" big />
      <Chapter typeId="cli" />
      <Chapter typeId="lib" />
      <Chapter typeId="oss" />
      <Chapter typeId="xp" />

      {/* Annotations */}
      <div className="annot" style={{ top: 28, right: 320, transform:'rotate(-3deg)', maxWidth: 150 }}>
        <div>cherche partout<br/>(tous chapitres)</div>
      </div>
      <div className="annot" style={{ top: 215, right: 14, transform:'rotate(4deg)', maxWidth: 140 }}>
        <div>Apps : cartes<br/>plus grandes ↙<br/>(rôle de vedette)</div>
      </div>
      <div className="annot" style={{ bottom: 110, left: 16, transform:'rotate(-2deg)', maxWidth: 170 }}>
        <div>chaque chapitre<br/>respire — pas de<br/>scroll vertical infini</div>
      </div>
    </div>
  );
}

window.WF2Chapitres = WF2Chapitres;
