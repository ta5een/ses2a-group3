import React from 'react';
import { Home, Group } from '@material-ui/icons';
import { AppBar, Button, IconButton, Toolbar, Typography } from '@material-ui/core';
import { Link, withRouter } from 'react-router-dom';

const Menu = ({ history }) => {
  const isActive = expectedPath => {
    if (history.location.pathname === expectedPath) {
      return { color: '#f57c00' };
    } else {
      return { color: '#fffde7' };
    }
  };

  return (
    <AppBar position='fixed'>
      <Toolbar>
        <Typography variant='h6' color='inherit'>
          MeetPoint
        </Typography>
        <div>
          <Link to='/'>
            <IconButton aria-label='Home' style={isActive('/')}>
              <Home/>
            </IconButton>
          </Link>
        </div>
        <div>
          <Link to='/signup'>
            <Button style={isActive('/signup')}>Sign Up</Button>
          </Link>
          <Link to='/signin'>
            <Button style={isActive('/signin')}>Sign In</Button>
          </Link>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default withRouter(Menu);
