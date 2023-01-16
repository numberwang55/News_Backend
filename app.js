const express = require("express")
const app = express()
const { 
    getTopics,
    getArticles
} = require("./controllers/news_controller")

app.get("/api/topics", getTopics)
app.get("/api/articles", getArticles)

app.use((err, request, response, next) => {
    console.log(err);
    response.status(500).send("Internal server error");
});

module.exports = app;