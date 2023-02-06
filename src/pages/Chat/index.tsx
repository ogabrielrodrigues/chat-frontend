import "./styles.css";

import { X, PaperPlaneRight } from "phosphor-react";

export function Chat() {
  return (
    <div className="app">
      <div className="top">
        <div className="user-info">
          <img
            src="https://randomuser.me/api/portraits/women/55.jpg"
            alt="User image"
          />
          <div className="user-status">
            <strong>User name</strong>
            <div className="status">Online</div>
          </div>
        </div>

        <button className="close-chat">
          <X />
        </button>
      </div>
      <div id="messages">
        <div className="last-seen">Today - 11:30AM</div>

        <div className="messages">
          <div className="message">
            <div className="message-top">Cecilia - 11:30AM</div>
            <div className="message-body">Teste de implemetação!</div>
          </div>

          <div className="message you">
            <div className="message-top">You - 11:32AM</div>
            <div className="message-body">Wow</div>
          </div>

          <div className="message">
            <div className="message-top">Cecilia - 11:34AM</div>
            <div className="message-body">Try now</div>
          </div>

          <div className="message you">
            <div className="message-top">You - 11:38AM</div>
            <div className="message-body">Let's start</div>
          </div>
          <div className="message">
            <div className="message-top">Cecilia - 11:30AM</div>
            <div className="message-body">Teste de implemetação!</div>
          </div>

          <div className="message you">
            <div className="message-top">You - 11:32AM</div>
            <div className="message-body">Wow</div>
          </div>

          <div className="message">
            <div className="message-top">Cecilia - 11:34AM</div>
            <div className="message-body">Try now</div>
          </div>

          <div className="message you">
            <div className="message-top">You - 11:38AM</div>
            <div className="message-body">Let's start</div>
          </div>
        </div>
      </div>
      <form>
        <div className="input-wrapper">
          <input type="text" placeholder="Type your message" />
          <button type="submit">
            <PaperPlaneRight />
          </button>
        </div>
      </form>
    </div>
  );
}
