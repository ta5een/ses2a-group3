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

export type UpdateInterestParams = {
  _id: string;
  name?: string;
  users?: string[];
  appendedUser?: string;
};
export type UpdateInterestResult = Interest;

export async function updateInterest(
  params: UpdateInterestParams
): Promise<UpdateInterestResult> {
  try {
    const response = await fetch(`/api/interests/${params._id}`, {
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
