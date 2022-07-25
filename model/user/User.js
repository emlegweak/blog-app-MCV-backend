const mongoose=require('mongoose');
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

//create schema
const userSchema = new mongoose.Schema(
    {
    firstName: {
        required:[true, "First Name is required"],
        type: String,
    },
    lastName: {
        required: [true, "Last Name is required"],
        type: String,
    },
    profilePhoto:{
        type: String,
        default:"https://images.unsplash.com/photo-1602779717364-d044d7492ed7?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxjb2xsZWN0aW9uLXBhZ2V8MXwyNzk5OTkzM3x8ZW58MHx8fHw%3D&auto=format&fit=crop&w=1400&q=60",
    },
    email:{
        type: String,
        required:[true, "Email is required"],
    },
    bio:{
        type: String,
    },
    password:{
        type: String,
        required: [true, "Password is required"],
    },
    postCount:{
        type: Number,
        default: 0,
    },
    isBanned:{
        type: Boolean,
        default: false,
    },
    isAdmin:{
        type: Boolean,
        default: false,
    },
    role:{
        type: String,
        enum: ["Admin","Guest","Blogger"],
    },
    isFollowing:{
        type: Boolean,
        default: false,
    },
    isUnfollowing:{
        type: Boolean,
        default: false,
    },
    isAccountVerified:{
        type: Boolean,
        default: false,
    },

    accountVerificationToken: String,
    accountVerificationTokenExpires: Date,

    viewedBy: {
        type: [
            {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            },
        ],
    },

    followers: {
        type: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],
    },

    following: {
        type: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],
    },    

    passwordChangeAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,

    active:{
        type: Boolean,
        default: false,
    },
}, 
{
    toJSON:{
        virtuals: true,
    },
    toObject:{
        virtuals: true,
    },
    timestamp:{
        timestamps: true,
    }
});

//hash password 
userSchema.pre('save', async function(next){
    if(!this.isModified('password')){
        next();
    }
    //hash
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

//compare password
//methods available on all instances of the objects created by this model
userSchema.methods.isPasswordMatched = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password);
};

//verify account
userSchema.methods.createAccountVerificationToken = async function(){
    //create a token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    //hash token and save in db
    this.accountVerificationToken = crypto.createHash("sha256").update(verificationToken).digest("hex");
    //verification token expiration
    this.accountVerificationTokenExpires = Date.now() + 30 * 60 * 1000; //10 minutes
    return verificationToken;
};

//compile schema into model
const User = mongoose.model('User', userSchema);

module.exports= User;