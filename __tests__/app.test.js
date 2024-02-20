const request = require("supertest");
const app = require("../app.js");
const seed = require("../db/seeds/seed.js");
const db = require("../db/connection.js");
const data = require("../db/data/test-data/index.js");
const allEndpoints = require("../endpoints.json");

beforeEach(() => seed(data));
afterAll(() => db.end());

describe("error handling", () => {
	it("should return a 404 for not found", () => {
		return request(app).get("/api/topix").expect(404);
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
		return request(app).get("/api/articles/90909").expect(404);
	});
	it("should return with a 400 status code when passed an article id that is invalid - the parameter should be an integer", () => {
		return request(app).get("/api/articles/nine").expect(400);
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
