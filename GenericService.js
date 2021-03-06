const express = require('express');
const bodyParser = require('body-parser');
const logger = require('winston');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cors = require('cors');

class GenericService {
  constructor(options) {
    this.app = express();
    this.routers = express.Router();
    this.options = options;
  }

  init() {
    // view engine setup
    this.app.use(helmet());
    this.app.use(cors());
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: false }));

    this.options.routes.forEach((route) => {
      this.routers[route.method](route.path, route.middlewares, route.func);
    });

    this.app.use(this.routers);

    // catch 404 and forward to error handler
    this.app.use((req, res) => res.status(404).json('404'));

    // error handler
    this.app.use((err, req, res) => res.status(500).json('500'));

    if (this.options.mongoUrl) {
      mongoose.Promise = Promise;
      mongoose
        .connect(this.options.mongoUrl)
        .then(() => logger.info('Connected to MongoDB'));
    }

    this.app.listen(this.options.port, () => logger.info(`Connected to port ${this.options.port}`));
  }
}

module.exports = GenericService;
