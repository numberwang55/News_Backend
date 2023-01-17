const format = require("pg-format");
const db = require("../db/connection");

exports.fetchTopics = () => {
    return db.query(`SELECT * FROM topics`).then((result) => {
        return result.rows;
    })
}

exports.fetchArticles = () => {
    const queryStr = `
    SELECT articles.*, COUNT(comment_id) as comment_count 
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

exports.fetchArticleById = (id) => {
    const queryStr = `
        SELECT * FROM articles
        WHERE article_id = $1;
        `
    return db.query(queryStr, [id]).then((result) => {
        if (!result.rows[0]) return Promise.reject({ status: 404, msg: "Article Not Found" });
        return result.rows[0]
    })
}

exports.addCommentByArticleId = (id, commentObj) => {
    const queryStr = `
    
    `
}
