import Utils, { Outcome } from "./utils";

it("maps a success outcome", () => {
  type MyOutcome = Outcome<number, string>;
  const outcome: MyOutcome = { type: "Success", data: 100 };
  const mappedOutcome = Utils.mapOutcomeSuccess(outcome, n => n * 2);

  expect(mappedOutcome).toStrictEqual<MyOutcome>({
    type: "Success",
    data: 200,
  });
});

it("maps an error outcome", () => {
  type MyOutcome = Outcome<number, string>;
  const outcome: MyOutcome = { type: "Error", error: "Oh no!" };
  const mappedOutcome = Utils.mapOutcomeError(outcome, _ => "Oh dear!");

  expect(mappedOutcome).toStrictEqual<MyOutcome>({
    type: "Error",
    error: "Oh dear!",
  });
});
