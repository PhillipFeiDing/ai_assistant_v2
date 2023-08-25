import { useEffect, useState, KeyboardEvent } from "react";
import chatService from "@/utils/chatService";
import { Markdown } from "../Markdown";
import {
  ActionIcon,
  Loader,
  Textarea,
  useMantineColorScheme,
  Button,
  Popover,
} from "@mantine/core";
import Link from "next/link";
import * as chatStorage from "@/utils/chatStorage";
import { ThemeSwitch } from "../ThemeSwitch";
import { USERMAP } from "@/utils/constant";

import { AssistantSelect } from "../AssistantSelect";
import {
  IconSend,
  IconSendOff,
  IconEraser,
  IconDotsVertical,
} from "@tabler/icons-react";

import { Assistant, MessageList } from "@/types";
import clsx from "clsx";
import { LanguageContext } from "@/utils/languageContext";
import { translations } from "@/utils/translations";

type Props = {
  sessionId: string;
};

export const Message = ({ sessionId }: Props) => {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<MessageList>([]);
  const [assistant, setAssistant] = useState<Assistant>();
  const { colorScheme } = useMantineColorScheme();
  const updateMessage = (msg: MessageList) => {
    setMessage(msg);
    chatStorage.updateMessage(sessionId, msg);
  };
  chatService.actions = {
    onCompleting: (sug) => setSuggestion(sug),
    onCompleted: () => {
      setLoading(false);
    },
  };

  useEffect(() => {
    const session = chatStorage.getSession(sessionId);
    setAssistant(session?.assistant);
    const msg = chatStorage.getMessage(sessionId);
    setMessage(msg);
    if (loading) {
      chatService.cancel();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  const onAssistantChange = (assistant: Assistant) => {
    setAssistant(assistant);
    chatStorage.updateSession(sessionId, {
      assistant: assistant.id,
    });
  };

  const onClear = () => {
    updateMessage([]);
  };
  const onKeyDown = (evt: KeyboardEvent<HTMLTextAreaElement>) => {
    if (evt.keyCode === 13 && !evt.shiftKey) {
      evt.preventDefault();
      onSubmit();
    }
  };

  const setSuggestion = (suggestion: string) => {
    if (suggestion === "") return;
    const len = message.length;
    const lastMessage = len ? message[len - 1] : null;
    let newList: MessageList = [];
    if (lastMessage?.role === "assistant") {
      newList = [
        ...message.slice(0, len - 1),
        {
          ...lastMessage,
          content: suggestion,
        },
      ];
    } else {
      newList = [
        ...message,
        {
          role: "assistant",
          content: suggestion,
        },
      ];
    }
    setMessages(newList);
  };

  const setMessages = (msg: MessageList) => {
    setMessage(msg);
    chatStorage.updateMessage(sessionId, msg);
  };

  const onSubmit = () => {
    if (loading) {
      return chatService.cancel();
    }
    if (!prompt.trim()) return;
    let list: MessageList = [
      ...message,
      {
        role: "user",
        content: prompt,
      },
    ];
    setMessages(list);
    setLoading(true);
    chatService.getStream({
      prompt,
      options: assistant,
      history: list.slice(-assistant?.max_log!),
    });
    setPrompt("");
  };

  return (
    <div className="flex flex-col h-screen w-full">
      <div
        className={clsx([
          "flex",
          "justify-between",
          "items-center",
          "p-4",
          "shadow-sm",
          "h-[6rem]",
        ])}
      >
        <LanguageContext.Consumer>
          {({language}) => (
            <Popover width={100} position="bottom" withArrow shadow="sm">
            <Popover.Target>
              <Button
                size="sm"
                variant="subtle"
                className="px-1"
                rightIcon={<IconDotsVertical size="1rem"></IconDotsVertical>}
              >
                {translations.AI_ASSISTANT[language]}
              </Button>
            </Popover.Target>
            <Popover.Dropdown>
              <Link href="/assistant" className="no-underline text-green-600">
                {translations.MANAGE[language]}
              </Link>
            </Popover.Dropdown>
          </Popover>
          )}
        </LanguageContext.Consumer>
        <AssistantSelect
          value={assistant?.id!}
          onChange={onAssistantChange}
        ></AssistantSelect>
        <ThemeSwitch></ThemeSwitch>
      </div>

      <div
        className={clsx([
          "flex-col",
          "h-[calc(100vh-10rem)]",
          "w-full",
          "overflow-y-auto",
          "rounded-sm",
          "px-8",
        ])}
      >
        {message.map((item, idx) => {
          const isUser = item.role === "user";

          return (
            <div
              key={`${item.role}-${idx}`}
              className={clsx(
                {
                  flex: item.role === "user",
                  "flex-col": item.role === "user",
                  "items-end": item.role === "user",
                },
                "mt-4"
              )}
            >
              <div>
                {USERMAP[item.role]}
                {!isUser && idx === message.length - 1 && loading && (
                  <Loader size="sm" variant="dots" className="ml-2" />
                )}
              </div>
              <div
                className={clsx(
                  {
                    "bg-gray-100": colorScheme === "light",
                    "bg-zinc-700/40": colorScheme === "dark",
                    "whitespace-break-spaces": isUser,
                  },
                  "rounded-md",
                  "shadow-md",
                  "px-4",
                  "py-2",
                  "mt-1",
                  "w-full",
                  "max-w-4xl",
                  "min-h-[3rem]"
                )}
              >
                {isUser ? (
                  <div>{item.content}</div>
                ) : (
                  <Markdown markdownText={item.content}></Markdown>
                )}
              </div>
            </div>
          );
        })}
      </div>
      <div
        className={clsx(
          "flex",
          "items-center",
          "justify-center",
          "self-end",
          "my-4",
          "w-full"
        )}
      >
        <ActionIcon
          className="mr-2"
          disabled={loading}
          onClick={() => onClear()}
        >
          <IconEraser></IconEraser>
        </ActionIcon>
        <LanguageContext.Consumer>
          {
            ({language}) => (<Textarea
              placeholder={translations.USER_PROMPT[language]}
              className="w-3/5"
              value={prompt}
              disabled={loading}
              onKeyDown={(evt) => onKeyDown(evt)}
              onChange={(evt) => setPrompt(evt.target.value)}
            ></Textarea>)
          }
        </LanguageContext.Consumer>
        <ActionIcon color="green" className="ml-2" onClick={() => onSubmit()}>
          {loading ? <IconSendOff /> : <IconSend />}
        </ActionIcon>
      </div>
    </div>
  );
};
