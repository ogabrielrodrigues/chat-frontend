import { v4 as uuid } from "uuid";
import { useParams } from "react-router-dom";
import { X, PaperPlaneRight } from "phosphor-react";
import { toast, Toaster } from "react-hot-toast";
import { FormEvent, useCallback, useContext, useEffect, useState } from "react";

import { Message, MessageProps } from "../../components/Message";
import { SocketContext } from "../../contexts/SocketContext";

import "./styles.css";

interface User {
  id: string;
  username: string;
  status: boolean;
  profile: {
    avatarUrl: string;
  };
}

export function Chat() {
  const { socket } = useContext(SocketContext);
  const { room, user } = useParams();

  const [messages, setMessages] = useState<MessageProps[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [lastMessageSended, setLastMessageSended] = useState("");

  const [usr, setUsr] = useState<User>({
    id: uuid().split("-")[0],
    status: true,
    username: String(user),
    profile: {
      avatarUrl: "https://randomuser.me/api/portraits/women/55.jpg",
    },
  });

  useEffect(() => {
    socket.connect();

    const ready = (message: { status: string }) => {
      console.log(message.status);

      socket.on("ready", ready);

      return () => {
        socket.off("ready", ready);
      };
    };
  }, [socket]);

  useEffect(() => {
    const onMessageReceived = (message: MessageProps) => {
      setMessages((messages) => [...messages, message]);
      setLastMessageSended(message.sendedAt);
    };

    socket.emit("join", { user: usr, room });

    socket.on("joined", console.log);

    socket.on("replies", onMessageReceived);

    return () => {
      socket.off("joined");
      socket.off("replies", onMessageReceived);
    };
  }, [socket]);

  const sendMessage = useCallback(() => {
    const [hrs, scs] = new Date().toLocaleTimeString().split(":");

    socket.emit("new_message", {
      authorId: usr.id,
      username: usr.username,
      content: newMessage,
      sendedAt: [hrs, scs].join(":"),
      room,
    });

    setNewMessage("");
  }, [socket, newMessage]);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();

    if (newMessage.trim() === "") return;

    sendMessage();
  }

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

        <div className="messages">
          {messages.map((message, i) => (
            <Message
              authorId={message.authorId}
              content={message.content}
              username={message.username}
              sendedAt={message.sendedAt}
              loggedUser={usr.id}
              key={`${i}-${message.authorId}`}
            />
          ))}
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="input-wrapper">
          <input
            type="text"
            placeholder="Type your message"
            onChange={(e) => setNewMessage(e.target.value)}
            value={newMessage}
          />
          <button type="submit">
            <PaperPlaneRight />
          </button>
        </div>
      </form>
      <Toaster />
    </div>
  );
}
