import { handleResponse } from "./utils";

export type CreateUserParams = {
  name: string;
  email: string;
  password: string;
  interests: string[];
};
export type CreateUserResult = { _id: string };

export async function createUser(
  user: CreateUserParams
): Promise<CreateUserResult> {
  try {
    const response = await fetch("/api/users", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });

    return await handleResponse<CreateUserResult>(response);
  } catch (error) {
    console.error(error.message || error);
    throw error;
  }
}

export type ReadUserParams = { _id: string; token: string };
export type ReadUserResult = {
  _id: string;
  admin: boolean;
  name: string;
  email: string;
  created: string;
  interests: string[];
};

export async function readUser(
  params: ReadUserParams
): Promise<ReadUserResult> {
  try {
    const response = await fetch(`/api/users/${params._id}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${params.token}`,
      },
    });

    return await handleResponse<ReadUserResult>(response);
  } catch (error) {
    console.error(error.message || error);
    throw error;
  }
}

export type UpdateUserParams = {
  _id: string;
  name?: string;
  email?: string;
  password?: string;
};
export type UpdateUserResult = {
  _id: string;
};

export async function updateUser(
  params: UpdateUserParams
): Promise<UpdateUserResult> {
  try {
    const response = await fetch(`/api/interests/${params._id}`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    });

    return await handleResponse<UpdateUserResult>(response);
  } catch (error) {
    console.error(error.message || error);
    throw error;
  }
}
