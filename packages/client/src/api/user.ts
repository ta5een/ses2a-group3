import Utils, { Outcome } from "./utils";
import { signIn, LoginData } from "./auth";

export type RegisterDetails = {
  name: string;
  email: string;
  plainTextPassword: string;
};

export type RegisterResponse = Outcome<LoginData, string>;

export async function createUser(
  user: RegisterDetails
): Promise<RegisterResponse> {
  try {
    const response = await fetch("/api/users", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });

    const statusCode = response.status.toString();
    if (statusCode.startsWith("2")) {
      const loginOutcome = await signIn({
        email: user.email,
        password: user.plainTextPassword,
      });

      return Utils.mapOutcomeError(loginOutcome, _ => {
        return "Failed to login with created account";
      });
    } else {
      const { message } = await response.json();
      console.error(`An error occurred when signing in: ${message}`);

      if (statusCode.startsWith("5")) {
        return {
          type: "Error",
          error: message || "A server error occurred. Please try again later",
        };
      } else {
        return {
          type: "Error",
          error:
            message || "Something unexpected happened. Please try again later",
        };
      }
    }
  } catch (error) {
    console.error(`An error occurred when creating a user: ${error}`);
    return { type: "Error", error: error.message || error };
  }
}

export type ReadUserDetails = {
  id: string;
  token: string;
  // signal: AbortController;
};

export type ReadUserData = {
  _id: string;
  admin: boolean;
  name: string;
  email: string;
  created: string;
};

export type ReadUserResponse = Outcome<ReadUserData, string>;

export async function readUser(
  params: ReadUserDetails
): Promise<ReadUserResponse> {
  try {
    const response = await fetch(`/api/users/${params.id}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${params.token}`,
      },
    });

    const statusCode = response.status.toString();
    if (statusCode.startsWith("2")) {
      const userDetails = await response.json();
      return { type: "Success", data: userDetails };
    } else {
      const { message } = await response.json();
      console.error(`An error occurred when signing in: ${message}`);

      if (statusCode.startsWith("5")) {
        return {
          type: "Error",
          error: message || "A server error occurred. Please try again later",
        };
      } else {
        return {
          type: "Error",
          error:
            message || "Something unexpected happened. Please try again later",
        };
      }
    }
  } catch (error) {
    console.error(`An error occurred when reading user: ${error}`);
    return { type: "Error", error: error.message || error };
  }
}
