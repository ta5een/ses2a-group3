import MainRouter from './MainRouter';
import React, { useEffect } from 'react';
import theme from './theme';
import { hot } from 'react-hot-loader';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/core';

const App = () => {
  useEffect(() => {
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentNode.removeChild(jssStyles);
    }
  }, []);

  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <MainRouter />
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default hot(module)(App);
