const format = require("pg-format");
const db = require("../db/connection");

exports.fetchTopics = () => {
    return db.query(`SELECT * FROM topics`).then((result) => {
        return result.rows;
    })
}

exports.fetchArticles = () => {
    const queryStr = `
    SELECT articles.article_id, articles.title, articles.topic, 
    articles.author, articles.body, articles.created_at, articles.votes,
    articles.article_img_url, COUNT(comment_id) as comment_count 
    FROM articles
    JOIN comments
    ON articles.article_id = comments.article_id
    GROUP BY articles.article_id
    ORDER BY created_at DESC;
    `;
    return db.query(queryStr).then((result) => {
        return result.rows;
    })
}