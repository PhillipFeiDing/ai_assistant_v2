import React, { useEffect, useState } from "react";
import { ActionIcon, Group, Select } from "@mantine/core";
import { IconSun, IconMoon } from "@tabler/icons-react";
import { useMantineColorScheme } from "@mantine/core";
import settingsStore from "@/utils/settingsStore";
import { LanguageContext } from "@/utils/languageContext";

export const ThemeSwitch = () => {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();

  useEffect(() => {
    const {colorScheme} = settingsStore.getSettings()
    toggleColorScheme(colorScheme);
  }, [toggleColorScheme])

  const [icon, setIcon] = useState(<IconSun />);
  useEffect(() => {
    setIcon(colorScheme === "dark" ? <IconSun /> : <IconMoon />);
  }, [colorScheme]);
  return (
    <Group>
      <LanguageContext.Consumer>
        {
          ({language, setLanguage}) => (
            <Select
              className="w-32"
              data={[
                { value: 'EN', label: 'English' },
                { value: 'ZH', label: '简体中文' },
              ]}
              value={language}
              onChange={(value: string) => {
                setLanguage(value);
              }}
            />
          ) 
        }
      </LanguageContext.Consumer>
      <ActionIcon
        variant="subtle"
        size="xs"
        onClick={() =>
          {
            const newColorScheme = colorScheme === "light" ? "dark" : "light";
            settingsStore.updateSettings({...settingsStore.getSettings(), colorScheme: newColorScheme})
            toggleColorScheme(newColorScheme)
          }
        }
      >
        {icon}
      </ActionIcon>
    </Group>
    
  );
};
