class i18n {
  constructor() {
    this._locale = null;
    this._fallback_locale = 'en';
    this._locales = {};
  }

  setLocale(locale) {
    this._locale = locale;

    return this;
  }

  setFallbackLocale(fallback_locale) {
    this._fallback_locale = fallback_locale;

    return this;
  }

  addLocale(locale, translations) {
    this._locales[locale] = translations;

    return this;
  }

  currentLocale() {
    if (this._locale !== null) {
      return this._locale;
    }

    const languages = navigator.languages;

    for (let i = 0; i < languages.length; i++) {
      let language = languages[i];

      if (language.indexOf('-') !== -1) {
        language = language.split('-')[0];
      }

      if (typeof this._locales[language] !== "undefined") {
        return language;
      }
    }

    return this._fallback_locale;
  }

  __(key, replace = [], locale = null) {
    locale = locale !== null
      ? locale
      : this.currentLocale();

    let str = key;

    if (typeof this._locales[locale] !== "undefined"
      && typeof this._locales[locale][key] !== "undefined"
    ) {
      str = this._locales[locale][key];
    } else if (typeof this._locales[this._fallback_locale] !== "undefined"
      && typeof this._locales[this._fallback_locale][key] !== "undefined"
    ) {
      str = this._locales[this._fallback_locale][key];
    }

    Object.keys(replace).forEach((key) => {
      str = str.replace(`:${key}`, replace[key]);
    });

    return str;
  }
}

const instance = new i18n();

export default instance;
