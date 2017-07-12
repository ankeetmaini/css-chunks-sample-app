const express = require('express');
const path = require('path');

const env = process.env.NODE_ENV;
const isDevelopment = env !== 'production';
const port = isDevelopment ? 3000 : process.env.PORT;
const app = express();
const publicPath = path.resolve(__dirname, 'public');

if (isDevelopment) {
  const webpack = require('webpack');
  const webpackMiddleware = require('webpack-dev-middleware');
  const webpackHotMiddleware = require('webpack-hot-middleware');
  const webpackConfig = require('./webpack.config.js');

  const compiler = webpack(webpackConfig);
  app.use(webpackMiddleware(compiler, {
    publicPath: webpackConfig.output.publicPath,
    stats: {
      warnings: false,
      noInfo: true,
      colors: true,
      hash: false,
      timings: true,
      chunks: false,
      chunkModules: false,
      modules: false,
      errors: true,
      errorDetails: true,
    },
  }));
  app.use(webpackHotMiddleware(compiler));
}

// handle serving of static assets
if (isDevelopment) {
  app.use('/assets', express.static(publicPath));
} else {
  app.use(
    '/assets',
    express.static(publicPath, {
      setHeaders: res => {
        res.append('Cache-Control', 'public, max-age=31536000');
      },
    }));
}

app.get('*', (req, res) => {
  // handle annoying favicon.ico requests
  if (req.url === '/favicon.ico') {
    res.status(200).send({ 'Content-Type': 'image/x-icon' });
    res.end();
    return;
  }
  res.sendFile(path.join(publicPath, 'index.html'));
});

app.listen(port, () => {
  if (isDevelopment) {
    const open = require('open');
    open('http://localhost:3000');
  }
  console.log(`App listening at http://localhost:${port}`); // eslint-disable-line no-console
});
