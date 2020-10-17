import React, { useEffect, useState } from "react";
import {
  Button,
  InlineNotification,
  SkeletonText,
  Tag,
  TagSkeleton,
} from "carbon-components-react";
import { Edit16 } from "@carbon/icons-react";

import { AuthApi, InterestApi, UserApi } from "api";
import "./Profile.scss";

type ProfileDetails = {
  name: string;
  email: string;
  created: Date;
  interests: string[];
};

type ProfileTileProps = {
  isLoading: boolean;
  details: ProfileDetails;
};

const ProfileTile = ({ isLoading, details }: ProfileTileProps) => {
  return (
    <div className="profile-page__container">
      <div className="profile-page__container-left">
        <div className="profile-page__avatar-container">
          <img
            className="profile-page__avatar"
            src="https://picsum.photos/400"
            alt="avatar"
          />
        </div>
        <h1>
          {isLoading ? <SkeletonText heading width="150px" /> : details.name}
        </h1>
        <p>{isLoading ? <SkeletonText width="180px" /> : details.email}</p>
        <p>
          {isLoading ? (
            <SkeletonText width="170px" />
          ) : (
            `Joined ${new Date(details.created).toLocaleDateString()}`
          )}
        </p>
        <div className="profile-page__actions">
          <Button
            hasIconOnly
            kind="tertiary"
            renderIcon={Edit16}
            iconDescription="Edit profile"
            tooltipPosition="bottom"
          />
          <Button kind="tertiary">Follow</Button>
        </div>
      </div>
      <div className="profile-page__container-right">
        <h2>Interests</h2>
        <div className="profile-page__container-right__tags">
          {isLoading
            ? [...Array(5).keys()].map((_, i) => <TagSkeleton key={i} />)
            : details.interests.map((interest, i) => (
                <Tag key={i}>{interest}</Tag>
              ))}
        </div>
        <h2>Active groups</h2>
        <p>
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Laborum
          consequatur autem corporis voluptas reiciendis delectus exercitationem
          doloribus aliquid ex ea aspernatur quo numquam quos quia, tenetur
          mollitia enim obcaecati rerum?
        </p>
        <h2>Administered groups</h2>
        <p>
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Laborum
          consequatur autem corporis voluptas reiciendis delectus exercitationem
          doloribus aliquid ex ea aspernatur quo numquam quos quia, tenetur
          mollitia enim obcaecati rerum?
        </p>
      </div>
    </div>
  );
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
    interests: [],
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const readUserParams = { _id: id, token };
        const {
          name,
          email,
          created,
          interests: interestIds,
        } = await UserApi.readUser(readUserParams);
        console.log(new Date(created));

        let interests: string[] = [];
        for (const id of interestIds) {
          interests.push((await InterestApi.readInterest({ id })).name);
        }

        document.title = `Group Interest – ${name}'s Profile`;
        setOutcome({ didFail: false });
        setValues({ name, email, created: new Date(created), interests });
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
        <ProfileTile isLoading={isLoading} details={values} />
      )}
    </div>
  );
};

export default Profile;
