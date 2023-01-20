const db = require("../db/connection");
const fs = require("fs/promises");

exports.fetchTopics = () => {
    return db.query(`SELECT * FROM topics`).then((result) => {
        return result.rows;
    })
}

exports.fetchArticles = (topic, sort_by = "created_at", order = "desc") => {
    const queryValues = []
    const validSortByQueries = ['article_id', 'title', 'topic', 'author', 'body', 'created_at', 'article_img_url', 'comment_count']
    const validOrderQueries = ['asc', 'desc']
    const validTopicQueries = ["mitch", "cats"];
    let queryStr = `
    SELECT articles.*, COUNT(comment_id)::INT AS comment_count 
    FROM articles
    LEFT JOIN comments
    ON articles.article_id = comments.article_id
    `;

    if (!validSortByQueries.includes(sort_by)) {
        return Promise.reject({ status: 400, msg: `Invalid sort query. Valid queries: ${validSortByQueries.join(", ")}` });
    }
    if (!validOrderQueries.includes(order)) {
        return Promise.reject({ status: 400, msg: `Invalid order query. Valid queries: ${validOrderQueries.join(", ")}` });
    }

    if (topic) {
        queryStr += ` WHERE topic = $1 `;
        queryValues.push(topic);
    }
    queryStr += ` GROUP BY articles.article_id`;
    queryStr += ` ORDER BY ${sort_by} ${order.toUpperCase()};`;

    return db.query(queryStr, queryValues).then(({ rows: articles, rowCount }) => {
        if (rowCount === 0 && !validTopicQueries.includes(topic)) {
            return Promise.reject({ status: 404, msg: `Article topic not found. Valid topic queries: ${validTopicQueries.join(" and ")}` });
        }
        return articles;
    })
}

exports.fetchArticleById = (id) => {
    const queryStr = `
        SELECT articles.*, COUNT(comment_id)::INT AS comment_count 
        FROM articles
        LEFT JOIN comments
        ON articles.article_id = comments.article_id
        WHERE articles.article_id = $1
        GROUP BY articles.article_id;
        `
    return db.query(queryStr, [id]).then((result) => {
        if (result.rowCount === 0) {
            return Promise.reject({ status: 404, msg: "Article Not Found" });
        } else {
            return result.rows[0]
        }
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

exports.removeCommentByCommentId = (id) => {
    const queryStr = `
        DELETE FROM comments 
        WHERE comment_id = $1
        RETURNING *;
    `
    return db.query(queryStr, [id]).then((result) => {
        if (!result.rows[0]) {
            return Promise.reject({ status: 404, msg: `Comment with ID of ${id} not found` });
        }
        return result.rows[0]
    })
}

exports.fetchApiEndpoints = () => {
    return fs.readFile("endpoints.json", "utf-8")
        .then((result) => {
            return JSON.parse(result)
        })
}