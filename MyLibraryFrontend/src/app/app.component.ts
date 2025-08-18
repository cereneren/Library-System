
import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';


/* ✅ Top-level types — NOT inside the class */
type LangCode = 'en' | 'de' | 'tr';

interface Language {
  value: LangCode;
  label: string;
  native: string;
  flag: string;
}

const LANG_KEY = 'lang';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  supportedLangs: LangCode[] = ['en', 'de', 'tr'];
  currentLang: LangCode = 'en';

  langTop = 875;    // px from top
  langRight = 10;  // px from right

  languages: Language[] = [
    { value: 'en', label: 'EN',  native: 'English(UK)',  flag: 'gb' },
    { value: 'de', label: 'DE',   native: 'Deutsch',   flag: 'germany' },
    { value: 'tr', label: 'TR',    native: 'Türkçe',     flag: 'turkey' },
  ];

  constructor(private translate: TranslateService, public router: Router) {
    this.translate.addLangs(this.supportedLangs);
    this.translate.setDefaultLang('en');

    const saved = localStorage.getItem(LANG_KEY) as LangCode | null;
    const start = saved && this.supportedLangs.includes(saved) ? saved : 'en';
    this.currentLang = start;
    this.translate.use(start);
  }

  /* for the button label (flag + text) */
  get current(): Language {
    return this.languages.find(l => l.value === this.currentLang)!;
  }

  setLang(code: LangCode) {
    if (this.currentLang === code) return;
    this.currentLang = code;
    this.changeLang(code);
  }

  changeLang(code: LangCode) {
    this.translate.use(code);
    localStorage.setItem(LANG_KEY, code);
  }

  isLoginPage(): boolean {
    return this.router.url === '/login';
  }
}
