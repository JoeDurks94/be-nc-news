const express = require("express");
const app = express();
app.use(express.json());
const {
  getTopics,
  getAPI,
  getArticleById,
} = require("./controller/app.controller.js");

app.get("/api/topics", getTopics);

app.get("/api", getAPI);

app.get("/api/articles/:article_id", getArticleById);

app.use((error, request, response, next) => {
  if (error.status === 404) {
    response.status(404).send();
  }
  if(error.code === '22P02'){
    response.status(400).send()
  }
});

module.exports = app;
