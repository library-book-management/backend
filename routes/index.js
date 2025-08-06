const express = require('express');

const apiRoute = express.Router();

const listRoutesApi = [
  {
    path: '/authors',
    route: require('./author.route'),
  },
  {
    path: '/categories',
    route: require('./category.route'),
  },
  {
    path: '/auth',
    route: require('./auth.route'),
  },
  {
    path: '/books',
    route: require('./book.route'),
  },
];

listRoutesApi.forEach((route) => {
  apiRoute.use(route.path, route.route);
});

module.exports = apiRoute;
