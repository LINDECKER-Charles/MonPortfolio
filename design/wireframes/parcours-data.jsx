// Données partagées pour la page Parcours
// Placeholder — à remplacer avec tes vraies infos
const EXPERIENCES = [
  { id:'e1', period:'2024 — aujourd\'hui', start:'2024', end:'présent',
    role:'Développeur Full-Stack Senior', company:'Société A', location:'Paris · Remote',
    type:'CDI', stack:['React','Node','PostgreSQL','AWS'],
    bullets:[
      'Lead technique sur la refonte du produit cœur (3 devs).',
      'Mise en place CI/CD + monitoring (Datadog).',
      'Réduction du temps de réponse API de 40%.',
    ] },
  { id:'e2', period:'2022 — 2024', start:'2022', end:'2024',
    role:'Développeur Full-Stack', company:'Société B', location:'Lyon',
    type:'CDI', stack:['Vue','Python','Docker'],
    bullets:[
      'Développement d\'une plateforme SaaS B2B (500+ clients).',
      'Migration monolithe → microservices.',
    ] },
  { id:'e3', period:'2021 — 2022', start:'2021', end:'2022',
    role:'Développeur Front-End', company:'Agence C', location:'Lyon',
    type:'CDI', stack:['React','Next.js','Sass'],
    bullets:[
      'Sites e-commerce sur-mesure pour clients retail.',
      'Mise en place design system partagé.',
    ] },
  { id:'e4', period:'2020 — 2021', start:'2020', end:'2021',
    role:'Développeur Junior', company:'Startup D', location:'Lyon',
    type:'CDI', stack:['JS','PHP','MySQL'],
    bullets:[
      'Premier poste — montée en compétences full-stack.',
    ] },
  { id:'e5', period:'2019 — 2020', start:'2019', end:'2020',
    role:'Stage de fin d\'études', company:'Startup D', location:'Lyon',
    type:'Stage · 6 mois', stack:['JS','PHP'],
    bullets:[
      'Refonte du back-office interne.',
    ] },
];

const FORMATION = {
  diplome:'Master Informatique — Spécialité Génie Logiciel',
  ecole:'Université / École X',
  ville:'Lyon',
  periode:'2017 — 2019',
  mention:'Mention Bien',
  details:[
    'Architecture logicielle, design patterns, méthodes agiles.',
    'Projet de fin d\'études : moteur de recommandation distribué.',
  ],
};

// 12 certifications — placeholder
const CERTIFICATIONS = [
  { id:'c01', title:'AWS Certified Solutions Architect — Associate', issuer:'Amazon Web Services', year:'2025', cat:'cloud',  active:true  },
  { id:'c02', title:'AWS Certified Developer — Associate',           issuer:'Amazon Web Services', year:'2024', cat:'cloud',  active:true  },
  { id:'c03', title:'Google Cloud Associate Engineer',               issuer:'Google Cloud',        year:'2024', cat:'cloud',  active:true  },
  { id:'c04', title:'Certified Kubernetes Administrator (CKA)',      issuer:'CNCF',                year:'2024', cat:'devops', active:true  },
  { id:'c05', title:'HashiCorp Certified : Terraform Associate',     issuer:'HashiCorp',           year:'2023', cat:'devops', active:true  },
  { id:'c06', title:'Docker Certified Associate',                    issuer:'Docker',              year:'2023', cat:'devops', active:false },
  { id:'c07', title:'Professional Scrum Master I',                   issuer:'Scrum.org',           year:'2023', cat:'agile',  active:true  },
  { id:'c08', title:'MongoDB Certified Developer',                   issuer:'MongoDB Inc.',        year:'2022', cat:'data',   active:true  },
  { id:'c09', title:'Meta Front-End Developer',                      issuer:'Coursera · Meta',     year:'2022', cat:'dev',    active:true  },
  { id:'c10', title:'TypeScript Deep Dive',                          issuer:'Frontend Masters',    year:'2022', cat:'dev',    active:true  },
  { id:'c11', title:'OWASP Web Security Fundamentals',               issuer:'OWASP',               year:'2021', cat:'sec',    active:true  },
  { id:'c12', title:'TOEIC — 945 / 990',                             issuer:'ETS',                 year:'2020', cat:'lang',   active:true  },
];

const CERT_CAT = {
  cloud:  { label:'Cloud',     glyph:'☁' },
  devops: { label:'DevOps',    glyph:'⚙' },
  agile:  { label:'Agile',     glyph:'◬' },
  data:   { label:'Données',   glyph:'◉' },
  dev:    { label:'Dev',       glyph:'◆' },
  sec:    { label:'Sécurité',  glyph:'✚' },
  lang:   { label:'Langues',   glyph:'✦' },
};

Object.assign(window, { EXPERIENCES, FORMATION, CERTIFICATIONS, CERT_CAT });
