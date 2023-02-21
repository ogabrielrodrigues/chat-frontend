import { useParams } from "react-router-dom";
import { X, PaperPlaneRight } from "phosphor-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Form } from "@unform/web";
import { FormHandles, SubmitHandler } from "@unform/core";

import { Message, MessageProps } from "../../components/Message";

import "./styles.css";
import { io } from "socket.io-client";
import Input from "../../components/Input";

export interface User {
  id: string;
  username: string;
  status: boolean;
  profile: {
    avatarUrl: string;
  };
}

interface SubmitData {
  message: string;
}

const socket = io(import.meta.env.VITE_SOCKET_URL);
socket.on("connect", () => console.log("Socket.io connected."));

export function Chat() {
  const { room, user, id } = useParams();
  const formRef = useRef<FormHandles>(null);
  const messagesRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<MessageProps[]>([]);
  const [lastMessageSended, setLastMessageSended] = useState("");

  const [usr, setUsr] = useState<User>({
    id: String(id),
    username: String(user),
    status: true,
    profile: {
      avatarUrl: "https://randomuser.me/api/portraits/women/55.jpg",
    },
  });

  const joinInRoom = useCallback(() => {
    socket.emit("join_room", { user: usr, room });
  }, [usr, room]);

  useEffect(() => {
    const onPrevMessages = ({ messages }: { messages: MessageProps[] }) => {
      setMessages(messages);
      if (messages) {
        setLastMessageSended(messages[messages.length - 1].sendedAt);
      } else {
        setLastMessageSended("");
      }

      messagesRef.current?.lastElementChild?.scrollIntoView();
    };

    socket.on("prev_messages", onPrevMessages);
    return () => {
      joinInRoom();

      socket.off("prev_messages", onPrevMessages);
    };
  }, [joinInRoom]);

  // @ts-ignore
  useEffect(() => {
    const onMessage = (message: MessageProps) => {
      setMessages((messages) => [...messages, message]);
      setLastMessageSended(message.sendedAt);
    };

    socket.on("message", onMessage);
    messagesRef.current?.lastElementChild?.scrollIntoView();

    return () => socket.off("message", onMessage);
  }, [messages]);

  function sendMessage(message: string) {
    const [hrs, scs] = new Date().toLocaleTimeString().split(":");

    socket.emit("message", {
      user: usr,
      content: message,
      sendedAt: [hrs, scs].join(":"),
      room,
    });
  }

  const handleSubmit: SubmitHandler<SubmitData> = (
    { message }: SubmitData,
    { reset }
  ) => {
    sendMessage(message);

    reset();
  };

  return (
    <div className="app">
      <div className="top">
        <div className="user-info">
          <img src={usr.profile.avatarUrl} alt="User image" />
          <div className="user-status">
            <strong>{usr.username}</strong>
            <div className={`status ${usr.status ? "online" : "offline"}`}>
              {usr.status ? "Online" : "Offline"}
            </div>
          </div>
        </div>

        <button className="close-chat">
          <X />
        </button>
      </div>
      <div id="messages">
        <div className="last-seen">
          {lastMessageSended ? lastMessageSended : ""}
        </div>

        <div className="messages" ref={messagesRef}>
          {messages.map((message, i) => (
            <Message
              user={message.user}
              content={message.content}
              sendedAt={message.sendedAt}
              loggedUser={usr.id}
              key={`${i}-${message.user.id}`}
            />
          ))}
        </div>
      </div>
      <Form ref={formRef} onSubmit={handleSubmit}>
        <div className="input-wrapper">
          <Input name="message" type="text" placeholder="Type your message" />
          <button>
            <PaperPlaneRight />
          </button>
        </div>
      </Form>
    </div>
  );
}
