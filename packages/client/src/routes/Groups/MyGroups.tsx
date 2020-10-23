import React from "react";
import { Button } from "carbon-components-react";
import { Add16 } from "@carbon/icons-react";

import GroupList from "./GroupList";
import { AuthApi } from "api";

const MyGroups = () => {
  const { id } = AuthApi.authentication();

  return (
    <div className="content-container">
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h1>My groups</h1>
        <Button renderIcon={Add16} href="/groups/new">
          New group
        </Button>
      </div>

      <div>
        <GroupList matches={group => group.moderator === id} />
      </div>
    </div>
  );
};

export default MyGroups;
