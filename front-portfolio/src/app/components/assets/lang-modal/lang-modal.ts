import { isPlatformBrowser } from '@angular/common';
import {
  Component,
  DOCUMENT,
  HostBinding,
  HostListener,
  inject,
  OnDestroy,
  OnInit,
  output,
  PLATFORM_ID,
} from '@angular/core';
import { AVAILABLE_LANGUAGES, TranslationService } from '../../../services/translation.service';
import { FocusTrapDirective } from '../../../directives/focus-trap.directive';
import { lockBodyScroll } from '../../../utils/scroll-lock';

const CLOSE_DURATION_MS = 200;

@Component({
  selector: 'app-lang-modal',
  imports: [FocusTrapDirective],
  templateUrl: './lang-modal.html',
  styleUrl: './lang-modal.css',
})
export class LangModal implements OnInit, OnDestroy {
  readonly closed = output<void>();

  protected readonly ts = inject(TranslationService);
  protected readonly languages = AVAILABLE_LANGUAGES;
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly document = inject(DOCUMENT);
  private unlockBodyScroll: (() => void) | null = null;

  @HostBinding('class.is-closing') isClosing = false;

  ngOnInit(): void {
    if (!this.isBrowser) return;
    this.unlockBodyScroll = lockBodyScroll(this.document);
  }

  ngOnDestroy(): void {
    this.unlockBodyScroll?.();
    this.unlockBodyScroll = null;
  }

  @HostListener('document:keydown.escape')
  protected onEscape(): void {
    this.requestClose();
  }

  protected requestClose(): void {
    if (this.isClosing) return;
    this.isClosing = true;
    setTimeout(() => this.closed.emit(), CLOSE_DURATION_MS);
  }

  protected select(code: string): void {
    this.ts.setLang(code);
    this.requestClose();
  }
}
