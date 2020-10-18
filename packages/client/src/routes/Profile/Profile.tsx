import React, { useEffect, useState } from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";
import {
  Button,
  InlineNotification,
  SkeletonText,
  Tag,
  TagSkeleton,
} from "carbon-components-react";
import { Edit16, Chat16 } from "@carbon/icons-react";

import { AuthApi, GroupApi, InterestApi, UserApi } from "api";
import { Group } from "api/group";
import "./Profile.scss";

type ProfileDetails = {
  name: string;
  email: string;
  created: Date;
  about?: string;
  interests: string[];
};

type ProfileTileProps = {
  isLoading: boolean;
  token: string;
  myId: string;
  isPersonalProfile: boolean;
  details?: ProfileDetails;
};

const ProfileDetails = ({
  // isLoading,
  token,
  isPersonalProfile,
  myId,
  details,
}: ProfileTileProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [groups, setGroups] = useState<Group[]>([]);

  useEffect(() => {
    const fetchGroups = async () => {
      const allGroups = await GroupApi.listAllGroups(token);
      return allGroups.filter(group => group.moderator !== myId);
    };

    fetchGroups()
      .then(groups => {
        setIsLoading(false);
        setGroups(groups);
      })
      .catch(error => {
        console.error(`An error occurred when fetching groups: ${error}`);
      });
  }, []);

  return (
    <div className="profile-page__container">
      <div className="profile-page__container-left">
        <div className="profile-page__avatar-container">
          <img
            draggable={false}
            className="profile-page__avatar"
            src="https://picsum.photos/400"
            alt="avatar"
          />
        </div>
        {isLoading ? (
          <SkeletonText heading width="150px" />
        ) : (
          <h1>{details.name}</h1>
        )}
        {isLoading ? <SkeletonText width="180px" /> : <p>{details.email}</p>}
        {isLoading ? (
          <SkeletonText width="170px" />
        ) : (
          <p>Joined {new Date(details.created).toLocaleDateString()}</p>
        )}
        <div className="profile-page__actions">
          {isPersonalProfile ? (
            <Button
              kind="tertiary"
              renderIcon={Edit16}
              iconDescription="Edit profile"
              tooltipPosition="bottom">
              Edit profile
            </Button>
          ) : (
            <>
              <Button
                hasIconOnly
                kind="tertiary"
                renderIcon={Chat16}
                iconDescription="Send a message"
                tooltipPosition="bottom"
              />
              <Button kind="tertiary">Follow</Button>
            </>
          )}
        </div>
      </div>
      <div className="profile-page__container-right">
        <h2>Interests</h2>
        <div className="profile-page__container-right__tags">
          {isLoading
            ? [...Array(5).keys()].map((_, i) => <TagSkeleton key={i} />)
            : details.interests
                .sort()
                .map((interest, i) => <Tag key={i}>{interest}</Tag>)}
        </div>
        <h2>About</h2>
        {isLoading ? (
          <SkeletonText />
        ) : (
          <p>{details.about || "No description"}</p>
        )}
        <h2>Groups</h2>
        {groups.map((group, i) => (
          <p key={i}>{group.name}</p>
        ))}
      </div>
    </div>
  );
};

type ProfileMatchProps = {
  id: string;
};

const Profile = ({ match }: RouteComponentProps<ProfileMatchProps>) => {
  const { id: myId, token } = AuthApi.authentication();
  const profileId = match.params.id;

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
        const readUserParams = { _id: profileId, token };
        const {
          name,
          email,
          created,
          about,
          interests: interestIds,
        } = await UserApi.readUser(readUserParams);

        let interests: string[] = [];
        for (const _id of interestIds) {
          interests.push((await InterestApi.readInterest({ _id })).name);
        }

        document.title = `Group Interest – ${name}'s Profile`;
        setOutcome({ didFail: false });
        setValues({
          name,
          email,
          created: new Date(created),
          about,
          interests,
        });
      } catch (error) {
        setIsLoading(false);
        setOutcome({ didFail: true, message: error.message });
      }
    };

    fetchUser().then(_ => setIsLoading(false));
  }, [profileId, token]);

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
        <ProfileDetails
          token={token}
          isLoading={isLoading}
          myId={myId}
          isPersonalProfile={myId === profileId}
          details={values}
        />
      )}
    </div>
  );
};

export default withRouter(Profile);
