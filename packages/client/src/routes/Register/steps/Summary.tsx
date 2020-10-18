import React, { useContext, useState } from "react";
import { Tag } from "carbon-components-react";

import RegistrationContext, { CurrentProgress } from "context/register";
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
      about: details.about,
      interests: [],
    };

    try {
      // Create user
      await UserApi.createUser(user);
      const { _id, token } = await AuthApi.signIn({
        email: details.email,
        password: details.password,
      });

      const selectedInterests = details.interests;
      const allInterests = await InterestApi.allInterests();
      const allInterestsNames = allInterests.map(interest => interest.name);

      // Update existing interests
      const existingInterests = allInterests
        .filter(interest => selectedInterests.includes(interest.name))
        .map(async interest => {
          return await InterestApi.updateInterest(interest._id, token, {
            appendedUser: _id,
          });
        });

      // Create new interests
      const newInterests = selectedInterests
        .filter(interest => !allInterestsNames.includes(interest))
        .map(async interest => {
          return await InterestApi.createInterest({
            name: interest,
            appendedUser: _id,
          });
        });

      // Resolve all interests
      const pendingRequests = [...existingInterests, ...newInterests];
      const resolvedInterests = await Promise.all(pendingRequests);

      // Update user and authenticate before redirecting
      await UserApi.updateUser(_id, token, { interests: resolvedInterests });
      AuthApi.authenticate({ _id, token }, () => {
        console.log("User successfully authenticated");
        setIsLoading(false);
        setOutcome({ didFail: false });
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
            <td>About</td>
            <td>{registrationDetails.about}</td>
          </tr>
          <tr>
            <td>Interests</td>
            <td>
              <div className="tags">
                {registrationDetails.interests.sort().map((interest, i) => (
                  <Tag key={i} title="Clear filter" type="cool-gray">
                    {interest}
                  </Tag>
                ))}
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </Form>
  );
};

export default Summary;
