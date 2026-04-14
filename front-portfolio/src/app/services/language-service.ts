import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { DOCUMENT, inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { catchError, of } from 'rxjs';

export interface AppLanguage {
  code: string;
  label: string;
}

const STORAGE_KEY = 'portfolio.language';
const I18N_BASE_PATH = '/version/i18n';

type TranslationDictionary = Record<string, string>;

const FALLBACK_FR_DICTIONARY: TranslationDictionary = {
  'nav.home': 'Accueil',
  'nav.projects': 'Projets',
  'nav.works': 'Parcours',
  'brand.role': 'Développeur / Formateur',
  'language.button': 'Langue',
  'language.modal.title': 'Choisir une langue',
  'language.modal.subtitle': 'Préférence sauvegardée localement',
  'language.modal.close': 'Fermer',
};

const AVAILABLE_LANGUAGES: AppLanguage[] = [
  { code: 'fr', label: 'Français' },
  { code: 'en', label: 'English' },
  { code: 'de', label: 'Deutsch' },
  { code: 'es', label: 'Español' },
  { code: 'it', label: 'Italiano' },
  { code: 'pt', label: 'Português' },
  { code: 'ru', label: 'Русский' },
  { code: 'ja', label: '日本語' },
  { code: 'zh', label: '中文' },
  { code: 'ar', label: 'العربية' },
];

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly document = inject(DOCUMENT);
  private readonly http = inject(HttpClient);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  readonly languages: AppLanguage[] = AVAILABLE_LANGUAGES;
  readonly currentLanguage = signal<AppLanguage>(AVAILABLE_LANGUAGES[0]);

  private readonly dictionaries = signal<Record<string, TranslationDictionary>>({
    fr: FALLBACK_FR_DICTIONARY,
  });

  constructor() {
    this.initializeLanguage();
  }

  setLanguage(code: string): void {
    const selected = this.languages.find((lang) => lang.code === code) ?? AVAILABLE_LANGUAGES[0];
    this.currentLanguage.set(selected);

    if (this.isBrowser) {
      localStorage.setItem(STORAGE_KEY, selected.code);
    }

    this.document.documentElement.lang = selected.code;
    this.document.documentElement.dir = selected.code === 'ar' ? 'rtl' : 'ltr';

    this.ensureDictionaryLoaded(selected.code);
  }

  t(key: string): string {
    const langCode = this.currentLanguage().code;
    const dictionaries = this.dictionaries();

    return dictionaries[langCode]?.[key] ?? dictionaries['fr']?.[key] ?? key;
  }

  private initializeLanguage(): void {
    if (!this.isBrowser) {
      this.setLanguage('fr');
      return;
    }

    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && this.languages.some((lang) => lang.code === saved)) {
      this.setLanguage(saved);
      return;
    }

    const browserCode = navigator.language.toLowerCase().split('-')[0];
    const matched = AVAILABLE_LANGUAGES.find((lang) => lang.code === browserCode);
    this.setLanguage(matched?.code ?? 'fr');
  }

  private ensureDictionaryLoaded(languageCode: string): void {
    if (this.dictionaries()[languageCode]) {
      return;
    }

    this.http
      .get<TranslationDictionary>(`${I18N_BASE_PATH}/${languageCode}.json`)
      .pipe(catchError(() => of({})))
      .subscribe((dictionary) => {
        this.dictionaries.update((state) => ({
          ...state,
          [languageCode]: dictionary,
        }));
      });
  }
}
