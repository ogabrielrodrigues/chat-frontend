import { useNavigate, useParams } from "react-router-dom";
import { X, PaperPlaneRight } from "phosphor-react";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { Form } from "@unform/web";
import { FormHandles, SubmitHandler } from "@unform/core";

import Message, { MessageProps } from "../../components/Message";

import "./styles.css";
import Input from "../../components/Input";
import { SocketContext } from "../../contexts/SocketContext";
import { UserContext } from "../../contexts/UserContext";

interface SubmitData {
  message: string;
}

export function Chat() {
  const socket = useContext(SocketContext);
  const navigator = useNavigate();
  const { user, logout } = useContext(UserContext);

  const { room } = useParams();
  const formRef = useRef<FormHandles>(null);
  const messagesRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<MessageProps[]>([]);
  const [lastMessageSended, setLastMessageSended] = useState("");

  const joinInRoom = useCallback(() => {
    socket.emit("join_room", { user: { ...user, room }, room });
  }, [room, user]);

  useEffect(() => {
    // if (!user) {
    //   navigator("/", { replace: true });
    // }

    joinInRoom();
  }, [room, user]);

  const onPrevMessages = useCallback(
    ({ messages }: { messages: MessageProps[] }) => {
      setMessages(messages);

      const lastMessage = messages[messages.length - 1];

      if (lastMessage !== undefined) {
        setLastMessageSended(lastMessage.sendedAt);
      }

      messagesRef.current?.lastElementChild?.scrollIntoView();
    },
    [messages]
  );

  const onMessage = useCallback(
    (message: MessageProps) => {
      setMessages((messages) => [...messages, message]);
      setLastMessageSended(message.sendedAt);

      messagesRef.current?.lastElementChild?.scrollIntoView();
    },
    [messages]
  );

  useEffect(() => {
    socket.on("message", onMessage);
    socket.on("prev_messages", onPrevMessages);

    messagesRef.current?.lastElementChild?.scrollIntoView();

    return () => {
      socket.off("prev_messages", onPrevMessages);
      socket.off("message", onMessage);
    };
  }, [messages]);

  function sendMessage(message: string) {
    const [hrs, scs] = new Date().toLocaleTimeString().split(":");

    socket.emit("message", {
      user: user,
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
        {user && (
          <div className="user-info">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png"
              alt="User image"
            />
            <div className="user-status">
              <strong>{user.username}</strong>
              <div className={`status ${user ? "online" : "offline"}`}>
                {user ? "Online" : "Offline"}
              </div>
            </div>
          </div>
        )}

        <button className="close-chat" onClick={logout}>
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
              loggedUser={user?.id!}
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
