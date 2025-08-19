import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { I18nService } from './services/i18n.service';

type LangCode = 'en' | 'de' | 'tr';

interface Language {
  value: LangCode;
  label: string;
  native: string;
  flag: string;
}

const LOCALE_MAP: Record<LangCode, string> = {
  en: 'en-GB',   // or 'en-US'
  de: 'de-DE',
  tr: 'tr-TR',
};

const LANG_KEY = 'lang';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  // ⬇⬇ these were missing
  langTop = 875;     // px from top
  langRight = 10;    // px from right

  languages: Language[] = [
    { value: 'en', label: 'EN', native: 'English (UK)', flag: 'gb' },
    { value: 'de', label: 'DE', native: 'Deutsch',      flag: 'germany' },
    { value: 'tr', label: 'TR', native: 'Türkçe',       flag: 'turkey' },
  ];

  supportedLangs: LangCode[] = ['en', 'de', 'tr'];
  currentLang: LangCode = 'en';

  constructor(private translate: TranslateService, public router: Router,  private i18n: I18nService) {
    this.translate.addLangs(this.supportedLangs);
    this.translate.setDefaultLang('en');

    const saved = (localStorage.getItem(LANG_KEY) as LangCode) || 'en';
    this.currentLang = this.supportedLangs.includes(saved) ? saved : 'en';
    this.translate.use(this.currentLang);

    // keep currentLang in sync when ngx-translate switches
    this.translate.onLangChange.subscribe(e => {
      this.currentLang = e.lang as LangCode;
    });

    this.i18n.setLang(this.currentLang); // initial

      this.translate.onLangChange.subscribe(e => {
        this.currentLang = e.lang as LangCode;
        this.i18n.setLang(this.currentLang); // propagate changes
      });
  }

  get dateLocale(): string {
    return LOCALE_MAP[this.currentLang];
  }

  setLang(code: LangCode) {
    if (this.currentLang === code) return;
    this.currentLang = code;
    this.translate.use(code);
    localStorage.setItem(LANG_KEY, code);
    this.i18n.setLang(code);
  }

  /* for the button label (flag + text) */
  get current(): Language {
    // languages is typed, so l is inferred as Language (no implicit any)
    return this.languages.find(l => l.value === this.currentLang)!;
  }

  isLoginPage(): boolean {
    return this.router.url === '/login';
  }
}
