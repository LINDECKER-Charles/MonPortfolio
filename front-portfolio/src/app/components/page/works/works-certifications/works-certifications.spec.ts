import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorksCertifications } from './works-certifications';
import {
  CERTIFICATIONS,
  CERT_CATEGORIES,
  CERT_CATEGORY_ORDER,
  Certification,
  ORGANISM_NAMES,
} from '../works.state';

function api(component: WorksCertifications): any {
  return component as any;
}

describe('WorksCertifications', () => {
  let component: WorksCertifications;
  let fixture: ComponentFixture<WorksCertifications>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
      imports: [WorksCertifications],
    }).compileComponents();

    fixture = TestBed.createComponent(WorksCertifications);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('filtrage', () => {
    it('« all » affiche toutes les certifications', () => {
      expect(api(component).visible().length).toBe(CERTIFICATIONS.length);
    });

    it('setFilter restreint à la catégorie', () => {
      const cat = CERT_CATEGORY_ORDER[0];
      api(component).setFilter(cat);
      const visible: Certification[] = api(component).visible();
      expect(visible.every((c) => c.category === cat)).toBeTrue();
      expect(visible.length).toBe(CERTIFICATIONS.filter((c) => c.category === cat).length);
    });
  });

  describe('count', () => {
    it('compte « all »', () => {
      expect(api(component).count('all')).toBe(CERTIFICATIONS.length);
    });

    it('compte chaque catégorie', () => {
      for (const cat of CERT_CATEGORY_ORDER) {
        expect(api(component).count(cat)).toBe(
          CERTIFICATIONS.filter((c) => c.category === cat).length
        );
      }
    });
  });

  it('glyph renvoie le glyphe de la catégorie', () => {
    const cat = CERT_CATEGORY_ORDER[0];
    expect(api(component).glyph(cat)).toBe(CERT_CATEGORIES[cat].glyph);
  });

  it('categoryLabel délègue à la clé i18n', () => {
    const cat = CERT_CATEGORY_ORDER[0];
    expect(api(component).categoryLabel(cat)).toBe(`works.certifications.category.${cat}`);
  });

  describe('logo helpers', () => {
    it('logoSources renvoie [] pour un organisme sans logo', () => {
      expect(api(component).logoSources('pvzf')).toEqual([]);
    });

    it('logoFallback renvoie \'\' pour un organisme sans logo', () => {
      expect(api(component).logoFallback('pvzf')).toBe('');
    });

    it('logoSources renvoie les sources pour un organisme avec logo', () => {
      expect(api(component).logoSources('microsoft').length).toBeGreaterThan(0);
    });

    it('logoFallback renvoie une chaîne pour un organisme avec logo', () => {
      expect(api(component).logoFallback('microsoft')).toBeTruthy();
    });
  });

  it('organismName renvoie le nom', () => {
    expect(api(component).organismName('microsoft')).toBe(ORGANISM_NAMES['microsoft']);
  });

  it('issuedYear extrait l\'année', () => {
    const cert: Certification = CERTIFICATIONS[0];
    expect(api(component).issuedYear(cert)).toBe(cert.issuedAt.slice(0, 4));
  });

  it('issuedAt formate la date', () => {
    expect(api(component).issuedAt(CERTIFICATIONS[0])).toBeTruthy();
  });

  it('trackById renvoie l\'id', () => {
    expect(api(component).trackById(0, CERTIFICATIONS[0])).toBe(CERTIFICATIONS[0].id);
  });
});
