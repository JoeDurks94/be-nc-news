const {
	fetchAllTopics,
	fetchArticleById,
	fetchAllArticles,
	fetchCommentsByArticleId,
} = require("../model/app.model");
const allEndpoints = require("../endpoints.json");

function getTopics(request, response, next) {
	fetchAllTopics().then((topicsArray) => {
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

function getCommentsByArticleId(request, response, next) {
	const lookUpArticleId = request.params.article_id;
	const promises = [
		fetchCommentsByArticleId(lookUpArticleId),
		fetchArticleById(lookUpArticleId),
	];
	Promise.all(promises)
		.then((comments) => {
			commentsArray = comments[0];
			if (commentsArray.length === 0) {
				response.status(200).send({
					msg: "there any no comments for the supplied acticle",
				});
			}
			response.status(200).send({ comments: commentsArray });
		})
		.catch((error) => {
			next(error);
		});
}

module.exports = {
	getCommentsByArticleId,
	getTopics,
	getAPI,
	getArticleById,
	getAllArticles,
};
