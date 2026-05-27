// Shared project dataset — used across all wireframes
// Types: app | cli | lib | oss | xp
// Statuts: active | wip | archived
const PROJECTS = [
  { id:'omnicard',   title:'Omnicard',     type:'app', status:'wip',      year:'2026', stack:['React','Node','WS'],     tags:['game','realtime'],         role:'Solo · Lead' },
  { id:'penumbra',   title:'Penumbra',     type:'cli', status:'active',   year:'2025', stack:['Rust'],                  tags:['devtool','log'],           role:'Solo' },
  { id:'vellum',     title:'Vellum',       type:'lib', status:'active',   year:'2025', stack:['TypeScript'],            tags:['parser','markdown'],       role:'Maintainer' },
  { id:'lantern',    title:'Lantern',      type:'oss', status:'active',   year:'2024', stack:['TS','Next.js'],          tags:['perf','SSR'],              role:'Contributeur' },
  { id:'hexcalibur', title:'Hexcalibur',   type:'app', status:'active',   year:'2024', stack:['Vue','PG'],              tags:['saas','b2b'],              role:'Co-fondateur' },
  { id:'watchman',   title:'Watchman',     type:'cli', status:'active',   year:'2023', stack:['Go'],                    tags:['monitoring'],              role:'Solo' },
  { id:'specter',    title:'Specter',      type:'lib', status:'archived', year:'2023', stack:['Python'],                tags:['ML','viz'],                role:'Solo' },
  { id:'wraith',     title:'Wraith-fmt',   type:'oss', status:'active',   year:'2023', stack:['TS','Prettier'],         tags:['formatter','plugin'],      role:'Contributeur' },
  { id:'crypt',      title:'Crypt-router', type:'lib', status:'active',   year:'2022', stack:['Node'],                  tags:['routing','http'],          role:'Solo' },
  { id:'moonlit',    title:'Moonlit',      type:'app', status:'wip',      year:'2026', stack:['RN','Expo'],             tags:['mobile','health'],         role:'Solo · Design+Dev' },
  { id:'reliquary',  title:'Reliquary',    type:'xp',  status:'archived', year:'2022', stack:['Three.js'],              tags:['webgl','art'],             role:'Solo' },
  { id:'pyre',       title:'Pyre',         type:'cli', status:'active',   year:'2025', stack:['Python','Bash'],         tags:['deploy','infra'],          role:'Solo' },
  { id:'sable',      title:'Sable',        type:'oss', status:'active',   year:'2024', stack:['TS','Astro'],            tags:['ssg','content'],           role:'Contributeur' },
  { id:'coven',      title:'Coven',        type:'app', status:'active',   year:'2024', stack:['Svelte','Supabase'],     tags:['social','niche'],          role:'Solo' },
  { id:'tomb',       title:'Tomb-of-glyphs', type:'xp',status:'archived', year:'2023', stack:['WebGL','GLSL'],          tags:['shader','demoscene'],      role:'Solo' },
];

const TYPE_META = {
  app: { label: 'Application',     glyph: '◆', plural: 'Tomes Majeurs',     sub: 'Apps web & mobile complètes' },
  cli: { label: 'Outil CLI',       glyph: '▶', plural: 'Outils du Chasseur', sub: 'Scripts et utilitaires' },
  lib: { label: 'Bibliothèque',    glyph: '◉', plural: 'Reliques',           sub: 'Packages publiés' },
  oss: { label: 'Contribution',    glyph: '✦', plural: 'Pactes',             sub: 'Open source externe' },
  xp:  { label: 'Expérimentation', glyph: '◬', plural: 'Rêveries',           sub: 'Prototypes & démos' },
};

const STATUS_META = {
  active:   { label: 'Actif',     dot: 'dot-active'   },
  wip:      { label: 'En cours',  dot: 'dot-wip'      },
  archived: { label: 'Archivé',   dot: 'dot-archived' },
};

const ALL_TAGS = [...new Set(PROJECTS.flatMap(p => p.tags))];
const ALL_STACKS = [...new Set(PROJECTS.flatMap(p => p.stack))];

Object.assign(window, { PROJECTS, TYPE_META, STATUS_META, ALL_TAGS, ALL_STACKS });
