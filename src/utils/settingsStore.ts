import { AppSettings } from '@/types';
import { getLocal, setLocal } from './storage';
import { SETTINGS_INIT, SETTINGS_STORE } from './constant';

const getSettings = (): AppSettings => {
  let settings = getLocal(SETTINGS_STORE) as AppSettings;
  if (!settings) {
    settings = SETTINGS_INIT;
    updateSettings(settings);
  }
  return settings;
};

const updateSettings = (settings: AppSettings) => {
  setLocal(SETTINGS_STORE, settings);
};

const store = {
  getSettings,
  updateSettings
};

export default store;
