const express = require('express');
const bodyParser = require('body-parser');
const logger = require('winston');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cors = require('cors');

class GenericService {
  constructor(options) {
    this.app = express();
    this.options = options;
  }

  init() {
    // view engine setup
    this.app.use(helmet());
    this.app.use(cors());
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: false }));

    this.app.use('/', this.options.routes);

    // catch 404 and forward to error handler
    this.app.use((req, res) => res.status(404).json('404'));

    // error handler
    this.app.use((err, req, res) => res.status(500).json('500'));

    if (this.options.mongoUrl) {
      mongoose.Promise = Promise;
      mongoose.connect(this.options.mongoUrl);
    }

    this.app.listen(this.options.port, () => logger.info(`Connected to port ${PORT}`));
  }
}

module.exports = GenericService;
