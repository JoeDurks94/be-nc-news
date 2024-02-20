const db = require("../db/connection");

function getAllTopics(request, response) {
  return db.query("SELECT * FROM topics;").then((result) => {
    return result.rows;
  });
}

function fetchArticleById(articleId) {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1`, [articleId])
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "article does not exist" });
      }
      return result.rows[0];
    });
}

module.exports = { getAllTopics, fetchArticleById };
