const format = require("pg-format");
const db = require("../db/connection");

exports.fetchTopics = () => {
    return db.query(`SELECT * FROM topics`).then((result) => {
        return result.rows;
    })
}

exports.fetchArticleById = () => {
    
}