const cors = require("cors");
const express = require("express");
const app = express();
app.use(cors());
app.use(express.json());
const {
	getTopics,
	getAPI,
	getArticleById,
	getAllArticles,
	getCommentsByArticleId,
	handleInvalidEndpoiont,
	postComment,
	patchArticle,
	deleteComment,
	getAllUsers,
	patchComment,
} = require("./controller/app.controller.js");

app.get("/api/topics", getTopics);

app.get("/api", getAPI);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles", getAllArticles);

app.get("/api/articles/:article_id/comments", getCommentsByArticleId);

app.get("/api/users", getAllUsers);

app.get("/api/*", handleInvalidEndpoiont);

app.post("/api/articles/:article_id/comments", postComment);

app.patch("/api/articles/:article_id", patchArticle);

app.delete("/api/comments/:comment_id", deleteComment);

app.patch("/api/comments/:comment_id", patchComment);

app.use((error, request, response, next) => {
	if (error.status) {
		response.status(error.status).send({ msg: error.msg });
	}
	if (error.code === "22P02") {
		response.status(400).send({ msg: "Bad request!" });
	}
	if (error.code === "23503" && error.constraint === "comments_author_fkey") {
		response.status(400).send({ msg: "User not found!" });
	}
	if (error.code === "23503") {
		response.status(404).send({ msg: "Not found!" });
	}
	next(error);
});

module.exports = app;
