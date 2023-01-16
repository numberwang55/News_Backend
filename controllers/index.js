const {
    fetchTopics,
    fetchArticles,
    fetchArticleById
} = require("../models");

exports.getTopics = (request, response, next) => {
    fetchTopics().then((topics) => {
        response.status(200).send({ topics })
    }).catch(next);
};

exports.getArticles = (request, response, next) => {
    fetchArticles().then((articles) => {
        response.status(200).send({ articles })
    }).catch(next)
}

exports.getArticleByID = (request, response, next) => {
    const { article_id } = request.params
    fetchArticleById(article_id).then((article) => {
        response.status(200).send({ article })
    }).catch(next)
}