import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import {
  ResponsivePicture,
  ResponsiveSource,
} from '../../assets/responsive-picture/responsive-picture';

interface NavItem {
  label: string;
  href: string;
  exact?: boolean;
  iconSources: ResponsiveSource[];
  iconFallback: string;
  iconAlt: string;
}

@Component({
  selector: 'app-nav-barre',
  imports: [RouterLink, RouterLinkActive, ResponsivePicture],
  templateUrl: './nav-barre.html',
  styleUrl: './nav-barre.css',
})
export class NavBarre {
  protected readonly logoSources: ResponsiveSource[] = [
    { src: '/logo/24x24_logo_white.webp', maxWidth: 320, type: 'image/webp' },
    { src: '/logo/40x40_logo_white.webp', maxWidth: 480, type: 'image/webp' },
    { src: '/logo/80x80_logo_white.webp', maxWidth: 768, type: 'image/webp' },
    { src: '/logo/160x160_logo_white.webp', maxWidth: 1200, type: 'image/webp' },
    { src: '/logo/logo_white.webp', type: 'image/webp' },
  ];

  protected readonly logoFallback = '/logo/logo_white.webp';

  protected readonly navItems: NavItem[] = [
    {
      label: 'Accueil',
      href: '/',
      exact: true,
      iconSources: this.buildIconSet('lucidity'),
      iconFallback: '/icon/lucidity.webp',
      iconAlt: 'Accueil',
    },
    {
      label: 'Projets',
      href: '/projects',
      iconSources: this.buildIconSet('discover'),
      iconFallback: '/icon/discover.webp',
      iconAlt: 'Projets',
    },
    {
      label: 'Parcours',
      href: '/works',
      iconSources: this.buildIconSet('strenght'),
      iconFallback: '/icon/strenght.webp',
      iconAlt: 'Parcours',
    },
  ];

  private buildIconSet(name: string): ResponsiveSource[] {
    return [
      { src: `/icon/24x24_${name}.webp`, maxWidth: 320, type: 'image/webp' },
      { src: `/icon/40x40_${name}.webp`, maxWidth: 480, type: 'image/webp' },
      { src: `/icon/80x80_${name}.webp`, maxWidth: 768, type: 'image/webp' },
      { src: `/icon/160x160_${name}.webp`, maxWidth: 1200, type: 'image/webp' },
      { src: `/icon/${name}.webp`, type: 'image/webp' },
    ];
  }
}
