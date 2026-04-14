import { Pipe, PipeTransform, inject } from '@angular/core';
import { LanguageService } from '../services/language-service';

@Pipe({
  name: 'translate',
  pure: false,
})
export class TranslatePipe implements PipeTransform {
  private readonly languageService = inject(LanguageService);

  transform(key: string): string {
    return this.languageService.t(key);
  }
}
