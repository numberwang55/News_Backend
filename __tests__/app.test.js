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
            expect(article).toHaveProperty("comment_count", expect.any(Number))
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
    // Query tests
    test('200: returns articles with query topic of mitch', () => {
      return request(app)
        .get("/api/articles?topic=mitch")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles).toHaveLength(11)
          articles.forEach(article => {
            expect(article).toHaveProperty("topic", "mitch")
          })
        })
    });
    test('200: returns articles with query topic of cats', () => {
      return request(app)
        .get("/api/articles?topic=cats")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles).toHaveLength(1)
          articles.forEach(article => {
            expect(article).toHaveProperty("topic", "cats")
          })
        })
    });
    test('404: non-existant topic query', () => {
      return request(app)
        .get("/api/articles?topic=test")
        .expect(404)
        .then(({ body: { message } }) => {
          console.log(message);
          expect(message).toBe("Article topic not found. Valid topic queries: mitch and cats")
        })
    });
    test("200: returns articles sorted by comment_count with default order", () => {
      return request(app)
        .get("/api/articles?sort_by=comment_count")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles).toBeSortedBy("comment_count", { descending: true });
        });
    });
    test("200: returns articles sorted by all valid sort by values with default order", () => {
      return request(app)
        .get("/api/articles?sort_by=comment_count")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles).toBeSortedBy("comment_count", { descending: true });
          return request(app)
            .get("/api/articles?sort_by=article_img_url")
            .expect(200)
            .then(({ body: { articles } }) => {
              expect(articles).toBeSortedBy("article_img_url", { descending: true });
              return request(app)
                .get("/api/articles?sort_by=created_at")
                .expect(200)
                .then(({ body: { articles } }) => {
                  expect(articles).toBeSortedBy("created_at", { descending: true });
                  return request(app)
                    .get("/api/articles?sort_by=body")
                    .expect(200)
                    .then(({ body: { articles } }) => {
                      expect(articles).toBeSortedBy("body", { descending: true });
                      return request(app)
                        .get("/api/articles?sort_by=author")
                        .expect(200)
                        .then(({ body: { articles } }) => {
                          expect(articles).toBeSortedBy("author", { descending: true });
                          return request(app)
                            .get("/api/articles?sort_by=topic")
                            .expect(200)
                            .then(({ body: { articles } }) => {
                              expect(articles).toBeSortedBy("topic", { descending: true });
                              return request(app)
                                .get("/api/articles?sort_by=created_at")
                                .expect(200)
                                .then(({ body: { articles } }) => {
                                  expect(articles).toBeSortedBy("created_at", { descending: true });
                                  return request(app)
                                    .get("/api/articles?sort_by=title")
                                    .expect(200)
                                    .then(({ body: { articles } }) => {
                                      expect(articles).toBeSortedBy("title", { descending: true });
                                      return request(app)
                                        .get("/api/articles?sort_by=article_id")
                                        .expect(200)
                                        .then(({ body: { articles } }) => {
                                          expect(articles).toBeSortedBy("article_id", { descending: true });
                                          return request(app)
                                            .get("/api/articles?sort_by=topic")
                                            .expect(200)
                                            .then(({ body: { articles } }) => {
                                              expect(articles).toBeSortedBy("topic", { descending: true });
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    });
    test('400: invalid sort by query', () => {
      return request(app)
        .get("/api/articles?sort_by=test")
        .expect(400)
        .then(({ body: { message } }) => {
          expect(message).toBe('Invalid sort query. Valid queries: article_id, title, topic, author, body, created_at, article_img_url, comment_count');
        })
    });
    test("200: returns articles in ascending order with default sorty by (created_at)", () => {
      return request(app)
        .get("/api/articles?order=asc")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles).toBeSortedBy("created_at", { descending: false });
        });
    });
    test('400: invalid order query', () => {
      return request(app)
        .get("/api/articles?order=test")
        .expect(400)
        .then(({ body: { message } }) => {
          expect(message).toBe('Invalid order query. Valid queries: asc, desc');
        })
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
        .then(({ body: { comment } }) => {
          return request(app)
            .get("/api/articles/2/comments")
            .expect(200)
            .then(({ body: { comments } }) => {
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
        .send({ username: 100, body: "A new comment" })
        .expect(400)
        .then(({ body: { message } }) => {
          expect(message).toBe("Bad Request");
        });
    });
    test('400: post object is missing body property', () => {
      return request(app)
        .post("/api/articles/abc/comments")
        .send({ username: "icellusedkars" })
        .expect(400)
        .then(({ body: { message } }) => {
          expect(message).toBe("Bad Request");
        });
    });
  })
  describe('PATCH /api/articles/:artice_id', () => {
    test('200: responds with updated article with updated vote property incremented', () => {
      return request(app)
        .patch("/api/articles/1")
        .send({ inc_votes: 1 })
        .expect(200)
        .then(({ body, body: { updated_article } }) => {
          expect(body).toHaveProperty("updated_article");
          expect(updated_article).toHaveProperty("votes", 101);
          expect(updated_article).toHaveProperty("author", expect.any(String));
          expect(updated_article).toHaveProperty("title", expect.any(String));
          expect(updated_article).toHaveProperty("article_id", 1);
          expect(updated_article).toHaveProperty("topic", expect.any(String));
          expect(updated_article).toHaveProperty(
            "article_img_url",
            expect.any(String)
          );
          expect(updated_article).toHaveProperty(
            "body",
            expect.any(String)
          );
          expect(updated_article).toHaveProperty(
            "created_at",
            expect.any(String)
          );
        });
    });
    test('200: responds with updated article with updated vote property decremented', () => {
      return request(app)
        .patch("/api/articles/1")
        .send({ inc_votes: -1 })
        .expect(200)
        .then(({ body, body: { updated_article } }) => {
          expect(body).toHaveProperty("updated_article");
          expect(updated_article).toHaveProperty("votes", 99);
          expect(updated_article).toHaveProperty("author", expect.any(String));
          expect(updated_article).toHaveProperty("title", expect.any(String));
          expect(updated_article).toHaveProperty("article_id", 1);
          expect(updated_article).toHaveProperty("topic", expect.any(String));
          expect(updated_article).toHaveProperty(
            "article_img_url",
            expect.any(String)
          );
          expect(updated_article).toHaveProperty(
            "body",
            expect.any(String)
          );
          expect(updated_article).toHaveProperty(
            "created_at",
            expect.any(String)
          );
        });
    });
    test('404: if id not found', () => {
      return request(app)
        .patch("/api/articles/100")
        .send({ inc_votes: 1 })
        .expect(404)
        .then(({ body: { message } }) => {
          expect(message).toBe("Article Not Found");
        });
    });
    test('400: incorrect data type for article_id', () => {
      return request(app)
        .patch("/api/articles/abc")
        .send({ inc_votes: 1 })
        .expect(400)
        .then(({ body: { message } }) => {
          expect(message).toBe("Bad Request");
        });
    });
    test('400: incorrect data type for inc_votes value', () => {
      return request(app)
        .patch("/api/articles/1")
        .send({ inc_votes: "abc" })
        .expect(400)
        .then(({ body: { message } }) => {
          expect(message).toBe("Incorrect data type");
        });
    });
  });
  describe('GET /api/users', () => {
    test('200: responds with users obj containing properties username, name & avatar_url', () => {
      return request(app)
        .get("/api/users")
        .expect(200)
        .then(({ body, body: { users } }) => {
          expect(body).toHaveProperty("users")
          expect(users).toHaveLength(4)
          users.forEach(user => {
            expect(user).toHaveProperty("username")
            expect(user).toHaveProperty("name")
            expect(user).toHaveProperty("avatar_url")
          })
        })
    });
  });
  describe('DELETE /api/comments/:comment_id', () => {
    test('204: deletes comment for given id', () => {
      return request(app)
        .delete("/api/comments/1")
        .expect(204)
        // .then(() => {
        //   return request(app)
        //     .get("/api/articles/1/comments")
        //     .expect(404)
        //     .then(({body: {message}}) => {
        //       console.log(body);
        //       expect(message).toBe("Article Not Found")
        //     })
        // })
    });
  });
});
