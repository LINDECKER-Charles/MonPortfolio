import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { DOCUMENT, inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { catchError, of } from 'rxjs';

export interface AppLanguage {
  code: string;
  label: string;
  troll?: boolean;
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

const REAL_LANGUAGES: AppLanguage[] = [
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

const TROLL_LANGUAGES: AppLanguage[] = [
  { code: 'binary', label: 'Binary — 01001000 01100101 01101100 01101100 01101111', troll: true },
  { code: 'beefsteak', label: 'Beefsteak', troll: true },
  { code: 'lorem', label: 'Lorem Ipsum', troll: true },
  { code: 'elden', label: 'Elden Script', troll: true },
  { code: 'hunter', label: 'Hunter’s Tongue', troll: true },
  { code: 'machine', label: 'Machine Code', troll: true },
  { code: 'php-legacy', label: 'Legacy PHP', troll: true },
  { code: 'docker', label: 'Docker Compose', troll: true },
  { code: 'regex', label: 'Regex', troll: true },
  { code: 'min-js', label: 'Minified JavaScript', troll: true },
  { code: 'uwu', label: 'UwU Language', troll: true },
];

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly document = inject(DOCUMENT);
  private readonly http = inject(HttpClient);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  readonly languages: AppLanguage[] = [...REAL_LANGUAGES, ...TROLL_LANGUAGES];
  readonly currentLanguage = signal<AppLanguage>(REAL_LANGUAGES[0]);

  private readonly dictionaries = signal<Record<string, TranslationDictionary>>({
    fr: FALLBACK_FR_DICTIONARY,
  });

  constructor() {
    this.initializeLanguage();
  }

  setLanguage(code: string): void {
    const selected = this.languages.find((lang) => lang.code === code) ?? REAL_LANGUAGES[0];
    this.currentLanguage.set(selected);

    if (this.isBrowser) {
      localStorage.setItem(STORAGE_KEY, selected.code);
    }

    this.document.documentElement.lang = selected.code;
    this.document.documentElement.dir = selected.code === 'ar' ? 'rtl' : 'ltr';

    this.ensureDictionaryLoaded(this.getDictionaryLanguageCode(selected.code));
  }

  t(key: string): string {
    const current = this.currentLanguage();
    const dictionaryCode = this.getDictionaryLanguageCode(current.code);

    const dictionaries = this.dictionaries();
    const localized = dictionaries[dictionaryCode]?.[key] ?? dictionaries['fr']?.[key] ?? key;

    if (!current.troll) {
      return localized;
    }

    return this.applyTrollDialect(current.code, localized);
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
    const matched = REAL_LANGUAGES.find((lang) => lang.code === browserCode);
    this.setLanguage(matched?.code ?? 'fr');
  }

  private getDictionaryLanguageCode(languageCode: string): string {
    return REAL_LANGUAGES.some((lang) => lang.code === languageCode) ? languageCode : 'fr';
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

  private applyTrollDialect(code: string, text: string): string {
    switch (code) {
      case 'binary':
        return text
          .split('')
          .map((char) => char.charCodeAt(0).toString(2).padStart(8, '0'))
          .join(' ');
      case 'beefsteak':
        return `🥩 ${text.toUpperCase().replace(/[AEIOU]/g, 'E')} 🥩`;
      case 'lorem':
        return `Lorem ${text} ipsum dolor sit amet.`;
      case 'elden':
        return `⟢ ${text} · O Tarnished One ⟣`;
      case 'hunter':
        return `${text}, good hunter.`;
      case 'machine':
        return `[SYS_OK] ${text} :: EXECUTED`;
      case 'php-legacy':
        return `$lang = "${text}"; // TODO: refactor in PHP 5.6`;
      case 'docker':
        return `services:\n  locale:\n    image: ${text.toLowerCase().replace(/\s+/g, '-')}`;
      case 'regex':
        return `/${text.replace(/\s+/g, '\\s+')}/gi`;
      case 'min-js':
        return `(()=>"${text.replace(/\s+/g, '')}")()`;
      case 'uwu':
        return text
          .replace(/[rl]/gi, 'w')
          .replace(/na/gi, 'nya')
          .replace(/!$/g, '!! >w<');
      default:
        return text;
    }
  }
}
