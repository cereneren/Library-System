// i18n.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';

export type LangCode = 'en' | 'de' | 'tr';

const LOCALE_MAP: Record<LangCode, string> = {
  en: 'en-EN',
  de: 'de-DE',
  tr: 'tr-TR',
};

@Injectable({ providedIn: 'root' })
export class I18nService {
  private lang$ = new BehaviorSubject<LangCode>(
    (localStorage.getItem('lang') as LangCode) || 'en'
  );

  // public observable for templates/components
  readonly locale$ = this.lang$.pipe(map(l => LOCALE_MAP[l]));

  setLang(code: LangCode) {
    this.lang$.next(code);
  }
}
