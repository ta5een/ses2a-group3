import React, { useContext, useState } from "react";
import { Tag } from "carbon-components-react";

import RegistrationContext, {
  CurrentProgress,
} from "context/register";
import { AuthApi, UserApi, InterestApi } from "api";
import { Form } from "components";
import "./Summary.scss";

const Summary = () => {
  const context = useContext(RegistrationContext);
  const registrationDetails = context.registrationDetails;

  type Outcome = { didFail: boolean; message?: string };
  const [outcome, setOutcome] = useState<Outcome>({ didFail: false });
  const [isLoading, setIsLoading] = useState(false);

  const handlePrevious = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    context.setCurrentProgress(CurrentProgress.INTERESTS);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setOutcome({ didFail: false, message: undefined });

    const details = context.registrationDetails;
    const user: UserApi.CreateUserParams = {
      name: details.name,
      email: details.email,
      password: details.password,
      interests: [],
    };

    try {
      const { _id: appendedUser } = await UserApi.createUser(user);
      const selectedInterests = details.interests;
      const allInterests = await InterestApi.allInterests();
      const allInterestsNames = allInterests.map(interest => interest.name);

      // Update existing interests
      allInterests
        .filter(interest => selectedInterests.includes(interest.name))
        .forEach(async interest => {
          await InterestApi.updateInterest({ _id: interest._id, appendedUser });
        });

      // Create new interests
      selectedInterests
        .filter(interest => !allInterestsNames.includes(interest))
        .forEach(async newInterest => {
          const params = { name: newInterest, appendedUser };
          const { _id: interestId } = await InterestApi.createInterest(params);
          return interestId;
        });

      const signInParams = { email: details.email, password: details.password };
      const authenticateParams = await AuthApi.signIn(signInParams);
      AuthApi.authenticate(authenticateParams, () => {
        setOutcome({ didFail: false });
        console.log(AuthApi.authentication());
        context.setRedirectToReferrer(true);
      });
    } catch (error) {
      setIsLoading(false);
      setOutcome({ didFail: true, message: error.message });
    }
  };

  return (
    <Form
      title="Summary"
      caption="Please review the details you have provided"
      submitButtonText="Create account"
      showPreviousButton={true}
      onSubmit={handleSubmit}
      canSubmit={true}
      onPrevious={handlePrevious}
      isError={outcome.didFail}
      errorMessage={outcome.message}
      showInlineLoading={isLoading}
      inlineLoadingText="Creating account..."
      isLoading={isLoading}>
      <table>
        <tbody>
          <tr>
            <td>Name</td>
            <td>{registrationDetails.name}</td>
          </tr>
          <tr>
            <td>Email</td>
            <td>{registrationDetails.email}</td>
          </tr>
          <tr>
            <td>Interests</td>
            <td>
              {registrationDetails.interests.map((interest, i) => (
                <Tag key={i} title="Clear filter" type="cool-gray">
                  {interest}
                </Tag>
              ))}
            </td>
          </tr>
        </tbody>
      </table>
    </Form>
  );
};

export default Summary;
