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
            .then((result) => {
                console.log(result);
            })
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
});
