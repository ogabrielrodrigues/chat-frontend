import { FormHandles, SubmitHandler } from "@unform/core";
import { Form } from "@unform/web";
import { useCallback, useContext, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../../components/Input";
import { UserContext } from "../../contexts/UserContext";
import "./styles.css";

interface SubmitData {
  room: string;
}

function formatRoomCode(room: string) {
  if (room.split(" ").length >= 2) {
    return room.split(" ").join("+").toLocaleLowerCase();
  } else {
    return room.toLocaleLowerCase();
  }
}

export function Rooms() {
  const { user, logout } = useContext(UserContext);
  const navigator = useNavigate();
  const formRef = useRef<FormHandles>(null);

  const handleLogout = useCallback(() => {
    logout();

    window.location.reload();
  }, [logout]);

  const handleSubmit: SubmitHandler<SubmitData> = ({ room }, { reset }) => {
    if (room.trim() === "") {
      reset();
      return;
    }

    navigator(`/chat/${formatRoomCode(room)}`, { replace: true });

    reset();
  };

  return (
    <div className="rooms_app">
      <div className="rooms_wrapper">
        <h1>Join a new Room</h1>

        {user ? (
          <div className="rooms_user">
            <div className="rooms_info">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png"
                alt="User image"
              />

              <strong>{user?.username}</strong>
            </div>
            <button className="rooms_logout" onClick={handleLogout}>
              Logout
            </button>
          </div>
        ) : (
          <div className="rooms_not_user">
            <strong>You are not authenticated...</strong>
            <p>
              to sign or create a new account,
              <button className="rooms_link" onClick={() => navigator("/")}>
                Click here
              </button>
            </p>
          </div>
        )}

        <Form ref={formRef} onSubmit={handleSubmit} className="rooms_form">
          <Input name="room" type="text" placeholder="Room code" />
          <button
            type="submit"
            disabled={user ? false : true}
            className={!user ? "rooms_button_disabled" : ""}
          >
            Join in room
          </button>
        </Form>
      </div>
    </div>
  );
}
