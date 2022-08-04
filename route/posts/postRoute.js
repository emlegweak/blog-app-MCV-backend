const express = require('express');
const {createPostController} = require("../../controllers/posts/postsController");
const authMiddleware = require("../../middlewares/auth/authMiddleware");
const {photoUpload} = require("../../middlewares/uploads/photoUpload");
const postRoute = express.Router();

postRoute.post('/', authMiddleware, photoUpload, createPostController);





module.exports = postRoute;