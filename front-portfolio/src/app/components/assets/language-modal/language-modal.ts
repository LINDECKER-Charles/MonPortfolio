import { Component, output, inject } from '@angular/core';
import { AppLanguage, LanguageService } from '../../../services/language-service';
import { TranslatePipe } from '../../../pipes/translate.pipe';

@Component({
  selector: 'app-language-modal',
  imports: [TranslatePipe],
  templateUrl: './language-modal.html',
  styleUrl: './language-modal.css',
})
export class LanguageModal {
  private readonly languageService = inject(LanguageService);

  readonly closed = output<void>();
  readonly languages = this.languageService.languages;

  protected isCurrentLanguage(code: string): boolean {
    return this.languageService.currentLanguage().code === code;
  }

  protected selectLanguage(language: AppLanguage): void {
    this.languageService.setLanguage(language.code);
    this.closed.emit();
  }

  protected close(): void {
    this.closed.emit();
  }
}
