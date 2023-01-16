const {
    fetchTopics
} = require("../models/news_model");

exports.getTopics = (request, response, next) => {
    fetchTopics().then((topics) => {
        response.status(200).send({topics})
    })
    .catch(next);
};