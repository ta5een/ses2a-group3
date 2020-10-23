import React, { useEffect, useState } from "react";
import { Redirect } from "react-router-dom";
import {
  Button,
  InlineLoading,
  Tabs,
  Tab,
  TextArea,
  TextInput,
  Toggle,
} from "carbon-components-react";

import { AuthApi, InterestApi, UserApi } from "api";
import "./Settings.scss";

const Settings = () => {
  const { id: _id, token } = AuthApi.authentication();

  const [isSubmittingChanges1, setIsSubmittingChanges1] = useState(false);
  const [isFinishedSubmitting1, setFinishedSubmitting1] = useState(false);
  const [isSubmittingChanges2, setIsSubmittingChanges2] = useState(false);
  const [isFinishedSubmitting2, setFinishedSubmitting2] = useState(false);

  const [isAdmin, setIsAdmin] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // const [newAvatar, setNewAvatar] = useState("");
  const [newAbout, setNewAbout] = useState("");
  const aboutWordsLength = newAbout
    .trim()
    .split(/\s/g)
    .filter(s => s.length > 0).length;

  useEffect(() => {
    const fetchUserDetails = async () => {
      const user = await UserApi.readUser({ _id, token });
      return {
        admin: user.admin,
        name: user.name,
        email: user.email,
        about: user.about,
      };
    };

    fetchUserDetails()
      .then(user => {
        setIsAdmin(user.admin);
        setNewName(user.name);
        setNewEmail(user.email);
        setNewAbout(user.about);
      })
      .catch(error => console.error(`Failed to read user: ${error}`));
  }, [_id, token]);

  const [redirectToLogin, setRedirectToLogin] = useState(false);

  const canSubmitNewAccountDetails = () => {
    if (
      currentPassword.length > 0 ||
      newPassword.length > 0 ||
      confirmPassword.length > 0
    ) {
      return (
        currentPassword.length >= 8 &&
        newPassword.length >= 8 &&
        confirmPassword === newPassword
      );
    }

    return true;
  };

  const handleAccountUpdate = async () => {
    try {
      console.log("Updating account details...");
      setIsSubmittingChanges1(true);
      setFinishedSubmitting1(false);

      await UserApi.updateUser(_id, token, {
        admin: isAdmin,
        name: newName === "" ? undefined : newName,
        email: newEmail === "" ? undefined : newEmail,
        password: newPassword === "" ? undefined : newPassword,
      });

      console.log("Done!");
      setIsSubmittingChanges1(false);
      setFinishedSubmitting1(true);
    } catch (error) {
      console.error(`Failed to update user: ${error}`);
    }
  };

  const handlePersonalisationUpdate = async () => {
    try {
      console.log("Updating personalisation details...");
      setIsSubmittingChanges2(true);
      setFinishedSubmitting2(false);

      await UserApi.updateUser(_id, token, { about: newAbout });

      console.log("Done!");
      setIsSubmittingChanges2(false);
      setFinishedSubmitting2(true);
    } catch (error) {
      console.error(`Failed to update user: ${error}`);
    }
  };

  const handleAccountDeletion = async () => {
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

  const inlineLoadingWidth = "167.42px";

  return (
    <div className="content-container">
      <h1>Settings</h1>
      <div className="settings-content">
        <Tabs type="container" tabContentClassName="settings-content__tab">
          <Tab id="account" label="Account">
            <div className="settings-content__inner">
              <Toggle
                id="admin-toggle"
                labelText="Admin"
                labelA="I'm NOT an admin"
                labelB="I'm an admin"
                toggled={isAdmin}
                onToggle={setIsAdmin}
              />
              <TextInput
                light
                id="name"
                labelText="Name"
                placeholder="Enter your new name"
                value={newName}
                onChange={e => setNewName(e.target.value)}
              />
              <TextInput
                light
                id="email"
                labelText="Email"
                placeholder="Enter your new email"
                value={newEmail}
                onChange={e => setNewEmail(e.target.value)}
              />
              <TextInput.PasswordInput
                light
                id="current-password"
                labelText="Current password"
                placeholder="Enter your current password"
                value={currentPassword}
                onChange={e => setCurrentPassword(e.target.value)}
              />
              <TextInput.PasswordInput
                light
                id="new-password"
                labelText="New password"
                placeholder="Enter your new password"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
              />
              <TextInput.PasswordInput
                light
                id="new-password-confirm"
                labelText="Confirm password"
                placeholder="Enter your new password again"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
              />
            </div>
            <div className="settings-content__inner-actions">
              {isSubmittingChanges1 ? (
                <InlineLoading
                  style={{ width: inlineLoadingWidth }}
                  description={"Saving changes..."}
                  status={"active"}
                />
              ) : isFinishedSubmitting1 ? (
                <InlineLoading
                  style={{ width: inlineLoadingWidth }}
                  description={"Saved"}
                  status={"finished"}
                />
              ) : (
                <Button
                  disabled={!canSubmitNewAccountDetails()}
                  onClick={handleAccountUpdate}>
                  Save changes
                </Button>
              )}
            </div>
          </Tab>
          <Tab id="personalisation" label="Personalisation">
            <div className="settings-content__inner">
              <TextArea
                light
                cols={40}
                rows={3}
                id="about-text-area"
                labelText="About"
                helperText={`${aboutWordsLength} words`}
                placeholder="Enter a short description about yourself"
                value={newAbout}
                onChange={e => setNewAbout(e.target.value)}
              />
              <div className="settings-content__inner-actions">
                {isSubmittingChanges2 ? (
                  <InlineLoading
                    style={{ width: inlineLoadingWidth }}
                    description={"Saving changes..."}
                    status={"active"}
                  />
                ) : isFinishedSubmitting2 ? (
                  <InlineLoading
                    style={{ width: inlineLoadingWidth }}
                    description={"Saved"}
                    status={"finished"}
                  />
                ) : (
                  <Button
                    onClick={handlePersonalisationUpdate}
                    disabled={aboutWordsLength < 5}>
                    Save changes
                  </Button>
                )}
              </div>
            </div>
          </Tab>
          <Tab id="account-deletion" label="Account deletion">
            <p className="info-text">
              Deleting your account is an <em>IRREVERSIBLE</em> action.{" "}
            </p>
            <p className="info-text">
              All your details will be removed and you will no longer be able to
              log in with the email and password you provided for this account.
              You will be logged out once the deletion process is complete.
            </p>
            <p className="info-text">
              Are you sure you want to delete your account?
            </p>
            <div className="settings-content__inner-actions">
              <Button kind="danger" onClick={handleAccountDeletion}>
                Yes, delete my account
              </Button>
            </div>
          </Tab>
        </Tabs>
      </div>
    </div>
  );
};

export default Settings;
