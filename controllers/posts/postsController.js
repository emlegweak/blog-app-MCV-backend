const expressAsyncHandler = require("express-async-handler");
const Filter = require('bad-words');
const Post = require("../../model/post/Post");
const validateMongoDbId = require("../../utils/validateMongoDBID");
const User = require("../../model/user/User");

//create post
const createPostController = expressAsyncHandler(async(req,res) =>{
    //verify user id
    const  _id  = req.body.user;
    validateMongoDbId(req.body.user)
    //check for profanity
    const filter = new Filter();
    const isProfane = filter.isProfane(req.body.title, req.body.description);
    //ban user
    if(isProfane){
        const user = await User.findByIdAndUpdate(_id, {
            isBanned: true,
        });
        throw new Error('Post creation failed. Use of profanity is not allowed and you have been banned.')
    }
    //try{
    //    const post = await Post.create(req.body);
    //    res.json(post);
    //}catch(error){
    //    res.json(error);
    //}
});

module.exports = {createPostController}