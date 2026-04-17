import { Component, computed, ElementRef, HostListener, inject, signal } from '@angular/core';
import { UpperCasePipe } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import {
  ResponsivePicture,
  ResponsiveSource,
} from '../../assets/responsive-picture/responsive-picture';
import { SHARED_IMAGES } from '../../../img-sources/shared.sources';
import { AudioService } from '../../../services/audio-service';
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
  protected readonly audio = inject(AudioService);
  private readonly host = inject(ElementRef<HTMLElement>);

  protected readonly logoSources = SHARED_IMAGES.logo.white.sources;
  protected readonly logoFallback = SHARED_IMAGES.logo.white.fallbackSrc;

  /** Popover des contrôles audio (mute + volume). */
  protected readonly soundPopoverOpen = signal(false);

  protected readonly volumePercent = computed(() => Math.round(this.audio.masterVolume() * 100));

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

  protected toggleSoundPopover(): void {
    this.soundPopoverOpen.update((v) => !v);
  }

  protected toggleMute(): void {
    if (this.audio.muted()) {
      this.audio.unmuteAll();
      return;
    }
    this.audio.muteAll();
  }

  protected onVolumeInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = Number(input.value);
    if (Number.isNaN(value)) return;
    this.audio.setMasterVolume(value / 100);
  }

  /** Ferme le popover si on clique en-dehors. */
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.soundPopoverOpen()) return;
    const target = event.target as Node | null;
    if (target && !this.host.nativeElement.contains(target)) {
      this.soundPopoverOpen.set(false);
    }
  }

  /** Escape ferme aussi le popover. */
  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.soundPopoverOpen()) {
      this.soundPopoverOpen.set(false);
    }
  }
}
