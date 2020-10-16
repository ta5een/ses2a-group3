import React, { useState } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { Content } from "carbon-components-react";

import { UIShell } from "./components";
import { Home, Login, NotFound, Profile, Register } from "./routes";
import { AuthApi } from "api";
import "./App.scss";

const App = () => {
  const authentication = AuthApi.authentication();
  const [, setIsSignedIn] = useState(authentication.isAuthenticated);

  return (
    <UIShell authentication={authentication}>
      <Content>
        <BrowserRouter>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route
              path="/login"
              render={_ => <Login setIsSignedIn={setIsSignedIn} />}
            />
            <Route
              path="/register"
              render={_ => <Register setIsSignedIn={setIsSignedIn} />}
            />
            <Route
              path="/profile/:id"
              render={({ match }) => <Profile id={match.params.id} />}
            />
            <Route component={NotFound} />
          </Switch>
        </BrowserRouter>
      </Content>
    </UIShell>
  );
};

export default App;
