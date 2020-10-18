import { handleResponse } from "./utils";

export type SignInParams = { email: string; password: string };
export type SignInResult = { _id: string; token: string };

export async function signIn(params: SignInParams): Promise<SignInResult> {
  try {
    const response = await fetch("/api/auth/sign-in", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(params),
    });

    return await handleResponse<SignInResult>(response);
  } catch (error) {
    console.error(error.message || error);
    throw error;
  }
}

export type SignOutResult = void;

export async function signOut(callback?: () => void): Promise<SignOutResult> {
  try {
    await fetch("/api/auth/sign-out", { method: "GET" });
    callback && callback();
  } catch (error) {
    console.error(error.message || error);
    throw error;
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

type AuthenticateParams = { _id: string; token: string };

export function authenticate(params: AuthenticateParams, callback: () => void) {
  if (typeof window === "undefined") {
    console.error("Failed to authenticate user");
    return;
  }

  sessionStorage.setItem("id", params._id);
  sessionStorage.setItem("jwt", params.token);
  callback();
}

export async function clearJwt(callback: () => void) {
  if (typeof window === "undefined") {
    console.error("Failed to clear jwt");
    return;
  }

  sessionStorage.removeItem("id");
  sessionStorage.removeItem("jwt");

  try {
    await signOut();
    document.cookie = "t=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    callback();
  } catch (error) {
    console.log(error.message || error);
  }
}

export default { signIn, signOut, authentication, authenticate, clearJwt };
