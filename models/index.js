const format = require("pg-format");
const db = require("../db/connection");

exports.fetchTopics = () => {
    return db.query(`SELECT * FROM topics`).then((result) => {
        return result.rows;
    })
}

exports.fetchArticles = (topic, sort_by = "created_at", order = "desc") => {
    const queryValues = []
    const validSortByQueries = ['title', 'topic', 'author', 'body', 'created_at', 'article_img_url']
    const validOrderQueries = ['asc', 'desc']
    let queryStr = `
    SELECT articles.*, COUNT(comment_id) as comment_count 
    FROM articles
    JOIN comments
    ON articles.article_id = comments.article_id
    GROUP BY articles.article_id
    `;
    if (topic) {
        queryStr += `HAVING topic = $1 `;
        queryValues.push(topic);
    }

    if (!validSortByQueries.includes(sort_by)) {
        return Promise.reject({ status: 400, message: 'Invalid sort query' });
    } else if (!validOrderQueries.includes(order)) {
        return Promise.reject({ status: 400, message: 'Invalid order query' });
    } else {
        queryStr += `ORDER BY ${sort_by} ${order};`;
    }

    return db.query(queryStr, queryValues).then((result) => {
        if (!result.rowCount) {
            return Promise.reject({ status: 404, message: "Article doesn't exist" });
        }
        return result.rows;
    })
}

exports.fetchArticleById = (id) => {
    const queryStr = `
        SELECT * FROM articles
        WHERE article_id = $1;
        `
    return db.query(queryStr, [id]).then((result) => {
        if (result.rowCount === 0) {
            return Promise.reject({ status: 404, msg: "Article Not Found" });
        }
        return result.rows[0]
    })
}

exports.fetchCommentsByArticleId = (id) => {
    const queryStr = `
        SELECT * FROM comments
        WHERE article_id = $1
        ORDER BY created_at DESC;
        ;
    `
    return db.query(queryStr, [id]).then((result) => {
        return result.rows
    })
}

exports.addCommentByArticleId = (id, commentObj) => {
    const { username, body } = commentObj
    const queryStr = `
        INSERT INTO comments
            (article_id, author, body)
        VALUES
            ($1, $2, $3)
        RETURNING *;
        `;
    return db.query(queryStr, [id, username, body]).then((result) => {
        return result.rows[0]
    })
}

exports.updateArticleByArticleId = (id, inc_votes) => {
    const quesryStr = `
        UPDATE articles 
        SET votes = votes + $1
        WHERE article_id = $2
        RETURNING *;
    `;
    if (typeof inc_votes !== "number") {
        return Promise.reject({ status: 400, msg: "Incorrect data type" });
    }
    return db.query(quesryStr, [inc_votes, id]).then((result) => {
        if (result.rowCount === 0) {
            return Promise.reject({ status: 404, msg: "Article Not Found" });
        } 
        else return result.rows[0]
    })
}

exports.fetchUsers = () => {
    const queryStr = `
        SELECT * FROM users
    `
    return db.query(queryStr).then((result) => {
        return result.rows
    })
}