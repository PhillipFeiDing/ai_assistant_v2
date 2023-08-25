import { EditAssistant } from "@/types";
import React, { FormEvent, useContext, useState } from "react";
import { Button, Input, Textarea, NumberInput, Select } from "@mantine/core";
import { IconDeviceFloppy, IconTrash } from "@tabler/icons-react";
import { LanguageContext } from "@/utils/languageContext";
import { translations } from "@/utils/translations";
const { Wrapper } = Input;

type Props = {
  assistant: EditAssistant;
  save: (data: EditAssistant) => void;
  remove: (id: string) => void;
};

export const AssistantConfig = ({ assistant, save, remove }: Props) => {
  const [data, setData] = useState<EditAssistant>(assistant);
  const language = useContext(LanguageContext).language;

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    save(data);
  };
  const onChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setData({
      ...data,
      [name]: value,
    });
  };
  const onValueChange = (value: number | string | null, name: string) => {
    if (value === "") return;
    setData({
      ...data,
      [name]: value,
    });
  };

  return (
    <div className="w-full flex justify-center">
        <form onSubmit={onSubmit} className="w-full flex flex-col gap-4">
          <Wrapper label={translations.MODEL[language]} description={translations.ASSISTANT_MODEL[language]}>
            <Select
              variant="filled"
              value={data.model}
              data={[
                { value: "gpt-3.5-turbo", label: "gpt-3.5-turbo" },
                { value: "gpt-4", label: "gpt-4" },
              ]}
              onChange={(value) => {
                onValueChange(value, "model");
              }}
              className="mt-1"
            />
          </Wrapper>
  
          <Wrapper label={translations.NAME[language]} description={translations.ASSISTANT_NAME[language]}>
            <Input
              type="text"
              variant="filled"
              value={data.name}
              name="name"
              onChange={onChange}
            ></Input>
          </Wrapper>
  
          <Wrapper label={translations.PROMPT[language]} description={translations.ASSIGN_PROMPT[language]}>
            <Textarea
              variant="filled"
              className="w-full mt-1"
              name="prompt"
              value={data.prompt}
              onChange={onChange}
              autosize
            ></Textarea>
          </Wrapper>
  
          <Wrapper
            label={translations.CREATIVITY[language]} description={translations.ASSIGN_CREATIVITY[language]}
            variant="filled"
          >
            <NumberInput
              type="number"
              variant="filled"
              precision={1}
              max={2}
              min={0}
              step={0.1}
              value={data.temperature}
              name="temperature"
              onChange={(val) => onValueChange(val, "temperature")}
              className="mt-1"
            />
          </Wrapper>
  
          <Wrapper label={translations.LOGS_CONTEXT[language]} description={translations.ASSIGN_LOGS_CONTEXT[language]}>
            <NumberInput
              type="number"
              variant="filled"
              max={8}
              min={0}
              step={1}
              value={data.max_log}
              name="max_log"
              onChange={(val) => onValueChange(val, "max_log")}
              className="mt-1"
            />
          </Wrapper>
  
          <Wrapper label={translations.MAX_RESPONSE_SIZE[language]} description={translations.ASSIGN_MAX_RESPONSE_SIZE[language]}>
            <NumberInput
              type="number"
              variant="filled"
              max={2000}
              min={50}
              step={50}
              value={data.max_tokens}
              name="max_tokens"
              onChange={(val) => onValueChange(val, "max_tokens")}
              className="mt-1"
            />
          </Wrapper>
  
          <div className="flex justify-around mt-4">
            <Button type="submit" leftIcon={<IconDeviceFloppy size="1.2rem" />}>
              {translations.SAVE[language]}
            </Button>
            {data.id ? (
              <Button
                color="red"
                variant="light"
                leftIcon={<IconTrash size="1.2rem" />}
                onClick={() => remove(data.id as string)}
              >
                {translations.REMOVE[language]}
              </Button>
            ) : null}
          </div>
        </form>
      </div>
  );
};
