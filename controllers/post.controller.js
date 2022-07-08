const { json } = require("body-parser")
const Validator = require("fastest-validator")
const models = require("../models")

function save(req, res) {
    // Request Data
    console.log(req.body.title)
    const post = {
        title: req.body.title,
        content: req.body.content,
        imageUrl: req.body.image_url,
        categoryId: req.body.category_id,
        userId: req.user.userId
    }

    // Request Validations
    const schema = {
        title: { type: "string", positive: true, integer: true, optional: false, max: "100" },
        content: { type: "string", optional: false, max: "500" },
        categoryId: { type: "number", optional: false }
    }
    const v = new Validator()
    const validationResponse = v.validate(post, schema)

    if (validationResponse !== true) {
        return res.status(400).json({
            message: "Validation Failed",
            error: validationResponse
        })
    }

    // Model Interface
    models.Post.create(post).then(result => {
        res.status(201).json({
            message: "Post Created Succesfully",
            post: result
        })
    }).catch(err => {
        res.status(500).json({
            message: "Something Went Worng ",
            post: err
        })
    })
}

function show(req, res) {

    // Request Data
    const id = req.params.id
    console.log(id)

    // models.Comment.findAll({ where: { postId: id } })
    //     .then(result => {

    //         console.log(result)
    //         res.status(200).json(result)

    //     })
    //     .catch(err => {

    //         res.status(500).json({ message: "Something Went Wrong ", error: err })
    //     })

    // Model Interface
    models.Post.findByPk(id)

        .then(data => {
            if (data) {


                models.Comment.findAll({ where: { postId: id } })

                    .then(result => {
                        // Custom  well without using association in sequelize
                        let postData = data["dataValues"]
                        postData.comments = result
                        res.status(200).json( data)

                    })
                    .catch(err => {
                        console.log(err)
                        res.status(500).json({ message: "Something Went Wrong In getting the comments ", error: err })
                    })

            } else {
                res.status(404).json({ message: "Post Not Found" })
            }
        })
        .catch(err => {
            res.status(500).json({ message: "Something Went Wrong ", error: err })
        })
}


const index = (req, res) => {
    // console.log(req.user.userId)

    // Model Interface
    // models.Post.findAll()
    //     .then(result => {
    //         res.status(200).json(result)
    //     })
    //     .catch(err => {
    //         res.status(500).json({ message: "Something Went Wrong ", error: err })
    //     })
    // const userId = req.user.userId

    models.Post.findAll()
        .then(result => {

            console.log(result)
            res.status(200).json(result)

        })
        .catch(err => {

            res.status(500).json({ message: "Something Went Wrong ", error: err })
        })
}

const update = (req, res) => {

    // Request Data
    const id = req.params.id
    const updatedPost = {
        title: req.body.title,
        content: req.body.content,
        imageUrl: req.body.image_url,
        categoryId: req.body.category_id
    }
    const userId = req.user.userId

    // Request Validation
    const schema = {
        title: { type: "string", positive: true, integer: true, optional: true, max: "100" },
        content: { type: "string", optional: true, max: "500" },
        categoryId: { type: "number", optional: true }
    }
    const v = new Validator()
    const validationResponse = v.validate(post, schema)

    if (validationResponse !== true) {
        return res.status(400).json({
            message: "Validation Failed",
            error: validationResponse
        })
    }

    // Model Interface
    models.Post.update(updatedPost, { where: { id: id, userId: userId } })
        .then(result => {
            if (result[0]) {

                console.log(result)
                res.status(200).json({
                    message: "Succesfully Updated",
                    post: updatedPost
                })
            } else {
                res.status(404).json({ message: "Post Not Found" })
            }
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({ message: "Something Went Wrong ", error: err })
        })
}

const deletePost = (req, res) => {

    // Request Data
    const id = req.params.id
    const userId = req.user.userId

    // Model Interface
    models.Post.destroy({ where: { userId: userId, id: id } })
        .then(result => {
            if (result) {
                res.status(200).json({
                    message: "Post deleted " + id,
                    post: result
                })
            } else {
                res.status(404).json({ message: "Post Not Found" })
            }

        })
        .catch(err => {

            console.log(err)
            res.status(500).json({ message: "Something Went Wrong ", error: err })
        })
}

const commentsByPost = (req, res) =>{
    const postId = req.params.id 
    models.Comment.findAll({ where: { postId:postId } })
    
    .then(result => {
    
        if(result.length === 0){
            res.status(400).json({"message": `There are No comments on post ${postId}`})

        }else{
            console.log(result)
            res.status(200).json(result)

        }


    })
    .catch(err => {
        console.log(err)
        res.status(500).json({ message: "Something Went Wrong ", error: err })
    })

}

module.exports = {
    index: index,
    save: save,
    show: show,
    update: update,
    deletePost: deletePost,
    commentsByPost: commentsByPost
}