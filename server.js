require('dotenv').config();

const cors = require('cors');
const http = require('http');
const morgan = require('morgan');
const express = require('express');
const mongoose = require('mongoose');
const httpStatus = require('http-status');

const apiRoute = require('./routes');
const errorHandler = require('./middlewares/error.middleware');

const app = express();
const server = http.createServer(app);

const port = process.env.PORT || 3002;
const devEnv = process.env.NODE_ENV === 'development';
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/library-book-management';

app.use(cors());
app.use(express.json());

app.use(morgan('dev'));
mongoose.set('debug', devEnv);

app.use('/api/v1', apiRoute);

app.get('/', (req, res) => {
  res.status(httpStatus.OK).send({
    message: 'Server is running 🍀',
    code: httpStatus.OK,
  });
});

app.get('/health-check', (req, res) => {
  res.status(httpStatus.OK).send({
    message: 'OK',
    code: httpStatus.OK,
  });
});

app.all('/{*any}', (req, res) => {
  res.status(httpStatus.NOT_FOUND).send({
    message: 'Not found',
    code: httpStatus.NOT_FOUND,
  });
});

app.use(errorHandler);


mongoose
  .connect(mongoURI)
  .then(() => {
    console.log('MongoDB connected 🍀');
  })
  .then(() => {
    server.listen(port, () => {
      console.log(`Server listening on port ${port} 🚀`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
