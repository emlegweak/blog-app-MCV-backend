const mongoose = require("mongoose");

//create schema - blueprint of post instance
const postSchema = new mongoose.Schema({
    title:{
        type: String,
        required: [true, 'Post title is required'],
        trim: true,
    },
    //created by admin
    category:{
        type: String,
        required: [true, 'Post category is required'],
        default: 'All',
    },
    isLiked:{
        type: Boolean,
        default: false,
    },
    isDisliked: {
        type: Boolean,
        default: false,
    },
    numberOfViews:{
        type: Number,
        default: 0,
    },
    likes:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
    ],
    dislikes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
    ],
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, "Post author is required."],
    },
    description: {
        type: String,
        required: [true, "Post description is required."],
    },
    image:{
        type: String,
        default: "https://images.unsplash.com/photo-1531564701487-f238224b7ce3?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8cG9zdHxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=1400&q=60",
    },

}, {
    toJSON:{
        virtuals: true,
    },
    toObject:{
        virtuals: true,
    },
    timestamps: true,
});

//compile model
const Post = mongoose.model('Post', postSchema);

module.exports = Post;