import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import en from '../i18n/en.json';
import ar from '../i18n/ar.json';

export type Language = 'en' | 'ar';

const dictionaries: Record<Language, Record<string, string>> = { en, ar };

@Injectable({ providedIn: 'root' })
export class TranslationService {
  private langKey = 'lang';
  private current = new BehaviorSubject<Language>(this.readStored());

  constructor() {
    this.applyDir(this.current.value);
  }

  currentLang() {
    return this.current.asObservable();
  }

  lang(): Language {
    return this.current.value;
  }

  set(lang: Language) {
    localStorage.setItem(this.langKey, lang);
    this.current.next(lang);
    this.applyDir(lang);
  }

  toggle() {
    this.set(this.current.value === 'en' ? 'ar' : 'en');
  }

  instant(key: string): string {
    return dictionaries[this.current.value][key] ?? key;
  }

  private readStored(): Language {
    return localStorage.getItem(this.langKey) === 'ar' ? 'ar' : 'en';
  }

  private applyDir(lang: Language) {
    document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', lang);
  }
}
