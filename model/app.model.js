const db = require("../db/connection");

function fetchAllTopics(request, response) {
	return db.query("SELECT * FROM topics;").then((result) => {
		return result.rows;
	});
}

function fetchArticleById(articleId) {
		return db
			.query(
				`SELECT
	    articles.author,
	    articles.title,
	    articles.article_id,
	    articles.topic,
	    articles.created_at,
		articles.body,
	    articles.votes,
	    articles.article_img_url,
	    COUNT(comments.article_id) AS comment_count
	FROM
	    articles
	LEFT JOIN
	    comments ON comments.article_id = articles.article_id
	WHERE
		articles.article_id = $1
	GROUP BY
	    articles.article_id;`,
				[articleId]
			)
			.then((result) => {
				if (result.rows.length === 0) {
					return Promise.reject({ status: 404, msg: "article does not exist" });
				}
				return result.rows[0];
			});
}

function fetchAllArticles(query) {
	if (query.topic) {
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
WHERE
	topic=$1
GROUP BY 
    articles.article_id
ORDER BY 
    articles.created_at DESC;`,
				[query.topic]
			)
			.then((result) => {
				if (result.rows.length === 0) {
					return Promise.reject({ status: 404, msg: "Not found!" });
				}
				return result.rows;
			});
	} else {
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

function sendComment(articleId, comment) {
	if (
		!Object.keys(comment).includes("username") ||
		!Object.keys(comment).includes("body")
	) {
		return Promise.reject({ status: 400, msg: "Bad request!" });
	}
	if (Object.keys(comment).length !== 2) {
		return Promise.reject({ status: 400, msg: "Bad request!" });
	}
	return db
		.query(
			`INSERT INTO comments (article_id, body, author, votes) VALUES ($1, $2, $3, $4) RETURNING *;`,
			[articleId, comment.body, comment.username, 0]
		)
		.then((result) => {
			return result.rows[0];
		});
}

function amendArticleVotes(articleId, voteAmt) {
	if (
		!Object.keys(voteAmt).includes("inc_votes") ||
		typeof voteAmt.inc_votes !== "number"
	) {
		return Promise.reject({ status: 400, msg: "Bad request!" });
	}
	return db
		.query(
			`UPDATE articles SET votes = votes + $1 WHERE article_id =$2 RETURNING*`,
			[voteAmt.inc_votes, articleId]
		)
		.then((result) => {
			return result.rows[0];
		});
}

function findCommentByCommentId(commentId) {
	return db
		.query(
			`SELECT * FROM comments WHERE comment_id = $1;`,[commentId]
		)
		.then((results) => {
			if (results.rows.length === 0) {
				return Promise.reject({ status: 404, msg: "comment does not exist" });
			}
			return results.rows[0]
		})
}

function amendCommentVotes(commentId, voteAmt) {
	if (
		!Object.keys(voteAmt).includes("inc_votes") ||
		typeof voteAmt.inc_votes !== "number"
	) {
		return Promise.reject({ status: 400, msg: "Bad request!" });
	}
	return db
		.query(
			`UPDATE comments SET votes = votes + $1 WHERE comment_id =$2 RETURNING*`,
			[voteAmt.inc_votes, commentId]
		)
		.then((result) => {
			return result.rows[0];
		});
}

function findCommentToDelete(commentId) {
	return db
		.query(`DELETE FROM comments WHERE comment_id = $1 RETURNING *;`, [
			commentId,
		])
		.then((result) => {
			if (result.rows.length === 0) {
				return Promise.reject({
					status: 404,
					msg: "Not found!",
				});
			}
			return result.rows[0];
		});
}

function fetchAllUsers() {
	return db.query("SELECT * FROM users;").then((result) => {
		return result.rows;
	});
}

function sendArticle(article) {
	if (
		!Object.keys(article).includes("title") ||
		!Object.keys(article).includes("topic") ||
		!Object.keys(article).includes("author") ||
		!Object.keys(article).includes("body")
	) {
		return Promise.reject({ status: 400, msg: "Bad request!" });
	}
	if (Object.keys(article).length > 5) {
		return Promise.reject({ status: 400, msg: "Bad request!" });
	}

	const imgUrlCheck = /^https?:\/\/.*\.(jpg|jpeg|png|gif|webp)(\?.*)?$/i

	if(!article.article_img_url) {
		
		return db
		.query(
			`INSERT INTO articles (title, topic, author, body) VALUES ($1, $2, $3, $4) RETURNING *;`,
			[article.title, article.topic, article.author, article.body]
		)
		.then((result) => {
			return result.rows[0];
		});
	}

	if(!imgUrlCheck.test(article.article_img_url)) {
		return Promise.reject({ status: 400, msg: "Invalid image URL!" });
	}

	return db
		.query(
			`INSERT INTO articles (title, topic, author, body, article_img_url) VALUES ($1, $2, $3, $4, $5) RETURNING *;`,
			[article.title, article.topic, article.author, article.body, article.article_img_url]
		)
		.then((result) => {
			return result.rows[0];
		});
}

module.exports = {
	fetchCommentsByArticleId,
	fetchAllTopics,
	fetchArticleById,
	fetchAllArticles,
	sendComment,
	amendArticleVotes,
	findCommentToDelete,
	fetchAllUsers,
	amendCommentVotes,
	findCommentByCommentId,
	sendArticle
};
