import React, { useEffect, useState } from "react";
import {
  Button,
  Search,
  Select,
  SelectItem,
  Tile,
} from "carbon-components-react";

import { AuthApi, InterestApi, GroupApi } from "api";
import { Group } from "api/group";
import "./GroupList.scss";

type SelectInterest = { _id?: string; label: string };

type GroupListItemProps = {
  group: Group;
};

const GroupListItem = ({ group }: GroupListItemProps) => {
  return (
    <Tile className="groups-list__item">
      <div className="groups-list__item-content">
        <h2>{group.name}</h2>
        <p>Created by: {group.moderator}</p>
        <p>{group.description}</p>
      </div>
      <div className="groups-list__item-tile-actions">
        <Button kind="tertiary">Join group</Button>
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
            labelText="Filter by interest">
            {interests.map((interest, i) => (
              <SelectItem key={i} text={interest.label} value={interest._id} />
            ))}
          </Select>
        </div>
      )}
      {authentication.isAuthenticated ? (
        <>
          {groups.length === 0 ? (
            <Tile className="group-list__message-container">
              <p>{emptyText}</p>
            </Tile>
          ) : (
            groups.map((group, i) => <GroupListItem key={i} group={group} />)
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
