const app = require("../app")
const request = require("supertest")
const db = require("../db/connection")
const seed = require("../db/seeds/seed")
const testData = require("../db/data/test-data")

beforeEach(() => {
    return seed(testData)
});

afterAll(() => {
    db.end()
})

describe('App', () => {
    describe('GET /api/topics', () => {
        test('should return 404 error if endpoint is misspelled', () => {
            return request(app).get("/api/topic")
                .expect(404)
        });
        test('should respond with a status of 200 & array of topics objects with properties of slug and description', () => {
            return request(app).get("/api/topics")
                .expect(200)
                .then((result) => {
                    const {
                        body,
                        body: { topics },
                    } = result;
                    expect(body).toHaveProperty("topics");
                    expect(topics.length).toBeGreaterThanOrEqual(1);
                    topics.forEach((topic) => {
                        expect(topic).toHaveProperty("slug");
                        expect(topic).toHaveProperty("description");
                    });
                });
        });
    });
    describe('GET /api/articles', () => {
        test('should respond with 404 if incorrect endpoint', () => {
            return request(app).get("/api/article")
                .expect(404)
        });
        test('should respond with 200 and an array of objects containing properties article_id, title, topic, author, body, created_at, votes and article_img_url and comment_count', () => {
            return request(app).get("/api/articles")
                .expect(200)
                .then(({ body, body: { articles } }) => {
                    expect(body).toHaveProperty("articles")
                    expect(articles.length).toBeGreaterThanOrEqual(1)
                    articles.forEach(article => {
                        expect(article).toHaveProperty("article_id", expect.any(Number))
                        expect(article).toHaveProperty("title", expect.any(String))
                        expect(article).toHaveProperty("topic", expect.any(String))
                        expect(article).toHaveProperty("author", expect.any(String))
                        expect(article).toHaveProperty("body", expect.any(String))
                        expect(article).toHaveProperty("created_at", expect.any(String))
                        expect(article).toHaveProperty("votes", expect.any(Number))
                        expect(article).toHaveProperty("article_img_url", expect.any(String))
                        expect(article).toHaveProperty("comment_count", expect.any(String))
                    })
                })
        });
        test('should return array of objects sorted by created_at property', () => {
            return request(app).get("/api/articles")
                .expect(200)
                .then(({ body: { articles } }) => {
                    expect(articles).toBeSortedBy("created_at", {
                        descending: true,
                    });
                });
        });
    });
});
