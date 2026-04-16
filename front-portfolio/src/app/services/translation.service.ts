import { effect, inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export interface Language {
  code: string;
  label: string;
  flag: string;
}

export const AVAILABLE_LANGUAGES: Language[] = [
  { code: 'fr', label: 'Français',              flag: '🇫🇷' },
  { code: 'en', label: 'English',               flag: '🇬🇧' },
  { code: 'es', label: 'Español',               flag: '🇪🇸' },
  { code: 'de', label: 'Deutsch',               flag: '🇩🇪' },
  { code: 'it', label: 'Italiano',              flag: '🇮🇹' },
  { code: 'pt', label: 'Português',             flag: '🇵🇹' },
  { code: 'ja', label: '日本語',                 flag: '🇯🇵' },
  { code: 'zh', label: '中文',                   flag: '🇨🇳' },
  { code: 'ar', label: 'العربية',                flag: '🇸🇦' },
  { code: 'ru', label: 'Русский',               flag: '🇷🇺' },
  { code: 'bin', label: 'Binary',               flag: '🤖' },
  { code: 'lorem', label: 'Lorem Ipsum',        flag: '📜' },
  { code: 'elden', label: 'Elden Script',       flag: '🌑' },
  { code: 'byrgen', label: 'Byrgenwerth Latin', flag: '🩸' },
  { code: 'hunter', label: "Hunter's Tongue",   flag: '🔔' },
  { code: 'asm', label: 'Machine Code',         flag: '⚙️' },
  { code: 'php', label: 'Legacy PHP',           flag: '🐘' },
  { code: 'docker', label: 'Docker Compose',    flag: '🐳' },
  { code: 'regex', label: 'Regex',              flag: '🔍' },
  { code: 'minjs', label: 'Minified JS',        flag: '🗜️' },
  { code: 'yaml', label: 'YAML sacré',          flag: '📐' },
  { code: 'spag', label: 'Spaghetti Code',      flag: '🍝' },
];

const NAMESPACES = ['nav-barre', 'home-resume', 'home-projects', 'home-work', 'projects', 'footer', 'construction', 'opening', 'common', 'resum'] as const;
const DEFAULT_LANG = 'fr';
const STORAGE_KEY = 'lang';

// { lang: { namespace: { key: value } } }
type TranslationCache = Map<string, Record<string, Record<string, string>>>;

@Injectable({ providedIn: 'root' })
export class TranslationService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  private readonly cache: TranslationCache = new Map();

  private readonly _lang = signal<string>(DEFAULT_LANG);
  readonly lang = this._lang.asReadonly();

  readonly languages = AVAILABLE_LANGUAGES;

  // Merged translations: current lang overrides FR baseline
  private readonly _merged = signal<Record<string, Record<string, string>>>({});

  private readonly _isModalOpen = signal(false);
  readonly isLangModalOpen = this._isModalOpen.asReadonly();

  constructor() {
    // Met à jour l'attribut lang du document en réaction au signal
    effect(() => {
      const code = this._lang();
      if (this.isBrowser) {
        document.documentElement.lang = code;
      }
    });
  }

  /** Appelé par APP_INITIALIZER avant le premier rendu */
  async initialize(): Promise<void> {
    if (!this.isBrowser) return;

    const stored = localStorage.getItem(STORAGE_KEY);
    const initialLang =
      stored && AVAILABLE_LANGUAGES.some((l) => l.code === stored) ? stored : DEFAULT_LANG;

    await this.loadLang(DEFAULT_LANG);
    if (initialLang !== DEFAULT_LANG) {
      await this.loadLang(initialLang);
    }
    this._lang.set(initialLang);
    this.applyMerge(initialLang);
  }

  setLang(code: string): void {
    if (!AVAILABLE_LANGUAGES.some((l) => l.code === code)) return;
    if (this.isBrowser) localStorage.setItem(STORAGE_KEY, code);
    void this.loadAndApply(code);
  }

  translate(key: string): string {
    const dot = key.indexOf('.');
    if (dot === -1) return key;
    const ns = key.substring(0, dot);
    const k  = key.substring(dot + 1);
    return this._merged()[ns]?.[k] ?? key;
  }

  openModal():  void { this._isModalOpen.set(true);  }
  closeModal(): void { this._isModalOpen.set(false); }

  // ── Privé ──────────────────────────────────────────────────────────────────

  private async loadAndApply(code: string): Promise<void> {
    await this.loadLang(code);
    this._lang.set(code);
    this.applyMerge(code);
  }

  private async loadLang(lang: string): Promise<void> {
    if (this.cache.has(lang)) return;

    const result: Record<string, Record<string, string>> = {};
    await Promise.all(
      NAMESPACES.map(async (ns) => {
        try {
          const res = await fetch(`/lang/${ns}/${ns}.${lang}.json`);
          result[ns] = res.ok ? ((await res.json()) as Record<string, string>) : {};
        } catch {
          result[ns] = {};
        }
      })
    );
    this.cache.set(lang, result);
  }

  private applyMerge(lang: string): void {
    const fr   = this.cache.get(DEFAULT_LANG) ?? {};
    const curr = lang === DEFAULT_LANG ? fr : (this.cache.get(lang) ?? {});

    const merged: Record<string, Record<string, string>> = {};
    for (const ns of NAMESPACES) {
      merged[ns] = { ...(fr[ns] ?? {}), ...(curr[ns] ?? {}) };
    }
    this._merged.set(merged);
  }
}
