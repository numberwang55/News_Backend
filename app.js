const express = require("express")
const app = express()
const { 
    getTopics,
    getArticles
} = require("./controllers")

app.get("/api/topics", getTopics)
app.get("/api/articles", getArticles)

app.use((err, req, res, next) => {
    if (err.status === 404) {
      res.status(err.status).send({ message: err.message });
    } else next(err);
});

app.use((err, request, response, next) => {
    console.log(err);
    response.status(500).send("Internal server error");
});

module.exports = app;