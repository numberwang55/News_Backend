const express = require("express")
const app = express()
const {
  getTopics,
  getArticles,
  getArticleByID,
  getCommentsByArticleId,
  postCommentByArticleId,
  patchArticleByArticleId,
  getUsers
} = require("./controllers")
const {
  defaultErrorHandler,
  customErrorHAndler,
  psqlErrorHandler,
  serverErrorHandler
} = require("./error-handling")

app.use(express.json());

app.get("/api/topics", getTopics)
app.get("/api/articles", getArticles)
app.get("/api/articles/:article_id", getArticleByID)
app.get("/api/articles/:article_id/comments", getCommentsByArticleId)
app.post("/api/articles/:article_id/comments", postCommentByArticleId)
app.patch("/api/articles/:article_id", patchArticleByArticleId)
app.get("/api/users", getUsers)

defaultErrorHandler(app)
app.use(customErrorHAndler)
app.use(psqlErrorHandler)
app.use(serverErrorHandler)

module.exports = app;