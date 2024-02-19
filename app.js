const express = require("express");
const app = express();
const { getTopics } = require("./controller/app.controller.js");

app.use(express.json());

app.get("/api/topics", getTopics);

app.use((error, request, response, next) => {
  next(error);
});

module.exports = app;
