const config = require("./utils/config");
const logger = require("./utils/logger");
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const blogRouter = require("./controllers/blogs");
const app = express();

const mongoUrl = config.MONGODB_URI;
mongoose.connect(mongoUrl).then(() => {
  logger.info("connected to MongoDB");
});

app.use(cors());
app.use(express.json());
app.use("/api/blogs", blogRouter);

module.exports = app;
