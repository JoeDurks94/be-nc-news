const { getAllTopics } = require("../model/app.model");

function getTopics(request, response, next) {
  getAllTopics().then((topicsArray) => {
    response.status(200).send({ topics: topicsArray });
  });
}

module.exports = { getTopics };
