import { ColorScheme } from '@mantine/core';
import { translations } from './translations';

export const MESSAGE_STORE = 'ai_assistant_message';
export const SESSION_STORE = 'ai_assistant_session';
export const ASSISTANT_STORE = 'ai_assistant_assistant';
export const SETTINGS_STORE = 'ai_assistant_settings';

export const MAX_TOKEN = 1000;
export const TEAMPERATURE = 0.8;

export const ASSISTANT_INIT = [
  {
    name: 'Assistant #1',
    prompt: translations.DEFAULT_PROMPT.EN,
    model: 'gpt-3.5-turbo',
    temperature: 0.7,
    max_log: 4,
    max_tokens: 800
  }
];

export const SETTINGS_INIT = {
  colorScheme: 'light' as ColorScheme,
  language: 'EN'
};

export const OPENAI_END_POINT = 'https://api.openai.com';

export const USERMAP = {
  user: '👨‍💻‍',
  assistant: '🤖',
  system: '🕸'
};
