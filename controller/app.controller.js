const { getAllTopics } = require("../model/app.model");
const allEndpoints = require("../endpoints.json")

function getTopics(request, response, next) {
  getAllTopics().then((topicsArray) => {
    response.status(200).send({ topics: topicsArray });
  });
}

function getAPI(request, response, next) {
    response.status(200).send(allEndpoints)
}

module.exports = { getTopics, getAPI };
