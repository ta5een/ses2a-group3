import React, { useEffect, useState } from "react";
import {
  Button,
  Search,
  Select,
  SelectItem,
  Tag,
  Tile,
} from "carbon-components-react";

import { AuthApi, GroupApi, InterestApi, UserApi } from "api";
import { Group } from "api/group";
import "./GroupList.scss";

type SelectInterest = { _id?: string; label: string };

type GroupListItemProps = {
  authentication: AuthApi.Authentication;
  group: Group;
};

const GroupListItem = ({ authentication, group }: GroupListItemProps) => {
  const [moderator, setModerator] = useState("");
  const [interests, setInterests] = useState<string[]>([]);

  useEffect(() => {
    const fetchUser = async () => {
      return await UserApi.readUser({
        _id: group.moderator,
        token: authentication.token,
      });
    };

    const fetchInterests = async () => {
      return Promise.all(
        group.interests.map(async id => {
          return await InterestApi.readInterest({ _id: id });
        })
      );
    };

    fetchUser()
      .then(user => setModerator(user.name))
      .catch(error => console.error(error));

    fetchInterests()
      .then(interests => setInterests(interests.map(it => it.name)))
      .catch(error => console.error(error));
  }, [setModerator, setInterests]);

  const handleDeleteGroup = async () => {
    console.log("Unimplemented");
    // await GroupApi.deleteGroup(authentication.token, { _id: group._id });
  };

  return (
    <Tile className="groups-list__item">
      <div className="groups-list__item-content">
        <h2>{group.name}</h2>
        <p>
          Created by: <a href={`profile/${group.moderator}`}>{moderator}</a>
        </p>
        <div className="groups-list__item-content__tags">
          {interests.sort().map((interest, i) => (
            <Tag key={i}>{interest}</Tag>
          ))}
        </div>
        <p>{group.description}</p>
      </div>
      <div className="groups-list__item-tile-actions">
        {group.moderator === authentication.id ? (
          <Button kind="danger" onClick={handleDeleteGroup}>
            Delete group
          </Button>
        ) : (
          <Button kind="tertiary">Join group</Button>
        )}
      </div>
    </Tile>
  );
};

type GroupListProps = {
  showSearchField?: boolean;
  emptyText?: string;
};

const GroupList = ({ showSearchField, emptyText }: GroupListProps) => {
  const authentication = AuthApi.authentication();
  const { token } = authentication;

  const [search, setSearch] = useState("");
  const [interests, setInterests] = useState<SelectInterest[]>([
    { label: "All interests" },
  ]);

  const [isLoading, setIsLoading] = useState(false);
  const [groups, setGroups] = useState<Group[]>([]);

  const [selectedInterest, setSelectedInterest] = useState<SelectInterest>({
    label: "All interests",
  });

  const getFilteredGroups = () => {
    if (search.length > 0) {
      return groups.filter(it => {
        if (selectedInterest.label === "All interests") {
          return it.name.includes(search);
        } else {
          return (
            it.name.includes(search) &&
            it.interests.includes(selectedInterest._id)
          );
        }
      });
    } else if (selectedInterest.label !== "All interests") {
      return groups.filter(it => it.interests.includes(selectedInterest._id));
    } else {
      return groups;
    }
  };

  const filteredGroups = getFilteredGroups();

  const setSelectedInterestFromString = (selection: string) => {
    const interest = interests.find(it => it.label === selection);
    setSelectedInterest(interest);
  };

  useEffect(() => {
    const fetchAllInterests = async () => await InterestApi.allInterests();
    const fetchAllGroups = async () => await GroupApi.listAllGroups(token);

    fetchAllInterests()
      .then(interests => {
        const mappedInterests = interests.map<SelectInterest>(it => ({
          _id: it._id,
          label: it.name,
        }));

        setInterests([{ label: "All interests" }, ...mappedInterests]);
      })
      .catch(error => {
        console.error(error);
        setIsLoading(false);
      });

    fetchAllGroups()
      .then(groups => {
        setGroups(groups);
        setIsLoading(false);
      })
      .catch(error => {
        console.error(error);
        setIsLoading(false);
      });
  }, [token, setIsLoading, setGroups, setInterests]);

  return (
    <div className="group-list">
      {showSearchField && (
        <div className="group-list__search-container">
          <Search
            className="group-list__search"
            disabled={!authentication.isAuthenticated}
            labelText=""
            placeHolderText="Search groups"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <Select
            light
            inline
            hideLabel
            id="select-interest"
            disabled={!authentication.isAuthenticated}
            labelText="Filter by interest"
            value={selectedInterest.label}
            onChange={e => setSelectedInterestFromString(e.target.value)}>
            {interests.map((interest, i) => (
              <SelectItem
                key={i}
                text={interest.label}
                value={interest.label}
              />
            ))}
          </Select>
        </div>
      )}
      {authentication.isAuthenticated ? (
        <>
          {filteredGroups.length === 0 ? (
            <Tile className="group-list__message-container">
              <p>{emptyText}</p>
            </Tile>
          ) : (
            <div className="group-list__filtered-groups-container">
              {filteredGroups.map((group, i) => (
                <GroupListItem
                  key={i}
                  authentication={authentication}
                  group={group}
                />
              ))}
            </div>
          )}
        </>
      ) : (
        <Tile className="group-list__message-container">
          <p>
            To use Group Interest's features, please <a href="/login">login</a>{" "}
            or <a href="/register">register</a>.
          </p>
        </Tile>
      )}
    </div>
  );
};

export default GroupList;
