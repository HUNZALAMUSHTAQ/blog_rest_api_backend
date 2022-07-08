const express = require("express");
var bodyParser = require('body-parser')

const app = express();

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const postRoute = require("./routes/posts")
app.use("/posts", postRoute)

const userRoute = require("./routes/user")
app.use("/user", userRoute)

const commentRoute = require("./routes/comment")
app.use("/comment", commentRoute)

module.exports = app
