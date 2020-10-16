import validator, { Validity, Validations } from "./validator";

type SimpleForm = Record<SimpleFormInput, string>;
type SimpleFormInput = "a" | "b" | "c";
type SimpleFormError = "Not 123" | "Not 456" | "Not 789";

type SimpleFormValidity = Validity<SimpleFormError>;
type SimpleFormValidations = Validations<SimpleFormInput, SimpleFormError>;

const simpleValidator = (form: SimpleForm) => {
  let a: SimpleFormValidity = { isValid: false };
  let b: SimpleFormValidity = { isValid: false };
  let c: SimpleFormValidity = { isValid: false };

  form.a === "123" ? (a.isValid = true) : (a.error = "Not 123");
  form.b === "456" ? (b.isValid = true) : (b.error = "Not 456");
  form.c === "789" ? (c.isValid = true) : (c.error = "Not 789");

  return { a, b, c };
};

it("validates a simple form with valid input", () => {
  const form = { a: "123", b: "456", c: "789" };
  const validation = validator.validate(simpleValidator, form);
  const isValid = validator.isValid(validation);

  expect(validation).toStrictEqual<SimpleFormValidations>({
    a: { isValid: true },
    b: { isValid: true },
    c: { isValid: true },
  });

  expect(isValid).toBe(true);
});

it("invalidates an empty simple form", () => {
  const form = { a: "", b: "", c: "" };
  const validation = validator.validate(simpleValidator, form);
  const isValid = validator.isValid(validation);

  expect(validation).toStrictEqual<SimpleFormValidations>({
    a: { isValid: false, error: "Not 123" },
    b: { isValid: false, error: "Not 456" },
    c: { isValid: false, error: "Not 789" },
  });

  expect(isValid).toBe(false);
});

it("invalidates a simple form with invalid input", () => {
  const form = { a: "abc", b: "def", c: "ghi" };
  const validation = validator.validate(simpleValidator, form);
  const isValid = validator.isValid(validation);

  expect(validation).toStrictEqual<SimpleFormValidations>({
    a: { isValid: false, error: "Not 123" },
    b: { isValid: false, error: "Not 456" },
    c: { isValid: false, error: "Not 789" },
  });

  expect(isValid).toBe(false);
});

it("invalidates a simple form with invalid input for a", () => {
  const form = { a: "abc", b: "456", c: "789" };
  const validation = validator.validate(simpleValidator, form);
  const isValid = validator.isValid(validation);

  expect(validation).toStrictEqual<SimpleFormValidations>({
    a: { isValid: false, error: "Not 123" },
    b: { isValid: true },
    c: { isValid: true },
  });

  expect(isValid).toBe(false);
});

it("invalidates a simple form with invalid input for b", () => {
  const form = { a: "123", b: "def", c: "789" };
  const validation = validator.validate(simpleValidator, form);
  const isValid = validator.isValid(validation);

  expect(validation).toStrictEqual<SimpleFormValidations>({
    a: { isValid: true },
    b: { isValid: false, error: "Not 456" },
    c: { isValid: true },
  });

  expect(isValid).toBe(false);
});

it("invalidates a simple form with invalid input for c", () => {
  const form = { a: "123", b: "456", c: "ghi" };
  const validation = validator.validate(simpleValidator, form);
  const isValid = validator.isValid(validation);

  expect(validation).toStrictEqual<SimpleFormValidations>({
    a: { isValid: true },
    b: { isValid: true },
    c: { isValid: false, error: "Not 789" },
  });

  expect(isValid).toBe(false);
});
