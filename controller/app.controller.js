const {
	fetchAllTopics,
	fetchArticleById,
	fetchAllArticles,
	fetchCommentsByArticleId,
	sendComment,
	amendArticleVotes,
	amendCommentVotes,
	findCommentByCommentId,
	findCommentToDelete,
	fetchAllUsers,
	sendArticle,
} = require("../model/app.model");
const allEndpoints = require("../endpoints.json");

function handleInvalidEndpoiont(request, response, mext) {
	response.status(404).send({ msg: "invalid path" });
}

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
	fetchAllArticles(request.query)
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
				return response.status(200).send({
					msg: "there any no comments for the supplied acticle",
				});
			}
			response.status(200).send({ comments: commentsArray });
		})
		.catch((error) => {
			next(error);
		});
}

function postComment(request, response, next) {
	sendComment(request.params.article_id, request.body)
		.then((data) => {
			response.status(201).send(data);
		})
		.catch((error) => {
			next(error);
		});
}

function patchArticle(request, response, next) {
	const promises = [
		fetchArticleById(request.params.article_id),
		amendArticleVotes(request.params.article_id, request.body),
	];
	Promise.all(promises)
		.then((data) => {
			const formattedArticle = data[1];
			response.status(200).send(formattedArticle);
		})
		.catch((error) => {
			next(error);
		});
}

function patchComment(request, response, next) {
	const promises = [
		findCommentByCommentId(request.params.comment_id),
		amendCommentVotes(request.params.comment_id, request.body),
	];
	Promise.all(promises)
		.then((data) => {
			const formattedComment = data[1];
			response.status(200).send(formattedComment);
		})
		.catch((error) => {
			next(error);
		});
}

function deleteComment(request, response, next) {
	findCommentToDelete(request.params.comment_id)
		.then((data) => {
			response.status(204).send({ data });
		})
		.catch((error) => {
			next(error);
		});
}

function getAllUsers(request, response, next) {
	fetchAllUsers()
		.then((data) => {
			response.status(200).send({ users: data });
		})
		.catch((error) => {
			next(error);
		});
}

function postArticle(request, response, next) {
	sendArticle(request.body)
		.then((data) => {
			response.status(201).send(data);
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
	postComment,
	handleInvalidEndpoiont,
	patchArticle,
	patchComment,
	deleteComment,
	getAllUsers,
	postArticle
};
