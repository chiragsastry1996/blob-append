const path = require('path');
const publicPath = path.join(__dirname, './public');
const morgan = require('morgan');
const express = require('express')
const app = express();
require('dotenv').config();
app.use('/public',express.static(publicPath));
const PORT = process.env.PORT || 3000;

app.use(morgan("dev"));

const routes = require('./api/router');
app.use('/api/', routes);

// Catch 404
app.use((req, res, next) => {
  res.status(404).send({
    success: false,
    message: "Invalid Route"
  });
});

// Error handler
app.use((error, req, res, next) => {
  console.log(error);

  res.status(error.status || 500);
  if (error.status != 500) {
    error = error.message;
  }
  res.send({
    success: false,
    message: error
  });
});

app.listen(PORT, () => {
    console.log('Server is running!!!');
});