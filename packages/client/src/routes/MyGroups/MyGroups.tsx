import React, { useEffect, useState } from "react";
import { Button } from "carbon-components-react";
import { Add16 } from "@carbon/icons-react";

import { AuthApi, UserApi } from "api";
import { GroupList } from "components";
import "./MyGroups.scss";

const MyGroups = () => {
  useEffect(() => {
    document.title = "Group Interest – My Groups";
  });

  const { isAuthenticated, id, token } = AuthApi.authentication();

  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchUserAndCheckIfAdmin = async () => {
      const user = await UserApi.readUser({ _id: id, token });
      return user.admin;
    };

    fetchUserAndCheckIfAdmin().then(isAdmin => setIsAdmin(isAdmin));
  }, [id, token, setIsAdmin]);

  return (
    <div className="content-container">
      <div className="my-groups__header">
        <h1>My Groups</h1>
        {isAuthenticated && isAdmin && (
          <Button href="/groups/new" renderIcon={Add16}>
            New group
          </Button>
        )}
      </div>
      <div className="my-groups__content">
        <GroupList
          showSearchField={false}
          emptyText={`There's nothing to show here. ${
            isAdmin
              ? "Join a group or create a new one by clicking 'New group'."
              : "Join a group to view it here."
          }`}
        />
      </div>
    </div>
  );
};

export default MyGroups;
