const db = require("../db/connection");

function getAllTopics(request, response) {
  return db.query("SELECT * FROM topics;").then((result) => {
    return result.rows;
  });
}

module.exports = { getAllTopics };
