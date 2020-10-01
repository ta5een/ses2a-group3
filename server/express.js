import bodyParser from 'body-parser';
import compress from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import path from 'path';
import routes from './routes';
import template from '../template';

// Modules for server-side rendering
import MainRouter from '../client/MainRouter';
import React from 'react';
import ReactDomServer from 'react-dom/server';
import theme from '../client/theme';
import { StaticRouter } from 'react-router-dom';
import { ServerStyleSheets, ThemeProvider } from '@material-ui/core';

// Comment out before building for production
import devBundle from './devBundle';

const CURRENT_WORKING_DIR = process.cwd();
const app = express();

// Comment out before building for production
devBundle.compile(app);

// Parse body params and attache them to req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(compress());

app.use(helmet()); // Secure apps by setting various HTTP headers
app.use(cors()); // Enable CORS - Cross Origin Resource Sharing
app.use('/dist', express.static(path.join(CURRENT_WORKING_DIR, 'dist')));

// Mount routes
app.use('/', routes.authRoutes);
app.use('/', routes.enrollmentRoutes);
app.use('/', routes.groupRoutes);
app.use('/', routes.postRoutes);
app.use('/', routes.userRoutes);

app.get('*', (req, res) => {
  const sheets = new ServerStyleSheets();
  const context = {};

  const markup = ReactDomServer.renderToString(
    sheets.collect(
      <StaticRouter location={req.url} context={context}>
        <ThemeProvider theme={theme}>
          <MainRouter />
        </ThemeProvider>
      </StaticRouter>
    )
  );

  if (context.url) {
    return res.redirect(303, context.url);
  }

  const css = sheets.toString();
  res.status(200).send(template(markup, css));
});

// Catch unauthorised errors
app.use((err, _req, res, _next) => {
  if (err.name === 'UnauthorizedError') {
    res.status(401).json({ error: `${err.name}: ${err.message}` });
  } else if (err) {
    res.status(400).json({ error: `${err.name}: ${err.message}` });
    console.log(err);
  }
});

export default app;
