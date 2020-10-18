import { createContext } from "react";

export enum CurrentProgress {
  ACCOUNT,
  PROFILE_IMAGE,
  INTERESTS,
  SUMMARY,
}

export interface RegistrationDetails {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  avatar?: Buffer;
  interests?: string[];
}

export interface RegistrationContextProps {
  currentProgress: CurrentProgress;
  registrationDetails: RegistrationDetails;
  redirectToReferrer: boolean;
  setCurrentProgress: (_: CurrentProgress) => void;
  setRegistrationDetails: (_: RegistrationDetails) => void;
  setRedirectToReferrer: (_: boolean) => void;
}

const RegistrationContext = createContext<RegistrationContextProps>({
  currentProgress: CurrentProgress.ACCOUNT,
  registrationDetails: {},
  redirectToReferrer: false,
  setCurrentProgress: _ => {},
  setRegistrationDetails: _ => {},
  setRedirectToReferrer: _ => {},
});

export default RegistrationContext;
