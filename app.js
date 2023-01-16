const express = require("express")
const app = express()
const { getTopics } = require("./controllers/news_controller")

app.get("/api/topics", getTopics)

app.use((err, request, response, next) => {
    if (err.code) console.log(err);
    else next(err);
});


app.use((err, request, response, next) => {
    console.log(err);
    response.status(500).send("Internal server error");
});

module.exports = app;