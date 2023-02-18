import "./styles.css";
import { v4 as uuid } from "uuid";
import { X, PaperPlaneRight } from "phosphor-react";
import { io } from "../../lib/socketio";
import { FormEvent, useCallback, useEffect, useRef, useState } from "react";

import { Message, MessageProps } from "../../components/Message";
import { useParams } from "react-router-dom";

interface User {
  id: string;
  username: string;
  status: boolean;
}

export function Chat() {
  const { current: socket } = useRef(io.connect());
  const { room, user: usr } = useParams();
  const [messages, setMessages] = useState<MessageProps[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [user, setUser] = useState<User>({
    id: uuid().split("-")[0],
    status: true,
    username: String(usr),
  });

  useEffect(() => {
    const onMessageReceived = (message: MessageProps) => {
      setMessages((messages) => [...messages, message]);
    };

    socket.on("ready", console.log);

    socket.emit("join", room);

    socket.on("joined", (room: string) => console.log("you stay on: %s", room));

    socket.on("replies", onMessageReceived);

    return () => {
      socket.off("replies", onMessageReceived);
    };
  }, [socket]);

  const sendMessage = useCallback(() => {
    const [hrs, scs] = new Date().toLocaleTimeString().split(":");

    socket.emit("new_message", {
      authorId: user.id,
      username: user.username,
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
          <img
            src="https://randomuser.me/api/portraits/women/55.jpg"
            alt="User image"
          />
          <div className="user-status">
            <strong>{user.username}</strong>
            <div className={`status ${user.status ? "online" : "offline"}`}>
              {user.status ? "Online" : "Offline"}
            </div>
          </div>
        </div>

        <button className="close-chat">
          <X />
        </button>
      </div>
      <div id="messages">
        <div className="last-seen">Today - 11:30AM</div>

        <div className="messages">
          {messages.map((message, i) => (
            <Message
              authorId={message.authorId}
              content={message.content}
              username={message.username}
              sendedAt={message.sendedAt}
              loggedUser={user.id}
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
    </div>
  );
}
