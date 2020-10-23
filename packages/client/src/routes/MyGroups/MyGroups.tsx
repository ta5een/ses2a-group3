import React, { useEffect } from "react";
import { Button } from "carbon-components-react";
import { Add16 } from "@carbon/icons-react";

import { GroupList } from "components";
import "./MyGroups.scss";

const MyGroups = () => {
  useEffect(() => {
    document.title = "Group Interest – My Groups";
  });

  return (
    <div className="content-container">
      <div className="my-groups__header">
        <h1>My Groups</h1>
        <Button href="/groups/new" renderIcon={Add16}>
          New group
        </Button>
      </div>
      <div className="my-groups__content">
        <GroupList showSearchField={false} />
      </div>
    </div>
  );
};

export default MyGroups;
