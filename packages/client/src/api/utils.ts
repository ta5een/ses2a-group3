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

export type Success<T> = { type: "Success"; data: T };
export type Error<E> = { type: "Error"; error: E };
export type Outcome<T, E> = Success<T> | Error<E>;

export function mapOutcomeSuccess<T, U, E>(
  outcome: Outcome<T, E>,
  onSuccess: (data: T) => U
): Outcome<U, E> {
  switch (outcome.type) {
    case "Success":
      return { type: "Success", data: onSuccess(outcome.data) };
    default:
      return outcome;
  }
}

export function mapOutcomeError<T, E, F>(
  outcome: Outcome<T, E>,
  onError: (error: E) => F
): Outcome<T, F> {
  switch (outcome.type) {
    case "Error":
      return { type: "Error", error: onError(outcome.error) };
    default:
      return outcome;
  }
}
