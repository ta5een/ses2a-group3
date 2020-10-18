import React, { useState } from "react";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import { Content } from "carbon-components-react";

import { PrivateRoute, UIShell } from "./components";
import {
  Group,
  Home,
  Login,
  NotFound,
  Profile,
  Register,
  Settings,
} from "./routes";
import { AuthApi } from "api";
import AuthContext from "context/auth";
import "./App.scss";

const App = () => {
  const [, setIsSignedIn] = useState(false);

  const Routes = () => (
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
        path="/logout"
        render={_ => (
          <Redirect to={{ pathname: "/login", state: { didSignOut: true } }} />
        )}
      />

      <PrivateRoute path="/profile/:id" component={Profile} />
      <PrivateRoute path="/groups/new" component={Group.NewGroup} />
      <PrivateRoute path="/groups/" component={Group.AllGroups} />
      <PrivateRoute path="/settings" component={Settings} />
      <Route component={NotFound} />
    </Switch>
  );

  return (
    <AuthContext.Provider value={{ authentication: AuthApi.authentication() }}>
      <UIShell>
        <Content>
          <BrowserRouter>
            <Routes />
          </BrowserRouter>
        </Content>
      </UIShell>
    </AuthContext.Provider>
  );
};

export default App;
