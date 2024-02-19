const request = require("supertest");
const app = require("../app.js");
const seed = require("../db/seeds/seed.js");
const db = require("../db/connection.js");
const data = require("../db/data/test-data/index.js");
const allEndpoints = require('../endpoints.json')

beforeEach(() => seed(data));
afterAll(() => db.end());

describe('error handling', () => {
    it('should return a 404 for not found', () => {
        return request(app).get("/api/topix").expect(404)
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

describe('GET /api', () => {
    it('should return an object detailing all the available endpoints on the API', () => {
        return request(app)
        .get("/api")
        .expect(200)
        .then((data) => {
            const sampleObj = allEndpoints
            expect(data.body).toEqual(sampleObj)
        })
    });
});
