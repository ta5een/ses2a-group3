export async function handleResponse<T>(response: Response): Promise<T> {
  const status = response.status.toString();

  if (status.startsWith("2")) {
    return await response.json();
  } else {
    const { message } = await response.json();
    const errorMessage =
      message || status.startsWith("5")
        ? "A server error occurred. Please try again later."
        : "Something unexpected happened. Please try again later.";
    throw new Error(errorMessage);
  }
}
