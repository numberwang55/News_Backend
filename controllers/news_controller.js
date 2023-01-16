const {
    fetchTopics,
    fetchArticles
} = require("../models/news_model");

exports.getTopics = (request, response, next) => {
    fetchTopics().then((topics) => {
        response.status(200).send({topics})
    })
    .catch(next);
};

exports.getArticles = (request, response, next) => {
    fetchArticles().then((articles) => {
        response.status(200).send({articles})
    })
    .catch(next)
}