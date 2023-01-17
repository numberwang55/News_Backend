const express = require("express")
const app = express()
const {
  getTopics,
  getArticles,
  getArticleByID,
  getCommentsByArticleId
} = require("./controllers")
const errorHandler = require("./controllers/error-handling")

app.get("/api/topics", getTopics)
app.get("/api/articles", getArticles)
app.get("/api/articles/:article_id", getArticleByID)
app.get("/api/articles/:article_id/comments", getCommentsByArticleId)

errorHandler(app)

module.exports = app;