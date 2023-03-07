import { FormHandles, SubmitHandler } from "@unform/core";
import { useNavigate } from "react-router-dom";
import { Form } from "@unform/web";
import { useCallback, useContext, useEffect, useRef } from "react";
import { UserContext } from "../../contexts/UserContext";

import "./styles.css";
import Input from "../../components/Input";

interface SubmitSignUp {
  username: string;
  email: string;
  password: string;
}

interface SubmitSignIn {
  username: string;
  password: string;
}

export function Sign() {
  const modalSignUpFormRef = useRef<FormHandles>(null);
  const modalSignInFormRef = useRef<FormHandles>(null);
  const navigator = useNavigate();

  const { signUp, signIn, user } = useContext(UserContext);

  const verifyUser = useCallback(() => {
    if (user) {
      navigator("/rooms");
    }
  }, [user]);

  const handleSignUp: SubmitHandler<SubmitSignUp> = async (
    { username, email, password },
    { reset }
  ) => {
    const response = await signUp({ username, email, password });

    if (response) {
      window.alert("Usuário criado!");
    } else {
      window.alert("Erro!");
    }

    reset();
  };

  const handleSignIn: SubmitHandler<SubmitSignIn> = async (
    { username, password },
    { reset }
  ) => {
    const response = await signIn({ username, password });

    if (response) {
      window.alert("Usuário logado!");
      navigator("/rooms");
    } else {
      window.alert("Erro!");
    }

    reset();
  };

  useEffect(() => {
    verifyUser();
  }, []);

  return (
    <div className="modal_wrapper">
      <main className="modal">
        <div className="sign up">
          <h1>Sign Up</h1>
          <Form ref={modalSignUpFormRef} onSubmit={handleSignUp}>
            <Input
              name="username"
              type="text"
              placeholder="Enter your username"
            />
            <Input name="email" type="email" placeholder="Enter your email" />
            <Input
              name="password"
              type="password"
              placeholder="Enter your password"
            />

            <button className="button_up" type="submit">
              Sign Up
            </button>
          </Form>
        </div>
        <div className="modal_separator"></div>
        <div className="sign in">
          <h1>Sign In</h1>
          <Form ref={modalSignInFormRef} onSubmit={handleSignIn}>
            <Input
              name="username"
              type="text"
              placeholder="Enter your username"
            />
            <Input
              name="password"
              type="password"
              placeholder="Enter your password"
            />

            <button className="button_in" type="submit">
              Sign In
            </button>
          </Form>
        </div>
      </main>
    </div>
  );
}
