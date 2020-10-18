import { handleResponse } from "./utils";

export type Group = {
  created: string;
  lastUpdated: string;
  moderator: string;
  name: string;
  description: string;
  interests: string[];
  posts: string[];
};

export async function listAllGroups(token: string): Promise<Group[]> {
  try {
    const response = await fetch("/api/groups", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return await handleResponse(response);
  } catch (error) {
    console.error(error.message || error);
    throw error;
  }
}

export type CreateGroupParams = {
  moderator: string;
  name: string;
  description: string;
  interests: string[];
};

export async function createGroup(
  token: string,
  params: CreateGroupParams
): Promise<Group> {
  try {
    const response = await fetch("/api/groups", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(params),
    });

    return await handleResponse<Group>(response);
  } catch (error) {
    console.error(error.message || error);
    throw error;
  }
}
