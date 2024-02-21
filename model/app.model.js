const db = require("../db/connection");

function fetchAllTopics(request, response) {
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

function fetchAllArticles() {
	return db
		.query(
			`SELECT 
    articles.author,
    articles.title,
    articles.article_id,
    articles.topic,
    articles.created_at,
    articles.votes,
    articles.article_img_url,
    COUNT(comments.article_id) AS comment_count 
FROM
    articles
LEFT JOIN 
    comments ON comments.article_id = articles.article_id 
GROUP BY 
    articles.article_id
ORDER BY 
    articles.created_at DESC;`
		)
		.then((result) => {
			return result.rows;
		});
}

function fetchCommentsByArticleId(lookUpArticleId) {
	return db
		.query(
			`SELECT comment_id, votes, created_at, author, body, article_id FROM comments WHERE article_id = $1 ORDER BY comments.created_at DESC`,
			[lookUpArticleId]
		)
		.then((result) => {
			return result.rows;
		});
}

module.exports = {
	fetchCommentsByArticleId,
	fetchAllTopics,
	fetchArticleById,
	fetchAllArticles,
};