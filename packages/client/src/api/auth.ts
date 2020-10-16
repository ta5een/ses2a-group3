import { Outcome } from "./utils";

export type LoginDetails = { email: string; password: string };
export type LoginData = { _id: string; token: string };
export type LoginResponse = Outcome<LoginData, string>;

export async function signIn(
  loginDetails: LoginDetails
): Promise<LoginResponse> {
  try {
    const response = await fetch("/api/auth/sign-in", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(loginDetails),
    });

    const statusCode = response.status.toString();
    if (statusCode.startsWith("2")) {
      const {
        token,
        user: { _id },
      } = await response.json();
      return { type: "Success", data: { _id, token } };
    } else {
      // TODO: Handle when user is not connected to the server/internet
      let { message } = await response.json();
      console.log(`An error occurred when signing in: ${message}`);

      if (statusCode.startsWith("5")) {
        return {
          type: "Error",
          error: "A server error occurred. Please try again later",
        };
      } else {
        return {
          type: "Error",
          error: message || "Something unexpected happened. Please try again",
        };
      }
    }
  } catch (error) {
    console.error(`An error occurred when signing in: ${error}`);
    return {
      type: "Error",
      error:
        "We're having trouble signing you in. Please try again at a later time.",
    };
  }
}

export type LogoutResponse = Outcome<void, string>;

export async function signOut(): Promise<LogoutResponse> {
  try {
    let response = await fetch("/api/auth/sign-out", { method: "GET" });
    const { message } = await response.json();
    console.log(message);
    return { type: "Success", data: null };
  } catch (error) {
    console.error(`Failed to log out: ${error}`);
    return { type: "Error", error };
  }
}

export type Authentication = {
  isAuthenticated: boolean;
  id?: string;
  token?: string;
};

export function authentication(): Authentication {
  if (typeof window === "undefined") {
    return { isAuthenticated: false };
  }

  const id = sessionStorage.getItem("id");
  const token = sessionStorage.getItem("jwt");

  if (id && token) {
    return { isAuthenticated: true, id, token };
  } else {
    return { isAuthenticated: false };
  }
}

type AuthenticateParams = { id: string; token: string };

export function authenticate(params: AuthenticateParams, callback: () => void) {
  if (typeof window === "undefined") {
    console.error("Failed to authenticate user");
    return;
  }

  sessionStorage.setItem("id", params.id);
  sessionStorage.setItem("jwt", params.token);
  callback();
}

export async function clearJwt(callback: () => void) {
  if (typeof window === "undefined") {
    console.error("Failed to clear jwt");
    return;
  }

  sessionStorage.removeItem("jwt");
  const response = await signOut();

  if (response.type === "Success") {
    document.cookie = "t=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    callback();
  } else {
    console.log(response.error);
    return;
  }
}

export default { signIn, signOut, authentication, authenticate, clearJwt };
