import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { Menu } from './core';

const MainRouter = () => {
  return (
    <div>
      <Menu />
      <Switch></Switch>
      <h1>Hello, world!</h1>
    </div>
  );
}

export default MainRouter;
