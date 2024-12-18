const request = require("supertest");
const app = require("../app.js");
const seed = require("../db/seeds/seed.js");
const db = require("../db/connection.js");
const data = require("../db/data/test-data/index.js");
const allEndpoints = require("../endpoints.json");

beforeEach(() => seed(data));
afterAll(() => db.end());

describe("error handling", () => {
	it("should return a 404 for not found with an appropriate message", () => {
		return request(app)
			.get("/api/topix")
			.expect(404)
			.then((data) => {
				expect(data.body.msg).toBe("invalid path");
			});
	});
});

describe("GET /api/topics", () => {
	it("should respond with a status of 200", () => {
		return request(app).get("/api/topics").expect(200);
	});
	it("should respond with an topics object that have the corrects", () => {
		return request(app)
			.get("/api/topics")
			.then((data) => {
				const topicsData = data.body.topics;
				expect(topicsData.length).toBe(3);
			});
	});
	it("should contain an object with the correct keys", () => {
		return request(app)
			.get("/api/topics")
			.expect(200)
			.then((data) => {
				const topicsData = data.body.topics;
				topicsData.forEach((topic) => {
					expect(Object.keys(topic)).toInclude("slug" && "description");
				});
			});
	});
});

describe("GET /api", () => {
	it("should return an object detailing all the available endpoints on the API", () => {
		return request(app)
			.get("/api")
			.expect(200)
			.then((data) => {
				const sampleObj = allEndpoints;
				expect(data.body).toEqual(sampleObj);
			});
	});
});

describe("GET /api/articles/:article_id", () => {
	it("should respond with a 200 status code when passed a article id that is correct", () => {
		return request(app).get("/api/articles/6").expect(200);
	});
	it("should return with a 404 status code when passed an article id that does not exist but is valid", () => {
		return request(app)
			.get("/api/articles/90909")
			.expect(404)
			.then((data) => {
				expect(data.body.msg).toBe("article does not exist");
			});
	});
	it("should return with a 400 status code when passed an article id that is invalid - the parameter should be an integer", () => {
		return request(app)
			.get("/api/articles/nine")
			.expect(400)
			.then((data) => {
				expect(data.body.msg).toBe("Bad request!");
			});
	});
	it("should return an article object", () => {
		return request(app)
			.get("/api/articles/1")
			.expect(200)
			.then((data) => {
				expect(typeof data.body.article).toBe("object");
			});
	});
	it("should return an object with the correct keys", () => {
		return request(app)
			.get("/api/articles/3")
			.expect(200)
			.then((data) => {
				expect(Object.keys(data.body.article)).toInclude(
					"author",
					"title",
					"article_id",
					"body",
					"topic",
					"created_at",
					"votes",
					"article_img_url"
				);
			});
	});
	it("should be able to access the correct article when passed the parameter in the api url and return the article on an object", () => {
		return request(app)
			.get("/api/articles/7")
			.expect(200)
			.then((data) => {
				expect(typeof data.body.article).toBe("object");
				expect(data.body.article.article_id).toBe(7);
				expect(data.body.article.title).toBe("Z");
				expect(data.body.article.topic).toBe("mitch");
				expect(data.body.article.author).toBe("icellusedkars");
				expect(data.body.article.body).toBe("I was hungry.");
				expect(data.body.article.votes).toBe(0);
			});
	});
	it("should be able to access the correct article when passed the parameter in the api url and return the article on an object", () => {
		return request(app)
			.get("/api/articles/7")
			.expect(200)
			.then((data) => {
				expect(typeof data.body.article).toBe("object");
				expect(data.body.article.article_id).toBe(7);
				expect(data.body.article.title).toBe("Z");
				expect(data.body.article.topic).toBe("mitch");
				expect(data.body.article.author).toBe("icellusedkars");
				expect(data.body.article.body).toBe("I was hungry.");
				expect(data.body.article.votes).toBe(0);
			});
	});
});

describe("GET /api/articles", () => {
	it("should return with the correct status code - status 200", () => {
		return request(app).get("/api/articles").expect(200);
	});
	it("should return an array of the correct length", () => {
		return request(app)
			.get("/api/articles")
			.expect(200)
			.then((data) => {
				expect(Array.isArray(data.body.articles)).toBeTrue();
				expect(data.body.articles).toHaveLength(13);
			});
	});
	it("should have the correct data types on each iteration", () => {
		return request(app)
			.get("/api/articles")
			.expect(200)
			.then((data) => {
				data.body.articles.forEach((item) => {
					expect(item).toMatchObject({
						author: expect.any(String),
						title: expect.any(String),
						article_id: expect.any(Number),
						topic: expect.any(String),
						created_at: expect.any(String),
						votes: expect.any(Number),
						article_img_url: expect.any(String),
						comment_count: expect.any(String),
					});
					expect(Object.keys(item)).not.toInclude("body");
				});
			});
	});
	it("should have the correct keys for each of the articles returns", () => {
		return request(app)
			.get("/api/articles")
			.expect(200)
			.then((data) => {
				data.body.articles.forEach((item) => {
					expect(Object.keys(item)).toInclude(
						"author",
						"title",
						"article_id",
						"topic",
						"created_at",
						"votes",
						"article_img_url",
						"comment_count"
					);
				});
			});
	});

	it("should return an object of articles that have been sorted by the created_at date, in descending order", () => {
		return request(app)
			.get("/api/articles")
			.expect(200)
			.then((data) => {
				expect(data.body.articles).toBeSortedBy("created_at", {
					descending: true,
				});
			});
	});
});
describe("GET /api/articles/:article_id/comments", () => {
	it("should send the correct status code (200) back when passed an article id of an article that contains comments", () => {
		return request(app).get("/api/articles/1/comments").expect(200);
	});
	it("should send the correct status code back (400) when passed an article id that is invalid - the parameter should be an integer", () => {
		return request(app)
			.get("/api/articles/two/comments")
			.expect(400)
			.then((data) => {
				expect(data.body.msg).toBe("Bad request!");
			});
	});
	it("should send the correct status code back (404) when passed an article id that is valid but doesnt exist", () => {
		return request(app)
			.get("/api/articles/90909/comments")
			.expect(404)
			.then((data) => {
				expect(data.body.msg).toBe("article does not exist");
			});
	});
	it("should send the correct status code back (200) when passed an article id that exists but does not have any comments", () => {
		return request(app)
			.get("/api/articles/2/comments")
			.expect(200)
			.then((data) => {
				expect(data.body.msg).toBe(
					"there any no comments for the supplied acticle"
				);
			});
	});
	it("should respond with an array of comments for the given article_id of the correct amount of comments for a article that has one comment", () => {
		return request(app)
			.get("/api/articles/6/comments")
			.expect(200)
			.then((data) => {
				expect(data.body.comments.length).toBe(1);
				expect(Array.isArray(data.body.comments)).toBeTrue();
			});
	});
	it("should respond with an array of comments for the given article_id of the correct amount of comments for a article that has multiple comments all of which will have the correct keys on then", () => {
		return request(app)
			.get("/api/articles/1/comments")
			.expect(200)
			.then((data) => {
				expect(data.body.comments.length).toBe(11);
				expect(Array.isArray(data.body.comments)).toBeTrue();
				data.body.comments.forEach((comment) => {
					expect(Object.keys(comment)).toInclude(
						"author",
						"votes",
						"comment_id",
						"body",
						"article_id",
						"created_at"
					);
				});
			});
	});
	it("should respond with an array of comments that are in descending order of when it was created", () => {
		return request(app)
			.get("/api/articles/5/comments")
			.expect(200)
			.then((data) => {
				expect(data.body.comments).toBeSortedBy("created_at", {
					descending: true,
				});
			});
	});
});

describe("POST /api/articles/:article_id/comments", () => {
	it("should send the correct status code back (201) when passed the correct comment object ", () => {
		return request(app)
			.post("/api/articles/4/comments")
			.send({
				username: "lurker",
				body: "test comment",
			})
			.expect(201);
	});
	it("should send the comment object back if the correct things are contained within the post request", () => {
		return request(app)
			.post("/api/articles/4/comments")
			.send({
				username: "lurker",
				body: "test comment",
			})
			.then((data) => {
				expect(typeof data.body === "object").toBeTrue();
				expect(Object.keys(data.body).length).toBe(6);
			});
	});
	it("should send the correct status code back (400) when passed nothing", () => {
		return request(app).post("/api/articles/4/comments").expect(400);
	});
	it("should send the correct status code back (400) when passed an incomplete comment object - with the body ommited", () => {
		return request(app)
			.post("/api/articles/4/comments")
			.send({
				username: "lurker",
			})
			.expect(400)
			.then((data) => {
				expect(data.body.msg).toBe("Bad request!");
			});
	});
	it("should send the correct status code back (400) when passed an imcomplete comment object - with the username ommited", () => {
		return request(app)
			.post("/api/articles/4/comments")
			.send({
				body: "test comment",
			})
			.expect(400)
			.then((data) => {
				expect(data.body.msg).toBe("Bad request!");
			});
	});
	it("should send the correct status code back (400) when passed a comment object with too many key value pairs", () => {
		return request(app)
			.post("/api/articles/4/comments")
			.send({
				username: "lurker",
				body: "test comment",
				info: "please cause an error :)",
			})
			.expect(400)
			.then((data) => {
				expect(data.body.msg).toBe("Bad request!");
			});
	});
	it("should send the correct status code back (404) when trying to post a comment to an article that doesnt exist ", () => {
		return request(app)
			.post("/api/articles/440/comments")
			.send({
				username: "lurker",
				body: "test comment",
			})
			.expect(404)
			.then((data) => {
				expect(data.body.msg).toBe("Not found!");
			});
	});
	it("should send the correct status code back (400) when passed a comment object that contains one incorrect keys", () => {
		return request(app)
			.post("/api/articles/4/comments")
			.send({
				username: "lurker",
				bdy: "test comment",
			})
			.expect(400)
			.then((data) => {
				expect(data.body.msg).toBe("Bad request!");
			});
	});
	it("should send the correct status code back (400) when passed a comment object that contains two incorrect keys", () => {
		return request(app)
			.post("/api/articles/4/comments")
			.send({
				usename: "lurker",
				bdy: "test comment",
			})
			.expect(400)
			.then((data) => {
				expect(data.body.msg).toBe("Bad request!");
			});
	});
	it("should send the correct status code back (404) when trying to post a comment to an article id that is of the wrong format - article_id should be an integer ", () => {
		return request(app)
			.post("/api/articles/four/comments")
			.send({
				username: "lurker",
				body: "test comment",
			})
			.expect(400)
			.then((data) => {
				expect(data.body.msg).toBe("Bad request!");
			});
	});
	it("should send the correct status code back (400) when trying to post a comment with a username that doesnt exist in the database", () => {
		return request(app)
			.post("/api/articles/4/comments")
			.send({
				username: "j4ckth3h4cker",
				body: "test comment",
			})
			.expect(400)
			.then((data) => {
				expect(data.body.msg).toBe("User not found!");
			});
	});
	it("should return the comment object back once posted and it should contain all the expected key value pairs", () => {
		return request(app)
			.post("/api/articles/4/comments")
			.send({
				username: "rogersop",
				body: "Hello, this is a comment from Roger",
			})
			.expect(201)
			.then((data) => {
				expect(Object.keys(data.body)).toInclude(
					"comment_id",
					"body",
					"article_id",
					"author",
					"votes",
					"created_at"
				);
				expect(data.body).toMatchObject({
					comment_id: expect.any(Number),
					article_id: 4,
					author: "rogersop",
					body: "Hello, this is a comment from Roger",
					created_at: expect.any(String),
					votes: 0,
				});
			});
	});
});

describe("PATCH /api/articles/:article_id", () => {
	it("should respond with the correct status code when given the correct input", () => {
		return request(app)
			.patch("/api/articles/4")
			.send({
				inc_votes: 1,
			})
			.expect(200);
	});
	it("should respond with the correct status code when given the incorrect article_id", () => {
		return request(app)
			.patch("/api/articles/999")
			.send({
				inc_votes: 1,
			})
			.expect(404);
	});
	it("should respond with the correct status code when given the correct input", () => {
		return request(app)
			.patch("/api/articles/four")
			.send({
				inc_votes: 1,
			})
			.expect(400);
	});
	it("should respond with the correct status code when given the correct input and increase by the  givne amount - this article did not have any votes before", () => {
		return request(app)
			.patch("/api/articles/4")
			.send({
				inc_votes: 1,
			})
			.expect(200)
			.then((data) => {
				expect(data.body.votes).toBe(1);
			});
	});
	it("should be able to increase by a varying value not only just +1", () => {
		return request(app)
			.patch("/api/articles/6")
			.send({
				inc_votes: 40,
			})
			.expect(200)
			.then((data) => {
				expect(data.body.votes).toBe(40);
			});
	});
	it("should be able to increase by a varying value and not overwrite the value but increase it - this article already has 100 votes insided the database", () => {
		return request(app)
			.patch("/api/articles/1")
			.send({
				inc_votes: 40,
			})
			.expect(200)
			.then((data) => {
				expect(data.body.votes).toBe(140);
			});
	});
	it("should be able to decrease by 1 and not overwrite the value but decrease it - this article already has 100 votes insided the database", () => {
		return request(app)
			.patch("/api/articles/1")
			.send({
				inc_votes: -1,
			})
			.expect(200)
			.then((data) => {
				expect(data.body.votes).toBe(99);
			});
	});
	it("should be able to decrease by a varying value and not overwrite the value but decrease it - this article already has 100 votes insided the database", () => {
		return request(app)
			.patch("/api/articles/1")
			.send({
				inc_votes: -40,
			})
			.expect(200)
			.then((data) => {
				expect(data.body.votes).toBe(60);
			});
	});
	it("should respond with error code when the key is incorrect", () => {
		return request(app)
			.patch("/api/articles/1")
			.send({
				incvotes: -40,
			})
			.expect(400)
			.then((data) => {
				expect(data.body.msg).toBe("Bad request!");
			});
	});
	it("should respond with error code when the value is of the incorrect type", () => {
		return request(app)
			.patch("/api/articles/4")
			.send({
				inc_votes: "four",
			})
			.expect(400)
			.then((data) => {
				expect(data.body.msg).toBe("Bad request!");
			});
	});
	it("should send back the updated article with the correct amount of votes", () => {
		return request(app)
			.patch("/api/articles/1")
			.send({
				inc_votes: 40,
			})
			.expect(200)
			.then((data) => {
				expect(data.body.votes).toBe(140);
				expect(data.body).toMatchObject({
					article_id: 1,
					title: "Living in the shadow of a great man",
					topic: "mitch",
					author: "butter_bridge",
					body: "I find this existence challenging",
					created_at: "2020-07-09T20:11:00.000Z",
					votes: 140,
					article_img_url:
						"https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
				});
			});
	});
});

describe("DELETE /api/comments/:comment_id", () => {
	it("should respond with the correct status code (204) when it successfully deletes a comment", () => {
		return request(app).delete("/api/comments/2").expect(204);
	});
	it("should respond with the correct staus code (404) when passed an valid but incorrect comment_id", () => {
		return request(app)
			.delete("/api/comments/404040")
			.expect(404)
			.then((data) => {
				expect(data.body.msg).toBe("Not found!");
			});
	});
	it("should respond with the correct stauts code (400) when passed an invalid comment_id", () => {
		return request(app)
			.delete("/api/comments/four")
			.expect(400)
			.then((data) => {
				expect(data.body.msg).toBe("Bad request!");
			});
	});
});

describe("GET /api/users", () => {
	it("should respond with the correct status code 200 when the correct path is sent", () => {
		return request(app).get("/api/users").expect(200);
	});
	it("should respond with an array", () => {
		return request(app)
			.get("/api/users")
			.expect(200)
			.then((data) => {
				expect(Array.isArray(data.body.users)).toBeTrue;
			});
	});
	it("should respond with an array of objectscontaing 4 user objects", () => {
		return request(app)
			.get("/api/users")
			.expect(200)
			.then((data) => {
				expect(data.body.users).toHaveLength(4);
				data.body.users.forEach((user) => {
					expect(typeof user).toBe("object");
				});
			});
	});
	it("should have the correct keys on the object of each user", () => {
		return request(app)
			.get("/api/users")
			.expect(200)
			.then((data) => {
				expect(data.body.users).toHaveLength(4);
				data.body.users.forEach((user) => {
					expect(user).toMatchObject({
						username: expect.any(String),
						name: expect.any(String),
						avatar_url: expect.any(String),
					});
				});
			});
	});
});

describe("GET /api/articles (topic query)", () => {
	it("should be able to take a query of a topic and return all articles of that topic", () => {
		return request(app)
			.get("/api/articles?topic=mitch")
			.expect(200)
			.then((data) => {
				data.body.articles.forEach((article) => {
					expect(article.topic).toBe("mitch");
				});
			});
	});
	it("should be able to take a query of a topic and return an array of the correct length", () => {
		return request(app)
			.get("/api/articles?topic=mitch")
			.expect(200)
			.then((data) => {
				expect(data.body.articles).toHaveLength(12);
			});
	});
	it("should be able to take a query of a topic and return an array of the correct length", () => {
		return request(app)
			.get("/api/articles?topic=cats")
			.expect(200)
			.then((data) => {
				expect(data.body.articles).toHaveLength(1);
				expect(data.body.articles[0].topic).toBe("cats");
			});
	});
	it("should respond with an appropriate status code when given a query for a topic that doesnt exist", () => {
		return request(app)
			.get("/api/articles?topic=flowers")
			.expect(404)
			.then((data) => {
				expect(data.body.msg).toBe("Not found!");
			});
	});
	it("should be able to take a query of a topic and return an array of the correct length (0) if the topic is valid but nothing relating to the topic is inside the database", () => {
		return request(app)
			.get("/api/articles?topic=paper")
			.expect(404)
			.then((data) => {
				expect(data.body.msg).toBe("Not found!");
			});
	});
});

describe("GET /api/articles/:article_id - extra comment_count functionality check", () => {
	it("should be able to access the correct comment count if comments exist", () => {
		return request(app)
			.get("/api/articles/1")
			.expect(200)
			.then((data) => {
				expect(typeof data.body.article).toBe("object");
				expect(data.body.article.article_id).toBe(1);
				expect(data.body.article.comment_count).toBe("11");
			});
	});
	it("should be able to access the correct comment count if no comments are stored for the arrticle", () => {
		return request(app)
			.get("/api/articles/2")
			.expect(200)
			.then((data) => {
				expect(typeof data.body.article).toBe("object");
				expect(data.body.article.article_id).toBe(2);
				expect(data.body.article.comment_count).toBe("0");
			});
	});
});

describe("PATCH /api/comments/:comment_id", () => {
	it("should return the correct votes", () => {
		return request(app).patch("/api/comments/1").send({
			inc_votes: 20,
		}).expect(200)
	});
	it("should return give the correct status when decreasing comments", () => {
		return request(app).patch("/api/comments/1").send({
			inc_votes: -20,
		}).expect(200)
	});
	it('should send back a bad request error code when passed an inc votes string', () => {
		return request(app).patch("/api/comments/1")
		.send({
			inc_votes: ""
		}).expect(400)
	});
	it('should send back a bad request error code when passed an string article_id', () => {
		return request(app).patch("/api/comments/one")
		.send({
			inc_votes: 10
		}).expect(400)
	});
	it('should correctly increase the comment count', () => {
			return request(app).patch("/api/comments/1").send({
				inc_votes: 20,
			}).expect(200).then((data) => {
				expect(data.body.votes).toBe(36)
			})
	});
});

describe('POST /api/articles', () => {
	it('should give a 201 status code when passed all the required information in the request body but no article_img_url', () => {
        return request(app).post('/api/articles').send({
            title: "test title",
            topic: "mitch",
            author: "icellusedkars",
            body: "test body",
        })
		.expect(201)
	})
	it('should give a 201 status code when passed all the required information in the request body as well as an article_img_url', () => {
		return request(app).post('/api/articles').send({
			title: "test title",
			topic: "mitch",
			author: "icellusedkars",
			body: "test body",
			article_img_url: "https://c02.purpledshub.com/uploads/sites/39/2023/05/Specialized-Rockhopper-Elite-29-climb-243ee75.jpg?w=1240&webp=1"
		}).expect(201)
	})
	it('should respond with the complete article object after sending all the required information', () => {
		return request(app).post('/api/articles').send({
            title: "test title",
            topic: "mitch",
            author: "icellusedkars",
            body: "test body",
        })
		.expect(201).then((data) => {
			expect(data.body).toMatchObject({
				article_id: 14,
				title: "test title",
				topic: "mitch",
				created_at: expect.any(String),
				votes: 0,
				author:	"icellusedkars",
				body: "test body",	
			})
		})
	})
	it('should give a 400 error when a required field is not submitted', () => {
		return request(app).post('/api/articles').send({
			title: "test title",
			topic: "mitch",
			author: "icellusedkars",
		}).expect(400)
	})
	it('should give a 404 error when a topic that doesnt exist in the database is passed', () => {
		return request(app).post('/api/articles').send({
			title: "test title",
			topic: "flowers",
			author: "rogersop",
			body: "test body"
		}).expect(404)
	})
	it('should give a 404 error when a user that doesnt exist in the database is passed', () => {
		return request(app).post('/api/articles').send({
			title: "test title",
			topic: "mitch",
			author: "loopylou",
			body: "test body"
		}).expect(404)
	})
})

describe('DELETE /api/articles/:article_id', () => {
	it('should give a 204 status code when passed a valid article_id', () => {
		return request(app).delete('/api/articles/6').expect(204);
	});
	it('should give a 404 status code when passed a article_id that is valid but does not exist', () => {
		return request(app).delete('/api/articles/564').expect(404);
	});
	it('should give a 400 status code when passed a article_id that is invalid', () => {
		return request(app).delete('/api/articles/four').expect(400);
	});
});