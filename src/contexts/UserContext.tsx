import {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from "react";
import { decode, JwtPayload } from "jsonwebtoken-esm";
import axios from "axios";

type SignUpRequest = {
  username: string;
  email: string;
  password: string;
};

type SignInRequest = Omit<SignUpRequest, "email">;

interface UserContextProviderProps {
  children: ReactNode;
}

export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  active: boolean;
}

interface UserContextProps {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  signUp: ({ username, email, password }: SignUpRequest) => Promise<boolean>;
  signIn: ({ username, password }: SignInRequest) => Promise<boolean>;
  logout: () => void;
}

export const UserContext = createContext({} as UserContextProps);

export function UserContextProvider(props: UserContextProviderProps) {
  const [user, setUser] = useState<User | null>(null);

  async function signUp({ username, email, password }: SignUpRequest) {
    const { status } = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/user`,
      {
        username,
        email,
        password,
      }
    );

    if (status !== 201) {
      return false;
    }

    return true;
  }

  async function signIn({ username, password }: SignInRequest) {
    const { status, data } = await axios.post<{ token: string }>(
      `${import.meta.env.VITE_BACKEND_URL}/auth`,
      {
        username,
        password,
      }
    );

    if (status !== 200) {
      return false;
    }

    const userDecoded = decode(data.token) as JwtPayload;

    if (userDecoded) {
      if (userDecoded.exp! < userDecoded.iat!) {
        return false;
      }

      window.localStorage.setItem("simplewebchat_auth_token", data.token);
      window.localStorage.setItem(
        "simplewebchat_authenticated_user",
        // @ts-ignore
        JSON.stringify(userDecoded.user)
      );

      setUser(userDecoded.user);
    } else {
      return false;
    }

    return true;
  }

  function logout() {
    window.localStorage.removeItem("simplewebchat_auth_token");
    window.localStorage.removeItem("simplewebchat_authenticated_user");

    setUser(null);
  }

  useEffect(() => {
    const getUser = () => {
      const token = localStorage.getItem("simplewebchat_auth_token");

      if (!token) {
        return;
      }

      const { user } = decode(token) as JwtPayload;

      window.localStorage.setItem(
        "simplewebchat_authenticated_user",
        // @ts-ignore
        JSON.stringify(user)
      );

      setUser(user);
    };

    getUser();
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        signUp,
        signIn,
        logout,
      }}
    >
      {props.children}
    </UserContext.Provider>
  );
}
