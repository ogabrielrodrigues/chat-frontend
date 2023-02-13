import "../styles/message.css";

export interface MessageProps {
  authorId: string;
  username: string;
  content: string;
  sendedAt: string;
  loggedUser: string;
}

export function Message({
  authorId,
  username,
  content,
  sendedAt,
  loggedUser,
}: MessageProps) {
  return (
    <div
      className={`message ${authorId === loggedUser ? "you" : ""}`}
      key={authorId}
    >
      <div className="message-top">
        {username} - {sendedAt}
      </div>
      <div className="message-body">{content}</div>
    </div>
  );
}
