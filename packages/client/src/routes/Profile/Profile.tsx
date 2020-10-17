import React, { useEffect, useState } from "react";
import { InlineNotification } from "carbon-components-react";

import { AuthApi, UserApi } from "../../api";
import "./Profile.scss";

type ProfileDetails = {
  name: string;
  email: string;
  created: Date;
};

type ProfileTileProps = {
  loading: boolean;
  profileDetails: ProfileDetails;
};

const ProfileTile = (_: ProfileTileProps) => {
  return <div className="profile-page__container">{/* TODO... */}</div>;
};

type ProfileProps = {
  id: string;
};

const Profile = ({ id }: ProfileProps) => {
  const { token } = AuthApi.authentication();

  type Outcome = { didFail: boolean; message?: string };
  const [outcome, setOutcome] = useState<Outcome>({ didFail: false });
  const [isLoading, setIsLoading] = useState(true);

  const [values, setValues] = useState<ProfileDetails>({
    name: "",
    email: "",
    created: new Date(),
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const readUserParams = { _id: id, token };
        const { name, email, created } = await UserApi.readUser(readUserParams);
        setOutcome({ didFail: false });
        setValues({ name, email, created: new Date(created) });
      } catch (error) {
        setIsLoading(false);
        setOutcome({ didFail: true, message: error.message });
      }
    };

    fetchUser().then(_ => setIsLoading(false));
  }, [id, token]);

  return (
    <div className="profile-page">
      {outcome.didFail ? (
        <InlineNotification
          hideCloseButton
          lowContrast
          kind="error"
          title="Error:"
          subtitle={outcome.message || "An unknown error occurred"}
        />
      ) : (
        <ProfileTile loading={isLoading} profileDetails={values} />
      )}
    </div>
  );
};

export default Profile;
