import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import { Button } from "carbon-components-react";

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
    <div>
      <h1>Settings</h1>
      <div>
        <h2>Account settings</h2>
        <Button kind="danger" onClick={handleAccountDeletion}>
          Delete my account
        </Button>
      </div>
    </div>
  );
};

export default Settings;
