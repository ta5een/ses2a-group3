import { loginFormValidator, LoginFormValidations } from "./Login";
import validator from "../utils/validator";

it("validates a Login form with valid input", () => {
  const form = {
    email: "john.smith@email.com",
    password: "my-secret-password-123",
  };

  const validation = validator.validate(loginFormValidator, form);
  const isValid = validator.isValid(validation);

  expect(validation).toStrictEqual<LoginFormValidations>({
    email: { isValid: true },
    password: { isValid: true },
  });

  expect(isValid).toBe(true);
});

it("invalidates an empty Login form", () => {
  const form = {
    email: "",
    password: "",
  };

  const validation = validator.validate(loginFormValidator, form);
  const isValid = validator.isValid(validation);

  expect(validation).toStrictEqual<LoginFormValidations>({
    email: { isValid: false, error: "Please provide your email" },
    password: { isValid: false, error: "Please provide your password" },
  });

  expect(isValid).toBe(false);
});

it("invalidates a Login form with missing email", () => {
  const form = {
    email: "",
    password: "my-secret-password-123",
  };

  const validation = validator.validate(loginFormValidator, form);
  const isValid = validator.isValid(validation);

  expect(validation).toStrictEqual<LoginFormValidations>({
    email: { isValid: false, error: "Please provide your email" },
    password: { isValid: true },
  });

  expect(isValid).toBe(false);
});

it("invalidates a Login form with invalid email", () => {
  const form = {
    email: "this is not an email",
    password: "my-secret-password-123",
  };

  const validation = validator.validate(loginFormValidator, form);
  const isValid = validator.isValid(validation);

  expect(validation).toStrictEqual<LoginFormValidations>({
    email: { isValid: false, error: "Invalid email" },
    password: { isValid: true },
  });

  expect(isValid).toBe(false);
});

it("invalidates a Login form with missing password", () => {
  const form = {
    email: "john.smith@email.com",
    password: "",
  };

  const validation = validator.validate(loginFormValidator, form);
  const isValid = validator.isValid(validation);

  expect(validation).toStrictEqual<LoginFormValidations>({
    email: { isValid: true },
    password: { isValid: false, error: "Please provide your password" },
  });

  expect(isValid).toBe(false);
});
