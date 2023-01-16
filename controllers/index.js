const {
    fetchTopics,
    fetchArticles
} = require("../models");

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

exports.getArticleByID = (request, response, next) => {
    
}