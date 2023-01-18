const express = require("express")
const app = express()
const {
  getTopics,
  getArticles,
  getArticleByID,
  getCommentsByArticleId,
  postCommentByArticleId,
} = require("./controllers")
const errorHandler = require("./controllers/error-handling")

app.use(express.json());

app.get("/api/topics", getTopics)
app.get("/api/articles", getArticles)
app.get("/api/articles/:article_id", getArticleByID)
app.get("/api/articles/:article_id/comments", getCommentsByArticleId)
app.post("/api/articles/:article_id/comments", postCommentByArticleId)

errorHandler(app)

module.exports = app;