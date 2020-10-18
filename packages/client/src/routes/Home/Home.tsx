import React, { useEffect, useState } from "react";
import { SkeletonText } from "carbon-components-react";

import { AuthApi, UserApi } from "api";
import { GroupList } from "routes/Groups";

const Home = () => {
  const { id: _id, token } = AuthApi.authentication();

  const [isLoading, setIsLoading] = useState(true);
  const [name, setName] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      const user = await UserApi.readUser({ _id, token });
      setIsLoading(false);
      setName(user.name);
    };

    fetchUser();
  }, [_id, token, setIsLoading, setName]);

  return (
    <div>
      {isLoading ? (
        <SkeletonText heading width="200px" />
      ) : (
        <div>
          <h1>Welcome, {name}</h1>
          <GroupList />
        </div>
      )}
    </div>
  );
};

export default Home;
