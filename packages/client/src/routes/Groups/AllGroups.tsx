import React, { useEffect, useState } from "react";
import {
  Button,
  SkeletonText,
  Tag,
  TagSkeleton,
  Tile,
} from "carbon-components-react";
import { Add16 } from "@carbon/icons-react";

import { AuthApi, GroupApi, InterestApi, UserApi } from "api";
import { Group } from "api/group";
import { User } from "api/user";
import "./AllGroups.scss";

type GroupTileProps = {
  userId: string;
  token: string;
  group?: Group;
};

const GroupTile = ({ userId, token, group }: GroupTileProps) => {
  const [isLoading, setIsLoading] = useState(true);

  const [moderator, setModerator] = useState<User>(undefined);
  const [interests, setInterests] = useState<string[]>([]);

  useEffect(() => {
    const fetchModerator = async () => {
      return await UserApi.readUser({ _id: group.moderator, token });
    };

    const fetchInterests = async () => {
      const pendingInterests = group.interests.map(async interestId => {
        return (await InterestApi.readInterest({ _id: interestId })).name;
      });

      return await Promise.all(pendingInterests);
    };

    fetchModerator()
      .then(moderator => {
        setModerator(moderator);
        setIsLoading(false);
      })
      .catch(error => console.error(`Failed to fetch moderator: ${error}`));

    fetchInterests()
      .then(interest => {
        setInterests(interest);
        setIsLoading(false);
      })
      .catch(error => console.error(`Failed to fetch interests: ${error}`));
  }, [group.interests, group.moderator, token]);

  return (
    <Tile className="all-groups__group-tile-container__tile">
      <div className="all-groups__group-tile-container__tile-content">
        {isLoading ? (
          <SkeletonText heading width="150px" />
        ) : (
          <h2>{group.name}</h2>
        )}
        {!isLoading && moderator ? (
          <p>{`Moderator: ${moderator.name}`}</p>
        ) : (
          <SkeletonText width="150px" />
        )}
        <div className="all-groups__group-tile-container__tile__tags">
          {isLoading
            ? [...Array(5).keys()].map((_, i) => <TagSkeleton key={i} />)
            : interests
                .sort()
                .map((interest, i) => <Tag key={i}>{interest}</Tag>)}
        </div>
        {isLoading ? (
          <SkeletonText lineCount={3} width="150px" />
        ) : (
          <p>{group.description}</p>
        )}
      </div>
      <div className="all-groups__group-tile-container__tile-actions">
        {!isLoading && moderator && userId === moderator._id ? (
          <Button kind="danger">Delete group</Button>
        ) : (
          <Button kind="tertiary">Join group</Button>
        )}
      </div>
    </Tile>
  );
};

const AllGroups = () => {
  const { id: userId, token } = AuthApi.authentication();
  console.log(userId);

  const [isLoading, setIsLoading] = useState(true);
  const [groups, setGroups] = useState<Group[]>([]);

  useEffect(() => {
    const fetchAllGroups = async () => await GroupApi.listAllGroups(token);
    fetchAllGroups()
      .then(groups => {
        setGroups(groups);
        setIsLoading(false);
      })
      .catch(error => {
        console.error(error);
        setIsLoading(false);
      });
  }, [token, setIsLoading, setGroups]);

  return (
    <div className="all-groups">
      <div className="all-groups__header">
        <h1>Groups</h1>
        <Button renderIcon={Add16} href="/groups/new">
          New group
        </Button>
      </div>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div className="all-groups__group-tile-container">
          {groups.map((group, i) => (
            <GroupTile
              key={i}
              userId={userId}
              token={token}
              group={group}></GroupTile>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllGroups;
