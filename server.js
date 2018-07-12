const express        = require('express');
const MongoClient    = require('mongodb').MongoClient;
const cors = require('cors')
const bodyParser     = require('body-parser');
const app            = express();
app.use(cors())
const port = 8000;

app.use(bodyParser.json({limit: '50mb'}));
require('./app/routes')(app, {});

app.listen(port, () => {
  console.log('We are live on ' + port);
});