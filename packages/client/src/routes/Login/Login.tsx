import React, { useEffect, useState } from "react";
import { useLocation, Redirect } from "react-router-dom";
import { Checkbox, TextInput } from "carbon-components-react";

import { AuthApi } from "../../api";
import { Form } from "../../components";
import validator, { Validity, Validations } from "../utils/validator";

export type LoginForm = Record<LoginFormInput, string>;
export type LoginFormInput = "email" | "password";
export type LoginFormError = string;

export type LoginFormValidity = Validity<LoginFormError>;
export type LoginFormValidations = Validations<LoginFormInput, LoginFormError>;

export function loginFormValidator(form: LoginForm): LoginFormValidations {
  const regex = /^[A-Z0-9._%+-]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/g;

  let email: LoginFormValidity = { isValid: false };
  let password: LoginFormValidity = { isValid: false };

  if (form.email.length === 0) {
    email.error = "Please provide your email";
  } else if (!regex.test(form.email.trim().toUpperCase())) {
    email.error = "Invalid email";
  } else {
    email.isValid = true;
  }

  if (form.password.length < 8) {
    password.error = "Please provide your password";
  } else {
    password.isValid = true;
  }

  return { email, password };
}

type LoginProps = {
  setIsSignedIn: (_: boolean) => void;
};

const Login = ({ setIsSignedIn }: LoginProps) => {
  useEffect(() => {
    document.title = "Group Interest – Login";
  });

  const location = useLocation<{ from: { pathname: string } }>();
  const { from } = location.state || { from: { pathname: "/" } };

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [, setRememberMe] = useState(false);

  const form = { email, password };
  const validation = validator.validate(loginFormValidator, form);
  const [shouldShowEmailError, setShouldShowEmailError] = useState(false);

  type Outcome = { didFail: boolean; message?: string };
  const [loginOutcome, setLoginOutcome] = useState<Outcome>({ didFail: false });
  const [redirectToReferrer, setRedirectToReferrer] = useState(false);

  // Update header to display user actions if successfully signed in
  useEffect(() => {
    return setIsSignedIn(redirectToReferrer);
  }, [setIsSignedIn, redirectToReferrer]);

  type Event = React.FormEvent<HTMLFormElement>;
  type HandleLoginFn = (e: Event, loginDetails: AuthApi.LoginDetails) => void;
  const handleLogin: HandleLoginFn = async (e, loginDetails) => {
    e.preventDefault();
    const response = await AuthApi.signIn(loginDetails);
    if (response.type === "Success") {
      setLoginOutcome({ didFail: false });

      const { _id: id, token } = response.data;
      AuthApi.authenticate({ id, token }, () => setRedirectToReferrer(true));
    } else {
      setLoginOutcome({ didFail: true, message: response.error });
    }
  };

  if (redirectToReferrer) {
    return <Redirect to={from} />;
  }

  return (
    <Form
      title="Log in"
      caption="Don't have an account?"
      captionLink={{ link: "/register", text: "Create one now" }}
      submitButtonText="Log in"
      canSubmit={validation.email.isValid && validation.password.isValid}
      onSubmit={e => handleLogin(e, { email, password })}
      isError={loginOutcome.didFail}
      errorMessage={loginOutcome.message}>
      <TextInput
        light
        id="email"
        type="email"
        labelText="Email"
        placeholder="Enter your email..."
        invalid={shouldShowEmailError && !validation.email.isValid}
        invalidText={validation.email.error}
        onChange={e => {
          setEmail(e.target.value);
          setShouldShowEmailError(!validation.email.isValid);
          setLoginOutcome({ didFail: false });
        }}
      />
      <TextInput.PasswordInput
        light
        id="password"
        labelText="Password"
        placeholder="Enter your password..."
        onChange={e => {
          setPassword(e.target.value);
          setLoginOutcome({ didFail: false });
        }}
      />
      <Checkbox
        id="remember-me"
        labelText="Remember me"
        onChange={setRememberMe}
      />
    </Form>
  );
};

export default Login;
