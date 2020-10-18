import { createContext } from "react";
import { Authentication } from "api/auth";

export interface AuthContextProps {
  authentication: Authentication;
}

const AuthContext = createContext<AuthContextProps>({
  authentication: { isAuthenticated: false },
});

export default AuthContext;
