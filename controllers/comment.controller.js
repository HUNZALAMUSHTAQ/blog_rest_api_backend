const Validator = require("fastest-validator")
const models = require("../models")

function save(req, res) {
    // Request Data
    const comment = {
        content: req.body.content,
        postId: req.body.post_id,
        userId: req.user.userId
    }
    console.log(comment)

    // Request Validations
    const schema = {
        content: { type: "string", optional: false, max: "500" },
        postId: { type: "number", optional: false },
        userId: { type: "number", optional: false }

    }
    const v = new Validator()
    const validationResponse = v.validate(comment, schema)

    if (validationResponse !== true) {
        return res.status(400).json({
            message: "Validation Failed",
            error: validationResponse
        })
    }


    // Checking Wether the Post Exist Or Not
    // Request Data
    const postId = req.body.post_id
    // Model Interface for Post
    models.Post.findByPk(postId)
        .then(result => {

            if (result) {
                // ----------- Checking If Post Exist or Not -----------
                // Model Interface For Comment 
                models.Comment.create(comment).then(result => {
                    res.status(201).json({
                        message: "Comment Added Succesfully",
                        comment: result
                    })
                }).catch(err => {
                    res.status(500).json({
                        message: "Something Went Worng ",
                        comment: err
                    })
                })
                // ----------- Checking If Post Exist or Not -----------

            } else {
                res.status(404).json({ message: "Post Not Found" })
            }
        })
        .catch(err => {
            res.status(500).json({ message: "Something Went Wrong ", error: err })
        })

}


// User Will show all its own Comments 
const index = (req, res) => {

    models.Comment.findAll({ where: { userId: req.user.userId } })
        .then(result => {

            console.log(result)
            res.status(200).json(result)

        })
        .catch(err => {

            res.status(500).json({ message: "Something Went Wrong ", error: err })
        })
}

// But all User can access the comment by id 

const show = (req, res) => {
    const id = req.params.id

    models.Comment.findByPk(id)
        .then(result => {
            if (result) {
                res.status(200).json(result)
            } else {
                res.status(401).json({ "error": "Comment Not Found" })

            }
        })
        .catch(err => {
            res.status(500).json({ message: "Something Went Wrong", error: err })
        })
}

const update = (req, res) => {

    // Request Data
    const updatedComment = {
        content: req.body.content,
        postId: req.body.post_id
    }
    // console.log(comment)
    if(req.body.post_id){
        return res.status(400).json({
            message: "You Cannot Update Post Id Just delete it"
        })
    }

    // Request Validations
    const schema = {
        content: { type: "string", optional: false, max: "500" },
        postId: { type: "number", optional: true }

    }
    const v = new Validator()
    const validationResponse = v.validate(updatedComment, schema)

    if (validationResponse !== true) {
        return res.status(400).json({
            message: "Validation Failed",
            error: validationResponse
        })
    }
     const id = req.params.id
     const userId = req.user.userId


    // Model Interface
    models.Comment.update(updatedComment, { where: { id: id, userId: userId } })
        .then(result => {
            if (result[0]) {

                console.log(result)
                res.status(200).json({
                    message: "Succesfully Updated",
                    comment: updatedComment
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

const deleteComment = (req, res) =>{
       // Request Data
       const id = req.params.id
       const userId = req.user.userId
   
       // Model Interface
       models.Comment.destroy({ where: { userId: userId, id: id } })
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
module.exports = {
    save: save,
    index: index,
    show: show, 
    update: update,
    deleteComment: deleteComment
}