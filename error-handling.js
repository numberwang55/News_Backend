exports.defaultErrorHandler = (app) => {
    app.use("/*", (req, res, next) => {
        res.status(404).send({ msg: "Path not found" })
    })
}

exports.customErrorHAndler = (err, req, res, next) => {
    if (err.status) {
        res.status(err.status).send({ message: err.msg });
    } else next(err);
}

exports.psqlErrorHandler = (err, request, response, next) => {
    if (err.code === "22P02") {
        response.status(400).send({ message: "Bad Request" });
    } else next(err);
}

exports.serverErrorHandler = (err, request, response, next) => {
    console.log(err);
    response.status(500).send("Internal server error");
}