import {
  invalidNameMessage,
  registrationFormValidator,
  RegFormValidations,
} from "./Account";
import validator from "../../utils/validator";

it("validates a Register form with valid input", () => {
  const form = {
    name: "John Smith",
    email: "john.smith@email.com",
    password: "my-secret-password-123",
    confirmPassword: "my-secret-password-123",
  };

  const validation = validator.validate(registrationFormValidator, form);
  const isValid = validator.isValid(validation);

  expect(validation).toStrictEqual<RegFormValidations>({
    name: { isValid: true },
    email: { isValid: true },
    password: { isValid: true },
    confirmPassword: { isValid: true },
  });

  expect(isValid).toBe(true);
});

it("invalidates an empty Register form", () => {
  const form = {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  };

  const validation = validator.validate(registrationFormValidator, form);
  const isValid = validator.isValid(validation);

  expect(validation).toStrictEqual<RegFormValidations>({
    name: { isValid: false, error: "Please provide your name" },
    email: { isValid: false, error: "Please provide your email" },
    password: { isValid: false, error: "Please provide your password" },
    confirmPassword: {
      isValid: false,
      error: "Please provide your password again",
    },
  });

  expect(isValid).toBe(false);
});

it("invalidates a Register form with missing name", () => {
  const form = {
    name: "",
    email: "john.smith@email.com",
    password: "my-secret-password-123",
    confirmPassword: "my-secret-password-123",
  };

  const validation = validator.validate(registrationFormValidator, form);
  const isValid = validator.isValid(validation);

  expect(validation).toStrictEqual<RegFormValidations>({
    name: { isValid: false, error: "Please provide your name" },
    email: { isValid: true },
    password: { isValid: true },
    confirmPassword: { isValid: true },
  });

  expect(isValid).toBe(false);
});

it("invalidates a Register form with invalid name", () => {
  const form = {
    name: "?28$#@%98)*@9%#@#$(&u5093rw",
    email: "john.smith@email.com",
    password: "my-secret-password-123",
    confirmPassword: "my-secret-password-123",
  };

  const validation = validator.validate(registrationFormValidator, form);
  const isValid = validator.isValid(validation);

  expect(validation).toStrictEqual<RegFormValidations>({
    name: { isValid: false, error: invalidNameMessage },
    email: { isValid: true },
    password: { isValid: true },
    confirmPassword: { isValid: true },
  });

  expect(isValid).toBe(false);
});

it("invalidates a Register form with missing email", () => {
  const form = {
    name: "John Smith",
    email: "",
    password: "my-secret-password-123",
    confirmPassword: "my-secret-password-123",
  };

  const validation = validator.validate(registrationFormValidator, form);
  const isValid = validator.isValid(validation);

  expect(validation).toStrictEqual<RegFormValidations>({
    name: { isValid: true },
    email: { isValid: false, error: "Please provide your email" },
    password: { isValid: true },
    confirmPassword: { isValid: true },
  });

  expect(isValid).toBe(false);
});

it("invalidates a Register form with invalid email", () => {
  const form = {
    name: "John Smith",
    email: "this is not an email",
    password: "my-secret-password-123",
    confirmPassword: "my-secret-password-123",
  };

  const validation = validator.validate(registrationFormValidator, form);
  const isValid = validator.isValid(validation);

  expect(validation).toStrictEqual<RegFormValidations>({
    name: { isValid: true },
    email: { isValid: false, error: "Invalid email" },
    password: { isValid: true },
    confirmPassword: { isValid: true },
  });

  expect(isValid).toBe(false);
});

it("invalidates a Register form with missing password", () => {
  const form = {
    name: "John Smith",
    email: "john.smith@email.com",
    password: "",
    confirmPassword: "my-secret-password-123",
  };

  const validation = validator.validate(registrationFormValidator, form);
  const isValid = validator.isValid(validation);

  expect(validation).toStrictEqual<RegFormValidations>({
    name: { isValid: true },
    email: { isValid: true },
    password: { isValid: false, error: "Please provide your password" },
    confirmPassword: { isValid: true },
  });

  expect(isValid).toBe(false);
});

it("invalidates a Register form with too short password", () => {
  const form = {
    name: "John Smith",
    email: "john.smith@email.com",
    password: "hello",
    confirmPassword: "hello",
  };

  const validation = validator.validate(registrationFormValidator, form);
  const isValid = validator.isValid(validation);

  expect(validation).toStrictEqual<RegFormValidations>({
    name: { isValid: true },
    email: { isValid: true },
    password: {
      isValid: false,
      error: "Your password must have at least 8 characters",
    },
    confirmPassword: { isValid: true },
  });

  expect(isValid).toBe(false);
});

it("invalidates a Register form with missing confirm password", () => {
  const form = {
    name: "John Smith",
    email: "john.smith@email.com",
    password: "my-secret-password-123",
    confirmPassword: "",
  };

  const validation = validator.validate(registrationFormValidator, form);
  const isValid = validator.isValid(validation);

  expect(validation).toStrictEqual<RegFormValidations>({
    name: { isValid: true },
    email: { isValid: true },
    password: { isValid: true },
    confirmPassword: {
      isValid: false,
      error: "Please provide your password again",
    },
  });

  expect(isValid).toBe(false);
});

it("invalidates a Register form with non-matching passwords", () => {
  const form = {
    name: "John Smith",
    email: "john.smith@email.com",
    password: "my-secret-password-123",
    confirmPassword: "my-other-secret-password-123",
  };

  const validation = validator.validate(registrationFormValidator, form);
  const isValid = validator.isValid(validation);

  expect(validation).toStrictEqual<RegFormValidations>({
    name: { isValid: true },
    email: { isValid: true },
    password: { isValid: true },
    confirmPassword: { isValid: false, error: "Passwords don't match" },
  });

  expect(isValid).toBe(false);
});

it("invalidates a Register form with invalid input", () => {
  const form = {
    name: "?28$#@%98)*@9%#@#$(&u5093rw",
    email: "this is not an email",
    password: "hello",
    confirmPassword: "world",
  };

  const validation = validator.validate(registrationFormValidator, form);
  const isValid = validator.isValid(validation);

  expect(validation).toStrictEqual<RegFormValidations>({
    name: { isValid: false, error: invalidNameMessage },
    email: { isValid: false, error: "Invalid email" },
    password: {
      isValid: false,
      error: "Your password must have at least 8 characters",
    },
    confirmPassword: { isValid: false, error: "Passwords don't match" },
  });

  expect(isValid).toBe(false);
});
