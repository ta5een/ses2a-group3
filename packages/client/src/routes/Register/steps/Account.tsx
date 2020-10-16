import React, { useContext, useState } from "react";

import RegistrationContext, {
  CurrentProgress,
} from "../../../context/register-context";
import { Form } from "../../../components";
import validator, { Validity, Validations } from "../../utils/validator";
import { TextInput } from "carbon-components-react";

export const invalidNameMessage =
  "Your name must have at least 3 characters and may only contain valid letters from any language including upper case letters, lower case letters, hyphens or dashes (-/–) or apostrophes (').";

export type RegForm = Record<RegFormInput, string>;
export type RegFormInput = "name" | "email" | "password" | "confirmPassword";
export type RegFormError = string;

export type RegFormValidity = Validity<RegFormError>;
export type RegFormValidations = Validations<RegFormInput, RegFormError>;

export function registrationFormValidator(form: RegForm): RegFormValidations {
  const nameRegex = /^[\p{L}\p{Pd}' ]{3,}$/gu;
  const emailRegex = /^[A-Z0-9._%+-]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/g;

  let name: RegFormValidity = { isValid: false };
  let email: RegFormValidity = { isValid: false };
  let password: RegFormValidity = { isValid: false };
  let confirmPassword: RegFormValidity = { isValid: false };

  if (form.name.length === 0) {
    name.error = "Please provide your name";
  } else if (!nameRegex.test(form.name.trim())) {
    name.error = invalidNameMessage;
  } else {
    name.isValid = true;
  }

  if (form.email.length === 0) {
    email.error = "Please provide your email";
  } else if (!emailRegex.test(form.email.trim().toUpperCase())) {
    email.error = "Invalid email";
  } else {
    email.isValid = true;
  }

  if (form.password.length === 0) {
    password.error = "Please provide your password";
  } else if (form.password.length < 8) {
    password.error = "Your password must have at least 8 characters";
  } else {
    password.isValid = true;
  }

  if (form.confirmPassword.length === 0) {
    confirmPassword.error = "Please provide your password again";
  } else if (
    form.password.length !== 0 &&
    form.confirmPassword !== form.password
  ) {
    confirmPassword.error = "Passwords don't match";
  } else {
    confirmPassword.isValid = true;
  }

  return { name, email, password, confirmPassword };
}

type AccountProps = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const Account = (oldState: AccountProps) => {
  const context = useContext(RegistrationContext);

  const [values, setValues] = useState(oldState);
  const [showErrors, setShowErrors] = useState({
    name: false,
    email: false,
    password: false,
    confirmPassword: false,
  });

  const validation = validator.validate(registrationFormValidator, values);

  const handleContinue = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    context.setRegistrationDetails({ ...values });
    context.setCurrentProgress(CurrentProgress.PROFILE_IMAGE);
  };

  return (
    <Form
      title="Create an account"
      caption="Already have an account?"
      captionLink={{ link: "/login", text: "Log in" }}
      onSubmit={handleContinue}
      canSubmit={
        validation.name.isValid &&
        validation.email.isValid &&
        validation.password.isValid &&
        validation.confirmPassword.isValid
      }>
      <TextInput
        light
        id="name"
        labelText="Name"
        placeholder="Enter your name"
        value={values.name}
        invalid={showErrors.name && !validation.name.isValid}
        invalidText={validation.name.error}
        onChange={e => {
          setValues({ ...values, name: e.target.value });
          setShowErrors({ ...showErrors, name: !validation.name.isValid });
        }}
      />
      <TextInput
        light
        id="email"
        type="email"
        labelText="Email"
        placeholder="Enter your email"
        value={values.email}
        invalid={showErrors.email && !validation.email.isValid}
        invalidText={validation.email.error}
        onChange={e => {
          setValues({ ...values, email: e.target.value });
          setShowErrors({ ...showErrors, email: !validation.email.isValid });
        }}
      />
      <TextInput.PasswordInput
        light
        id="password"
        labelText="Password"
        placeholder="Enter your password"
        value={values.password}
        invalid={showErrors.password && !validation.password.isValid}
        invalidText={validation.password.error}
        onChange={e => {
          setValues({ ...values, password: e.target.value });
          setShowErrors({
            ...showErrors,
            password: !validation.password.isValid,
          });
        }}
      />
      <TextInput.PasswordInput
        light
        id="confirm-password"
        labelText="Confirm password"
        placeholder="Enter your password again"
        value={values.confirmPassword}
        invalid={
          showErrors.confirmPassword && !validation.confirmPassword.isValid
        }
        invalidText={validation.confirmPassword.error}
        onChange={e => {
          setValues({ ...values, confirmPassword: e.target.value });
          setShowErrors({
            ...showErrors,
            confirmPassword: !validation.confirmPassword.isValid,
          });
        }}
      />
    </Form>
  );
};

export default Account;
