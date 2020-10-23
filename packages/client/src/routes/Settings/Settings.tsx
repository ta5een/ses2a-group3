import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import { Button, Modal, ModalWrapper } from "carbon-components-react";

import { AuthApi, InterestApi, UserApi } from "api";

const Settings = () => {
  const [redirectToLogin, setRedirectToLogin] = useState(false);

  const handleAccountDeletion = async () => {
    const { id: _id, token } = AuthApi.authentication();

    try {
      console.log("Removing references from interests...");
      const user = await UserApi.readUser({ _id, token });
      for (const interestId of user.interests) {
        await InterestApi.updateInterest(interestId, token, {
          removedUser: _id,
        });
      }

      console.log("Removing user...");
      const { _id: deletedUser } = await UserApi.deleteUser(_id, token);
      console.log(`Successfully delete user: ${deletedUser}`);

      AuthApi.signOut(() => setRedirectToLogin(true));
    } catch (error) {
      console.error(`Failed to delete user: ${error}`);
    }
  };

  if (redirectToLogin) {
    return <Redirect to="/login" />;
  }

  return (
    <div className="content-container">
      <h1>Settings</h1>
      <div>
        <ModalWrapper
          danger
          buttonTriggerText="Delete my account"
          modalHeading="Are you sure?"
          handleSubmit={() => {
            handleAccountDeletion().then(_ => {
              return true;
            });

            return false;
          }}>
          <p>
            Deleting your account is an <em>IRREVERSIBLE</em> action.
          </p>
        </ModalWrapper>
      </div>
    </div>
  );
};

export default Settings;
