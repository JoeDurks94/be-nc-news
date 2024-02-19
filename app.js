const express = require("express");
const app = express();
const { getTopics, getAPI } = require("./controller/app.controller.js");

app.use(express.json());

app.get("/api/topics", getTopics);

app.get("/api", getAPI)

app.use((error, request, response, next) => {
  next(error);
});

module.exports = app;
