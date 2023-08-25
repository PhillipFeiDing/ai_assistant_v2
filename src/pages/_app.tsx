import "@/styles/globals.css";
import { useEffect, useState } from "react";
import type { AppProps } from "next/app";
import {
  MantineProvider,
  ColorSchemeProvider,
  ColorScheme,
} from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { LanguageContext } from "@/utils/languageContext";
import settingsStore from "@/utils/settingsStore";
export default function App({ Component, pageProps }: AppProps) {
  const [colorScheme, setColorScheme] = useState<ColorScheme>("light");
  const toggleColorScheme = (value?: ColorScheme) => {
    setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));
  };
  const [language, setLanguage] = useState<string>("");

  useEffect(() => {
    const {language} = settingsStore.getSettings()
    setLanguage(language);
  }, [setLanguage])

  return (
    <ColorSchemeProvider
      colorScheme={colorScheme}
      toggleColorScheme={toggleColorScheme}
    >
      <MantineProvider
        theme={{ colorScheme, primaryColor: "green" }}
        withNormalizeCSS
        withGlobalStyles
      >
        <LanguageContext.Provider value={{language, setLanguage: (language) => {
          settingsStore.updateSettings({...settingsStore.getSettings(), language})
          setLanguage(language);
        }}}>
          <Notifications position="top-right" zIndex={2077}></Notifications>
          <Component {...pageProps} />
        </LanguageContext.Provider>
      </MantineProvider>
    </ColorSchemeProvider>
  );
}
