import React from 'react';
import { SETTINGS_INIT } from './constant';

export const LanguageContext = React.createContext({
  language: SETTINGS_INIT.language,
  setLanguage: (language: string) => {}
});
