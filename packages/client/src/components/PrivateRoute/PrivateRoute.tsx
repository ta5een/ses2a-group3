import React, { useContext } from "react";
import { Route, Redirect, RouteProps } from "react-router-dom";

import { AuthContext } from "context";

const PrivateRoute = ({ component: Component, ...rest }: RouteProps) => {
  const authContext = useContext(AuthContext);

  return (
    <Route
      {...rest}
      render={props =>
        authContext.authentication.isAuthenticated ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { didRedirect: true, from: props.location },
            }}
          />
        )
      }
    />
  );
};

export default PrivateRoute;
