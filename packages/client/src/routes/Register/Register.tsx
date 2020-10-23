import React, { useEffect, useState } from "react";
import { useLocation, Redirect } from "react-router-dom";

import RegistrationContext, {
  CurrentProgress,
  RegistrationDetails,
} from "context/register";
import { Account, Interests, Personalization, Summary } from "./steps";

type RegisterProps = {
  setIsSignedIn: (_: boolean) => void;
};

const Register = ({ setIsSignedIn }: RegisterProps) => {
  useEffect(() => {
    document.title = "Group Interest – Register";
  });

  const location = useLocation<{ from: { pathname: string } }>();
  const { from } = location.state || { from: { pathname: "/" } };

  const [progress, setCurrentProgress] = useState(CurrentProgress.ACCOUNT);
  const [details, _setRegistrationDetails] = useState<RegistrationDetails>({
    // name: "John Smith",
    // email: "john.smith@email.com",
    // password: "my-secret-password-123",
    // confirmPassword: "my-secret-password-123",
    // about: "This is a short description of myself.",
  });
  const [redirect, setRedirectToReferrer] = useState(false);

  const setRegistrationDetails = (newDetails: RegistrationDetails) => {
    _setRegistrationDetails({ ...details, ...newDetails });
  };

  const currentComponent = () => {
    switch (progress) {
      case CurrentProgress.PROFILE_IMAGE:
        return <Personalization about={details.about || ""} />;
      case CurrentProgress.INTERESTS:
        return <Interests interests={details.interests} />;
      case CurrentProgress.SUMMARY:
        return <Summary />;
      default:
        return (
          <Account
            name={details.name || ""}
            email={details.email || ""}
            password={details.password || ""}
            confirmPassword={details.confirmPassword || ""}
          />
        );
    }
  };

  // Update header to display user actions if successfully registered
  useEffect(() => {
    return setIsSignedIn(redirect);
  }, [setIsSignedIn, redirect]);

  if (redirect) {
    return <Redirect to={from} />;
  }

  return (
    <RegistrationContext.Provider
      value={{
        currentProgress: progress,
        registrationDetails: details,
        redirectToReferrer: redirect,
        setCurrentProgress,
        setRegistrationDetails,
        setRedirectToReferrer,
      }}>
      {currentComponent()}
    </RegistrationContext.Provider>
  );
};

export default Register;
