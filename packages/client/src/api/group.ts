import { handleResponse } from "./utils";

export type Group = {
  _id: string;
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

export async function listAllGroupsByModerator(token: string, userId: string) {
  try {
    const response = await fetch(`/api/groups/by/${userId}`, {
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
  id: string,
  token: string,
  params: CreateGroupParams
): Promise<Group> {
  try {
    const response = await fetch(`/api/groups/by/${id}`, {
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

type DeleteGroupParams = { _id: string };

export async function deleteGroup(
  token: string,
  params: DeleteGroupParams,
): Promise<Group> {
  try {
    const response = await fetch(`/api/groups/${params._id}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return await handleResponse<Group>(response);
  } catch (error) {
    console.error(error.message || error);
    throw error;
  }
}
