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
  describe('Error-handling - 404 error for incorrect endpoint', () => {
    test('should return 404 error if an endpoint is misspelled', () => {
      return request(app).get("/api/topic")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Path not found")
        })
    });
  });
  describe('GET /api/topics', () => {
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
    test('should respond with status 200 and an array of objects containing properties article_id, title, topic, author, body, created_at, votes and article_img_url and comment_count', () => {
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
  describe('GET /api/articles/:article_id', () => {
    test('should return 400 error if incorrect data type used as the parametric endpoint', () => {
      return request(app).get("/api/articles/abc")
        .expect(400)
        .then(({ body: { message } }) => {
          expect(message).toBe("Bad Request");
        });
    });
    test('404: if id not found', () => {
      return request(app).get("/api/articles/100")
        .expect(404)
        .then(({ body: { message } }) => {
          expect(message).toBe("Article Not Found")
        })
    });
    test('should respond with status 200 and an object containing properties article_id, title, topic, author, body, created_at, votes and article_img_url & match article for id of 1', () => {
      return request(app).get("/api/articles/1")
        .expect(200)
        .then(({ body, body: { article } }) => {
          expect(body).toHaveProperty("article")
          const articleId1 = {
            article_id: 1,
            title: 'Living in the shadow of a great man',
            topic: 'mitch',
            author: 'butter_bridge',
            body: 'I find this existence challenging',
            created_at: '2020-07-09T20:11:00.000Z',
            votes: 100,
            article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700'
          }
          expect(article).toMatchObject(articleId1)
        })
    });
  });
  describe('GET /api/articles/:article_id/comments', () => {
    test("should return empty array when a valid article id has no comments", () => {
      return request(app)
        .get("/api/articles/2/comments")
        .expect(200)
        .then(({ body: { comments } }) => {
          expect(comments.length).toBe(0)
          expect(comments).toEqual([])
        });
    });
    test('200: should return array of comments for the corresponding article id. Object should contain properties comment_id, votes, created_at, author, body and article_id', () => {
      return request(app)
        .get("/api/articles/3/comments")
        .expect(200)
        .then(({ body, body: { comments } }) => {
          expect(body).toHaveProperty("comments")
          expect(comments.length).toBeGreaterThanOrEqual(1)
          comments.forEach(comment => {
            expect(comment).toHaveProperty("comment_id", expect.any(Number))
            expect(comment).toHaveProperty("body", expect.any(String))
            expect(comment).toHaveProperty("article_id", expect.any(Number))
            expect(comment).toHaveProperty("author", expect.any(String))
            expect(comment).toHaveProperty("votes", expect.any(Number))
            expect(comment).toHaveProperty("created_at", expect.any(String))
          })
        })
    });
    test("should return the array of comments sorted by created_at in descending order", () => {
      return request(app)
        .get("/api/articles/3/comments")
        .expect(200)
        .then(({ body: { comments } }) => {
          expect(comments).toBeSortedBy("created_at", { descending: true });
        });
    });
    test('404: if id not found', () => {
      return request(app)
        .get("/api/articles/100/comments")
        .expect(404)
        .then(({ body: { message } }) => {
          expect(message).toBe("Article Not Found")
        })
    });
    test('400: if id is an incorrect data type', () => {
      return request(app)
        .get("/api/articles/abc/comments")
        .expect(400)
        .then(({ body: { message } }) => {
          expect(message).toBe("Bad Request")
        })
    });
  });
  describe('POST /api/articles/:article_id/comments', () => {
    test("201: returns the new comment object", () => {
      return request(app)
        .post("/api/articles/2/comments")
        .send({ username: "icellusedkars", body: "A new comment" })
        .expect(201)
        .then(({ body, body: { comment } }) => {
          expect(body).toHaveProperty("comment");
          expect(comment).toHaveProperty("author", "icellusedkars");
          expect(comment).toHaveProperty("body", "A new comment");
          expect(comment).toHaveProperty("comment_id", 19);
          expect(comment).toHaveProperty("created_at", expect.any(String));
          expect(comment).toHaveProperty("article_id", 2);
          expect(comment).toHaveProperty("votes", 0);
        })
    });
    test('200: new comment has successfully been added', () => {
      return request(app)
        .post("/api/articles/2/comments")
        .send({ username: "icellusedkars", body: "A new comment" })
        .then(({ body, body: { comment } }) => {
          return request(app)
            .get("/api/articles/2/comments")
            .expect(200)
            .then(({ body, body: { comments } }) => {
              expect(comments[0]).toMatchObject(comment)
            })
        })
    });
    test('404: if id not found', () => {
      return request(app)
        .post("/api/articles/100/comments")
        .expect(404)
        .send({ username: "icellusedkars", body: "A new comment" })
        .then(({ body: { message } }) => {
          expect(message).toBe("Article Not Found");
        });
    });
    test('400: incorrect data type for article_id', () => {
      return request(app)
        .post("/api/articles/abc/comments")
        .expect(400)
        .send({ username: "icellusedkars", body: "A new comment" })
        .then(({ body: { message } }) => {
          expect(message).toBe("Bad Request");
        });
    });
    test('400: incorrect data type for username value', () => {
      return request(app)
        .post("/api/articles/abc/comments")
        .expect(400)
        .send({ username: 100, body: "A new comment" })
        .then(({ body: { message } }) => {
          expect(message).toBe("Bad Request");
        });
    });
    test('400: post object is missing body property', () => {
      return request(app)
        .post("/api/articles/abc/comments")
        .expect(400)
        .send({ username: "icellusedkars" })
        .then(({ body: { message } }) => {
          expect(message).toBe("Bad Request");
        });
    });
  })
});