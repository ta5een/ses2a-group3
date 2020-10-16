import React, { useEffect, useState } from "react";
import { useLocation, Redirect } from "react-router-dom";

// import { AuthApi, UserApi } from "../../api";
import RegistrationContext, {
  CurrentProgress,
  RegistrationDetails,
} from "../../context/register-context";
import { Account, Interests, ProfileImage, Summary } from "./steps";

type RegisterProps = {
  setIsSignedIn: (_: boolean) => void;
};

const Register = ({ setIsSignedIn }: RegisterProps) => {
  useEffect(() => {
    document.title = "Group Interest – Register";
  });

  const location = useLocation<{ from: { pathname: string } }>();
  const { from } = location.state || { from: { pathname: "/" } };

  const [progress, _setCurrentProgress] = useState(CurrentProgress.ACCOUNT);
  const [details, _setRegistrationDetails] = useState<RegistrationDetails>({});

  const setCurrentProgress = (progress: CurrentProgress) => {
    _setCurrentProgress(progress);
  };

  const setRegistrationDetails = (newDetails: RegistrationDetails) => {
    _setRegistrationDetails({ ...details, ...newDetails });
  };

  const defaultInterests = ["Java", "C++", "Game Development", "Linux"].sort();

  const currentComponent = () => {
    switch (progress) {
      case CurrentProgress.PROFILE_IMAGE:
        return <ProfileImage />;
      case CurrentProgress.INTERESTS:
        return <Interests interests={details.interests || defaultInterests} />;
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

  // type Outcome = { didFail: boolean; message?: string };
  // const [outcome, setOutcome] = useState<Outcome>({ didFail: false });
  const [redirectToReferrer /* setRedirectToReferrer */] = useState(false);

  // Update header to display user actions if successfully signed in
  useEffect(() => {
    return setIsSignedIn(redirectToReferrer);
  }, [setIsSignedIn, redirectToReferrer]);

  if (redirectToReferrer) {
    return <Redirect to={from} />;
  }

  return (
    <RegistrationContext.Provider
      value={{
        currentProgress: progress,
        registrationDetails: details,
        setCurrentProgress,
        setRegistrationDetails,
      }}>
      {currentComponent()}
    </RegistrationContext.Provider>
  );
};

export default Register;
