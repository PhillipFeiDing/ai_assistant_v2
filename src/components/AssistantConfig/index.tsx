import { EditAssistant } from "@/types";
import React, { FormEvent, useState } from "react";
import { Button, Input, Textarea, NumberInput, Select } from "@mantine/core";
import { IconDeviceFloppy, IconTrash } from "@tabler/icons-react";
const { Wrapper } = Input;

type Props = {
  assistant: EditAssistant;
  save: (data: EditAssistant) => void;
  remove: (id: string) => void;
};

export const AssistantConfig = ({ assistant, save, remove }: Props) => {
  const [data, setData] = useState<EditAssistant>(assistant);

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
        <Wrapper label="模型" description="助理模型">
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
          />
        </Wrapper>

        <Wrapper label="名称" description="助理名称">
          <Input
            type="text"
            variant="filled"
            value={data.name}
            name="name"
            onChange={onChange}
          ></Input>
        </Wrapper>

        <Wrapper label="指令" description="为角色分配的系统指令">
          <Textarea
            variant="filled"
            className="w-full"
            name="prompt"
            value={data.prompt}
            onChange={onChange}
            autosize
            // maxRows={3}
          ></Textarea>
        </Wrapper>

        <Wrapper
          label="创意度"
          variant="filled"
          description="回复的创意度，数值越大，创意度越高"
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
          />
        </Wrapper>

        <Wrapper label="上下文数" description="每次对话记忆的历史对话次数">
          <NumberInput
            type="number"
            variant="filled"
            max={8}
            min={0}
            step={1}
            value={data.max_log}
            name="max_log"
            onChange={(val) => onValueChange(val, "max_log")}
          />
        </Wrapper>

        <Wrapper label="回复长度" description="回复内容的长度限制">
          <NumberInput
            type="number"
            variant="filled"
            max={2000}
            min={50}
            step={50}
            value={data.max_tokens}
            name="max_tokens"
            onChange={(val) => onValueChange(val, "max_tokens")}
          />
        </Wrapper>

        <div className="flex justify-around mt-4">
          <Button type="submit" leftIcon={<IconDeviceFloppy size="1.2rem" />}>
            Save
          </Button>
          {data.id ? (
            <Button
              color="red"
              variant="light"
              leftIcon={<IconTrash size="1.2rem" />}
              onClick={() => remove(data.id as string)}
            >
              Remove
            </Button>
          ) : null}
        </div>
      </form>
    </div>
  );
};
