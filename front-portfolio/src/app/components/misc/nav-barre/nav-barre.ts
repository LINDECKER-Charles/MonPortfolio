import { Component, HostListener, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import {
  ResponsivePicture,
  ResponsiveSource,
} from '../../assets/responsive-picture/responsive-picture';
import { SHARED_IMAGES } from '../../../imgSources/shared.sources';
import { LanguageModal } from '../../assets/language-modal/language-modal';
import { TranslatePipe } from '../../../pipes/translate.pipe';

interface NavItem {
  labelKey: string;
  href: string;
  exact?: boolean;
  iconSources: ResponsiveSource[];
  iconFallback: string;
  iconAlt: string;
}

@Component({
  selector: 'app-nav-barre',
  imports: [RouterLink, RouterLinkActive, ResponsivePicture, LanguageModal, TranslatePipe],
  templateUrl: './nav-barre.html',
  styleUrl: './nav-barre.css',
})
export class NavBarre {
  protected readonly logoSources: ResponsiveSource[] = SHARED_IMAGES.logo.white.sources;
  protected readonly logoFallback = SHARED_IMAGES.logo.white.fallbackSrc;
  protected readonly languageModalOpen = signal(false);

  protected readonly navItems: NavItem[] = [
    {
      labelKey: 'nav.home',
      href: '/',
      exact: true,
      iconSources: SHARED_IMAGES.icon.lucidity.sources,
      iconFallback: SHARED_IMAGES.icon.lucidity.fallbackSrc,
      iconAlt: 'Accueil',
    },
    {
      labelKey: 'nav.projects',
      href: '/projects',
      iconSources: SHARED_IMAGES.icon.discover.sources,
      iconFallback: SHARED_IMAGES.icon.discover.fallbackSrc,
      iconAlt: 'Projets',
    },
    {
      labelKey: 'nav.works',
      href: '/works',
      iconSources: SHARED_IMAGES.icon.strenght.sources,
      iconFallback: SHARED_IMAGES.icon.strenght.fallbackSrc,
      iconAlt: 'Parcours',
    },
  ];

  protected openLanguageModal(): void {
    this.languageModalOpen.set(true);
  }

  protected closeLanguageModal(): void {
    this.languageModalOpen.set(false);
  }

  @HostListener('document:keydown.escape')
  protected onEscapePressed(): void {
    if (this.languageModalOpen()) {
      this.closeLanguageModal();
    }
  }
}
