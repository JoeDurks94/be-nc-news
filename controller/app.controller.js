const {
	getAllTopics,
	fetchArticleById,
	fetchAllArticles,
} = require("../model/app.model");
const allEndpoints = require("../endpoints.json");

function getTopics(request, response, next) {
	getAllTopics().then((topicsArray) => {
		response.status(200).send({ topics: topicsArray });
	});
}

function getAPI(request, response, next) {
	response.status(200).send(allEndpoints);
}

function getArticleById(request, response, next) {
	fetchArticleById(request.params.article_id)
		.then((article) => {
			response.status(200).send({ article });
		})
		.catch((error) => {
			next(error);
		});
}

function getAllArticles(request, response, next) {
	fetchAllArticles()
		.then((articles) => {
			response.status(200).send({ articles });
		})
		.catch((error) => {
			next(error);
		});
}

module.exports = { getTopics, getAPI, getArticleById, getAllArticles };
