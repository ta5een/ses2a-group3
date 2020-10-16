import React from "react";
import { AuthApi } from "../../api";

const Home = () => {
  const authentication = AuthApi.authentication();
  console.log(authentication);

  return (
    <div>
      <h1>Welcome</h1>
    </div>
  );
};

export default Home;
