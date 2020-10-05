import React from 'react';
import { Route, Switch } from 'react-router-dom';

import { Home, Menu } from './core';

const MainRouter = () => {
  return (
    <div>
      <Menu />
      <Switch>
        <Route exact path='/' component={Home} />
      </Switch>
    </div>
  );
};

export default MainRouter;
