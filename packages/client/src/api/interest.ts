import { handleResponse } from "./utils";

export type Interest = { _id: string; name: string; users: string[] };

export type AllInterestsResult = Interest[];

export async function allInterests(): Promise<AllInterestsResult> {
  try {
    const response = await fetch("/api/interests", { method: "GET" });
    return await handleResponse<AllInterestsResult>(response);
  } catch (error) {
    console.error(error.message || error);
    throw error;
  }
}

export type CreateInterestParams = { name: string; appendedUser: string };
export type CreateInterestResult = Interest;

export async function createInterest(
  params: CreateInterestParams
): Promise<CreateInterestResult> {
  try {
    const response = await fetch("/api/interests", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    });

    return await handleResponse<CreateInterestResult>(response);
  } catch (error) {
    console.error(error.message || error);
    throw error;
  }
}

export type ReadInterestParams = { _id: string };

export async function readInterest(
  params: ReadInterestParams
): Promise<Interest> {
  try {
    const response = await fetch(`/api/interests/${params._id}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    return await handleResponse<Interest>(response);
  } catch (error) {
    console.error(error.message || error);
    throw error;
  }
}

export type UpdateInterestParams = {
  name?: string;
  users?: string[];
  appendedUser?: string;
  removedUser?: string;
};
export type UpdateInterestResult = Interest;

export async function updateInterest(
  id: string,
  token: string,
  params: UpdateInterestParams
): Promise<UpdateInterestResult> {
  try {
    const response = await fetch(`/api/interests/${id}`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(params),
    });

    return await handleResponse<UpdateInterestResult>(response);
  } catch (error) {
    console.error(error.message || error);
    throw error;
  }
}
