import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import {
  ResponsivePicture,
  ResponsiveSource,
} from '../../assets/responsive-picture/responsive-picture';
import { SHARED_IMAGES } from '../../../img-sources/shared.sources';

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
  protected readonly logoSources: ResponsiveSource[] = SHARED_IMAGES.logo.white.sources;
  protected readonly logoFallback = SHARED_IMAGES.logo.white.fallbackSrc;

  protected readonly navItems: NavItem[] = [
    {
      label: 'Accueil',
      href: '/',
      exact: true,
      iconSources: SHARED_IMAGES.icon.lucidity.sources,
      iconFallback: SHARED_IMAGES.icon.lucidity.fallbackSrc,
      iconAlt: 'Accueil',
    },
    {
      label: 'Projets',
      href: '/projects',
      iconSources: SHARED_IMAGES.icon.discover.sources,
      iconFallback: SHARED_IMAGES.icon.discover.fallbackSrc,
      iconAlt: 'Projets',
    },
    {
      label: 'Parcours',
      href: '/works',
      iconSources: SHARED_IMAGES.icon.strenght.sources,
      iconFallback: SHARED_IMAGES.icon.strenght.fallbackSrc,
      iconAlt: 'Parcours',
    },
  ];
}
