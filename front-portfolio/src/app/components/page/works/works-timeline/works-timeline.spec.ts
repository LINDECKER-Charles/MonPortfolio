import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorksTimeline } from './works-timeline';
import {
  EDUCATIONS,
  EXPERIENCES,
  Experience,
  ORGANISM_MONOGRAMS,
  ORGANISM_NAMES,
  buildTimeline,
} from '../works.state';

function api(component: WorksTimeline): any {
  return component as any;
}

describe('WorksTimeline', () => {
  let component: WorksTimeline;
  let fixture: ComponentFixture<WorksTimeline>;

  const remoteExp = EXPERIENCES.find((e) => e.location === 'remote')!;
  const onsiteExp = EXPERIENCES.find((e) => e.location !== 'remote')!;
  const noSectorExp = { ...EXPERIENCES[0], sector: undefined } as Experience;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
      imports: [WorksTimeline],
    }).compileComponents();

    fixture = TestBed.createComponent(WorksTimeline);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('order / scope', () => {
    it('setOrder recompose les rows', () => {
      api(component).setOrder('old');
      expect(api(component).rows()).toEqual(buildTimeline('old', 'all'));
    });

    it('setScope recompose les rows', () => {
      api(component).setScope('volunteer');
      expect(api(component).rows()).toEqual(buildTimeline('recent', 'volunteer'));
    });

    it('scopeLabel mappe chaque scope vers sa clé', () => {
      expect(api(component).scopeLabel('all')).toBe('works.timeline.scopeAll');
      expect(api(component).scopeLabel('pro')).toBe('works.timeline.scopePro');
      expect(api(component).scopeLabel('volunteer')).toBe('works.timeline.scopeVolunteer');
    });

    it('scopeCount lit les compteurs', () => {
      expect(api(component).scopeCount('all')).toBe(api(component).counts.all);
    });
  });

  describe('organisme', () => {
    it('hasLogo vrai/faux selon la présence de logo', () => {
      expect(api(component).hasLogo('microsoft')).toBeTrue();
      expect(api(component).hasLogo('pvzf')).toBeFalse();
    });

    it('logoSources / logoFallback gèrent l\'absence', () => {
      expect(api(component).logoSources('pvzf')).toEqual([]);
      expect(api(component).logoFallback('pvzf')).toBe('');
      expect(api(component).logoSources('microsoft').length).toBeGreaterThan(0);
    });

    it('monogram utilise ORGANISM_MONOGRAMS si présent', () => {
      expect(api(component).monogram('pvzf')).toBe(ORGANISM_MONOGRAMS['pvzf']);
    });

    it('monogram retombe sur les 2 premières lettres du nom sinon', () => {
      // microsoft n'a pas de monogramme dédié
      expect(api(component).monogram('microsoft')).toBe(
        ORGANISM_NAMES['microsoft'].slice(0, 2).toUpperCase()
      );
    });

    it('organismName renvoie le nom', () => {
      expect(api(component).organismName('atis')).toBe(ORGANISM_NAMES['atis']);
    });
  });

  describe('expérience — i18n & labels', () => {
    it('xpTitle / xpDescription délèguent aux clés', () => {
      expect(api(component).xpTitle(remoteExp)).toBe(`works.xp.${remoteExp.id}.title`);
      expect(api(component).xpDescription(remoteExp)).toBe(
        `works.xp.${remoteExp.id}.description`
      );
    });

    it('employmentLabel / workModeLabel délèguent aux clés', () => {
      expect(api(component).employmentLabel(remoteExp)).toBe(
        `works.employment.${remoteExp.employment}`
      );
      expect(api(component).workModeLabel(remoteExp)).toBe(
        `works.workMode.${remoteExp.workMode}`
      );
    });

    it('sectorLabel renvoie la clé quand sector est défini', () => {
      const withSector = EXPERIENCES.find((e) => e.sector)!;
      expect(api(component).sectorLabel(withSector)).toBe(
        `works.sector.${withSector.sector}`
      );
    });

    it('sectorLabel renvoie \'\' quand sector est absent', () => {
      expect(api(component).sectorLabel(noSectorExp)).toBe('');
    });

    it('locationLabel mappe « remote » vers la clé workMode', () => {
      expect(api(component).locationLabel(remoteExp)).toBe('works.workMode.remote');
    });

    it('locationLabel renvoie l\'adresse littérale sinon', () => {
      expect(api(component).locationLabel(onsiteExp)).toBe(onsiteExp.location);
    });

    it('xpPeriod / xpDuration renvoient des chaînes', () => {
      expect(typeof api(component).xpPeriod(remoteExp)).toBe('string');
      expect(typeof api(component).xpDuration(remoteExp)).toBe('string');
    });
  });

  describe('paragraphs', () => {
    it('découpe sur les doubles sauts de ligne et filtre le vide', () => {
      expect(api(component).paragraphs('a\n\nb\n\n  \n\nc')).toEqual(['a', 'b', 'c']);
    });

    it('renvoie un seul paragraphe sans double saut', () => {
      expect(api(component).paragraphs('solo')).toEqual(['solo']);
    });
  });

  describe('formation', () => {
    const edu = EDUCATIONS[0];

    it('eduTitle / eduSubtitle délèguent aux clés', () => {
      expect(api(component).eduTitle(edu)).toBe(`works.edu.${edu.id}.title`);
      expect(api(component).eduSubtitle(edu)).toBe(`works.edu.${edu.id}.subtitle`);
    });

    it('eduPeriod renvoie une chaîne', () => {
      expect(typeof api(component).eduPeriod(edu)).toBe('string');
    });
  });

  describe('trackRow', () => {
    it('préfixe « y- » pour une ligne année', () => {
      expect(api(component).trackRow(0, { type: 'year', year: '2025' })).toBe('y-2025');
    });

    it('préfixe « e- » pour une expérience', () => {
      const row = { type: 'node', node: { kind: 'experience', exp: remoteExp } };
      expect(api(component).trackRow(0, row)).toBe(`e-${remoteExp.id}`);
    });

    it('préfixe « f- » pour une formation', () => {
      const row = { type: 'node', node: { kind: 'education', edu: EDUCATIONS[0] } };
      expect(api(component).trackRow(0, row)).toBe(`f-${EDUCATIONS[0].id}`);
    });
  });
});
