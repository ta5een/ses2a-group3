import React from "react";
import { Button } from "carbon-components-react";
import { ArrowRight16 } from "@carbon/icons-react";

const NotFound = () => {
  return (
    <div>
      <div className="header">
        <h1 className="header__title">404</h1>
        <p>Oops! You weren't supposed to see this...</p>
        <div className="header__intention">
          <Button href="/" renderIcon={ArrowRight16}>
            Take me home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
