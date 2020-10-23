import React, { useEffect, useState } from "react";
import { Loading } from "carbon-components-react";

import { AuthApi, UserApi } from "api";
import { GroupList } from "components";
import "./Home.scss";

type HomeContentProps = {
  heading: string;
  isAuthenticated: boolean;
};

const HomeContent = ({ heading, isAuthenticated }: HomeContentProps) => {
  return (
    <div className="home-content">
      <h1>
        {isAuthenticated ? heading : "Welcome to Group Interest"}
      </h1>
      <GroupList showSearchField={true} />
    </div>
  );
};

const Home = () => {
  useEffect(() => {
    document.title = "Group Interest";
  });

  const authentication = AuthApi.authentication();
  const { isAuthenticated, id: _id, token } = authentication;

  const [isLoading, setIsLoading] = useState(true);
  const [name, setName] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      const user = await UserApi.readUser({ _id, token });
      setName(user.name);
    };

    if (isAuthenticated) {
      fetchUser()
        .then(_ => setIsLoading(false))
        .catch(error => console.error(error));
    }
  }, [isAuthenticated, _id, token, setIsLoading, setName]);

  return (
    <div className="content-container">
      {isAuthenticated && isLoading ? (
        <Loading />
      ) : (
        <HomeContent
          isAuthenticated={authentication.isAuthenticated}
          heading={`Welcome, ${name}`}
        />
      )}
    </div>
  );
};

export default Home;
