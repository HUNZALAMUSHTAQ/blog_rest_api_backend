const express = require("express")
const postController = require("../controllers/post.controller")
const checkAuthMiddleware = require("../middlewares/auth")

const router = express.Router()

router.get("/",  postController.index)
router.get("/comments/:id",  postController.commentsByPost)
router.post("/", checkAuthMiddleware.checkAuth, postController.save)
router.get("/:id",  postController.show)
router.patch("/update/:id", checkAuthMiddleware.checkAuth, postController.update)
router.delete("/:id", checkAuthMiddleware.checkAuth, postController.deletePost)   

module.exports = router