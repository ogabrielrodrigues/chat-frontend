import { User } from "../pages/Chat";
import "../styles/message.css";

export interface MessageProps {
  user: User;
  content: string;
  sendedAt: string;
  loggedUser: string;
}

export function Message({ user, content, sendedAt, loggedUser }: MessageProps) {
  return (
    <div
      className={`message ${user.id === loggedUser ? "you" : ""}`}
      key={user.id}
    >
      <div className="message-top">
        {user.username} - {sendedAt}
      </div>
      <div className="message-body">{content}</div>
    </div>
  );
}
