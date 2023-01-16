const express = require("express")
const app = express()
const { 
    getTopics,
    getArticles,
    getArticleByID
} = require("./controllers")

app.get("/api/topics", getTopics)
app.get("/api/articles", getArticles)
app.get("/api/articles/:article_id", getArticleByID)

app.use((err, req, res, next) => {
    if (err.status === 404) {
      res.status(err.status).send({ message: err.msg });
    } else next(err);
});


app.use((err, request, response, next) => {
    if (err.code === "22P02") {
      response.status(400).send({ message: "Bad Request" });
    } else next(err);
  });

app.use((err, request, response, next) => {
    console.log(err);
    response.status(500).send("Internal server error");
});

module.exports = app;