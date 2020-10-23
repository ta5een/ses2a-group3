import React from "react";
import { Search, Select, SelectItem, Tile } from "carbon-components-react";

import { AuthApi } from "api";
import "./GroupList.scss";

type GroupListProps = {
  showSearchField?: boolean;
};

const GroupList = ({ showSearchField }: GroupListProps) => {
  const authentication = AuthApi.authentication();

  return (
    <div className="group-list">
      {showSearchField && (
        <div className="group-list__search-container">
          <Search
            className="group-list__search"
            disabled={!authentication.isAuthenticated}
            labelText=""
            placeHolderText="Search groups"
          />
          <Select
            light
            inline
            hideLabel
            id="select-interest"
            disabled={!authentication.isAuthenticated}
            labelText="Filter by interest">
            <SelectItem text="All interests" value="All" />
          </Select>
        </div>
      )}
      {authentication.isAuthenticated ? (
        <p>todo...</p>
      ) : (
        <Tile className="group-list__unauthenticated-container">
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
