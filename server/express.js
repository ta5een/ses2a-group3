import express from 'express';

// Modules for server-side rendering
import React from 'react';
import ReactDomServer from 'react-dom/server';
import MainRouter from '../client/MainRouter';
import theme from '../client/theme';
import { StaticRouter } from 'react-router-dom';
import { ServerStyleSheets, ThemeProvider } from '@material-ui/core';

// Comment out before building for production
import devBundle from './devBundle';

const CURRENT_WORKING_DIR = process.cwd();

const app = express();

export default app;
