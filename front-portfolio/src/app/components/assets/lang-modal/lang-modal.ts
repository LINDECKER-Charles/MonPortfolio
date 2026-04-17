import { Component, HostBinding, HostListener, inject, output } from '@angular/core';
import { AVAILABLE_LANGUAGES, TranslationService } from '../../../services/translation.service';
import { FocusTrapDirective } from '../../../directives/focus-trap.directive';

const CLOSE_DURATION_MS = 200;

@Component({
  selector: 'app-lang-modal',
  imports: [FocusTrapDirective],
  templateUrl: './lang-modal.html',
  styleUrl: './lang-modal.css',
})
export class LangModal {
  readonly close = output<void>();

  protected readonly ts = inject(TranslationService);
  protected readonly languages = AVAILABLE_LANGUAGES;

  @HostBinding('class.is-closing') isClosing = false;

  @HostListener('document:keydown.escape')
  protected onEscape(): void {
    this.requestClose();
  }

  protected requestClose(): void {
    if (this.isClosing) return;
    this.isClosing = true;
    setTimeout(() => this.close.emit(), CLOSE_DURATION_MS);
  }

  protected select(code: string): void {
    this.ts.setLang(code);
    this.requestClose();
  }
}
