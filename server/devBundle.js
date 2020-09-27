import config from '../config/config';
import webpack from 'webpack';
import webpackConfig from '../webpack.config.client.js';
import webpackHotMiddleware from 'webpack-hot-middleware';
import webpackMiddleware from 'webpack-dev-middleware';

const compile = app => {
  if (config.env === 'development') {
    const compiler = webpack(webpackConfig);
    const middleware = webpackMiddleware(compiler, {
      publicPath: webpackConfig.output.publicPath
    });

    app.use(middleware);
    app.use(webpackHotMiddleware(compiler));
  }
}

export default compile;
