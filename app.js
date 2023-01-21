const config = require("./utils/config");
const logger = require("./utils/logger");
const middleware = require("./utils/middleware");

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const blogRouter = require("./controllers/blogs");
const app = express();

const mongoUrl = config.MONGODB_URI;
mongoose.connect(mongoUrl)
  .then(() => {
    logger.info("connected to MongoDB");
  }).catch(error => {
    logger.error('error connecting to MongoDB', error.message)
  });

app.use(cors());
app.use(express.json());
app.use(middleware.requestLogger)
app.use("/api/blogs", blogRouter);
app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app;
