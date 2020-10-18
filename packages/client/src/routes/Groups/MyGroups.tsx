import React from "react";
import { Button } from "carbon-components-react";
import { Add16 } from "@carbon/icons-react";

import GroupList from "./GroupList";

const MyGroups = () => {
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h1>My groups</h1>
        <Button renderIcon={Add16} href="/groups/new">
          New group
        </Button>
      </div>

      <div>
        <GroupList />
      </div>
    </div>
  );
};

export default MyGroups;
