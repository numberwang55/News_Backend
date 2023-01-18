const {
    fetchTopics,
    fetchArticles,
    fetchArticleById,
    fetchCommentsByArticleId,
    addCommentByArticleId
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

exports.getCommentsByArticleId = (request, response, next) => {
    const { article_id } = request.params
    Promise.all([fetchCommentsByArticleId(article_id), fetchArticleById(article_id)])
    .then(([comments]) => {
        response.status(200).send({ comments })
    }).catch(next)
}

exports.postCommentByArticleId = (request, response, next) => {
    const { article_id } = request.params
    const { body } = request
    Promise.all([fetchArticleById(article_id), addCommentByArticleId(article_id, { ...body })])
        .then(([_, comment]) => {
            response.status(201).send({ comment })
        }).catch(next)
}