import {ResponsiveSource} from '../../components/assets/responsive-picture/responsive-picture';
import {ProjectMediaImage} from '../../components/page/projects/projects.state';

const buildResponsiveImageSources = (
  name: string,
  sizes: Array<{ width: number; height: number }>
): ResponsiveSource[] => {
  const sources: ResponsiveSource[] = [];

  for (const size of sizes) {
    const srcBase = `/project/GlossairQuest/${size.width}x${size.height}_${name}`;

    sources.push({
      src: `${srcBase}.webp`,
      maxWidth: size.width,
      type: 'image/webp',
    });
  }

  sources.push({
    src: `/project/GlossairQuest/${name}.webp`,
    type: 'image/webp',
  });

  return sources;
};

export const GLOSSAIRE_QUEST_HOME_IMAGE: ProjectMediaImage = {
  alt: 'GlossaireQuest home',
  fallbackSrc: '/project/GlossairQuest/home.webp',
  sources: buildResponsiveImageSources('home', [
    { width: 24, height: 26 },
    { width: 40, height: 43 },
    { width: 80, height: 86 },
    { width: 160, height: 171 },
    { width: 320, height: 342 },
    { width: 640, height: 684 },
    { width: 768, height: 821 },
    { width: 1024, height: 1095 },
    { width: 1280, height: 1369 },
    { width: 1536, height: 1642 },
  ]),
};

export const GLOSSAIRE_QUEST_CREATE_QUIZZ_IMAGE: ProjectMediaImage = {
  alt: 'GlossaireQuest création de quiz',
  fallbackSrc: '/project/GlossairQuest/create-quizz.webp',
  sources: buildResponsiveImageSources('create-quizz', [
    { width: 24, height: 19 },
    { width: 40, height: 32 },
    { width: 80, height: 65 },
    { width: 160, height: 130 },
    { width: 320, height: 260 },
    { width: 640, height: 520 },
    { width: 768, height: 623 },
    { width: 1024, height: 831 },
    { width: 1280, height: 1039 },
  ]),
};

export const GLOSSAIRE_QUEST_PROFIL_IMAGE: ProjectMediaImage = {
  alt: 'GlossaireQuest profil utilisateur',
  fallbackSrc: '/project/GlossairQuest/profil.webp',
  sources: buildResponsiveImageSources('profil', [
    { width: 24, height: 34 },
    { width: 40, height: 56 },
    { width: 80, height: 113 },
    { width: 160, height: 226 },
    { width: 320, height: 452 },
    { width: 640, height: 903 },
    { width: 768, height: 1084 },
    { width: 1024, height: 1445 },
  ]),
};

export const GLOSSAIRE_QUEST_IMAGES: ProjectMediaImage[] = [
  GLOSSAIRE_QUEST_HOME_IMAGE,
  GLOSSAIRE_QUEST_CREATE_QUIZZ_IMAGE,
  GLOSSAIRE_QUEST_PROFIL_IMAGE,
];
