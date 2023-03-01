import "jsonwebtoken-esm";
import { User } from "../../contexts/UserContext";

declare module "jsonwebtoken-esm" {
  export interface JwtPayload {
    id: string;
    user: User;
  }
}
