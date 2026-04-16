import { Component, computed, inject } from '@angular/core';
import { UpperCasePipe } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import {
  ResponsivePicture,
  ResponsiveSource,
} from '../../assets/responsive-picture/responsive-picture';
import { SHARED_IMAGES } from '../../../img-sources/shared.sources';
import { AVAILABLE_LANGUAGES, TranslationService } from '../../../services/translation.service';

interface NavItemDef {
  key: string;   // clef de traduction nav-barre.*
  href: string;
  exact?: boolean;
  iconSources: ResponsiveSource[];
  iconFallback: string;
}

const NAV_ITEMS_DEF: NavItemDef[] = [
  { key: 'home',     href: '/', exact: true,   iconSources: SHARED_IMAGES.icon.lucidity.sources, iconFallback: SHARED_IMAGES.icon.lucidity.fallbackSrc },
  { key: 'projects', href: '/projects',         iconSources: SHARED_IMAGES.icon.discover.sources, iconFallback: SHARED_IMAGES.icon.discover.fallbackSrc },
  { key: 'work',     href: '/works',            iconSources: SHARED_IMAGES.icon.strenght.sources, iconFallback: SHARED_IMAGES.icon.strenght.fallbackSrc },
];

@Component({
  selector: 'app-nav-barre',
  imports: [RouterLink, RouterLinkActive, ResponsivePicture, UpperCasePipe],
  templateUrl: './nav-barre.html',
  styleUrl: './nav-barre.css',
})
export class NavBarre {
  protected readonly ts = inject(TranslationService);

  protected readonly logoSources = SHARED_IMAGES.logo.white.sources;
  protected readonly logoFallback = SHARED_IMAGES.logo.white.fallbackSrc;

  protected readonly navItems = computed(() =>
    NAV_ITEMS_DEF.map((def) => ({
      ...def,
      label: this.ts.translate(`nav-barre.${def.key}`),
    }))
  );

  protected readonly currentLang = computed(() => {
    const code = this.ts.lang();
    return AVAILABLE_LANGUAGES.find((l) => l.code === code) ?? AVAILABLE_LANGUAGES[0];
  });
}
