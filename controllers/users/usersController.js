const expressAsyncHandler = require("express-async-handler");
const sgMail = require("@sendgrid/mail");
const dotenv = require("dotenv");
const crypto = require("crypto");
const generateToken = require("../../config/token/generateToken");
const validateMongoDbId = require("../../utils/validateMongoDBID")
const User = require("../../model/user/User");

dotenv.config();
sgMail.setApiKey(process.env.SEND_GRID_API_KEY);

/*
=======================
Register, Check if user already exists
=======================
*/

const userRegisterController = expressAsyncHandler(async(req,res) =>{
    //check if user already exists
    const userExists = await User.findOne({ email: req?.body?.email });
    if (userExists){
        throw new Error("User already exists with this email address. Please try again or click the option to reset your password.")
    }

    try {
        //register user
        const user = await User.create({
            firstName: req?.body?.firstName, //shorthand for req.body && req.body.firstName
            lastName: req?.body?.lastName,
            email: req?.body?.email,
            password: req?.body?.password,
        });
        res.json(user);
    } catch (error) {
        res.json(error);
    }
});

/*
=======================
User Login, Generate token
=======================
*/

const userLoginController = expressAsyncHandler(async(req,res) => {
    const { email,password } = req.body;
    //check if user exists
    const userFound = await User.findOne({email});
    //check if password matches existing password
    if(userFound && (await userFound.isPasswordMatched(password))){
        res.json({
            _id: userFound?._id,
            firstName: userFound?.firstName,
            lastName: userFound?.lastName,
            email: userFound?.email,
            profilePhoto: userFound?.profilePhoto,
            isAdmin: userFound?.isAdmin,
            token: generateToken(userFound?._id),
        });
    }else{
        res.status(401);
        throw new Error("Invalid Login Credentials.")
    };
});

/*
=======================
fetch all users
=======================
*/

const userFetchController = expressAsyncHandler(async(req,res) =>{
    console.log(req.headers);
    try{
        const users = await User.find({});
        res.json(users);

    }catch(error){
        res.json(error);
    }
})

/*
=======================
delete a user (by checking for valid user id - custom middleware in utils)
=======================
*/

const userDeleteController = expressAsyncHandler(async (req, res) => {
    const { id } = req.params;
    //check if user id is valid
    validateMongoDbId(id);
    try {
        const deletedUser = await User.findByIdAndDelete(id);
        res.json(deletedUser);

    } catch (error) {
        res.json(error);
    }
});

/*
=======================
fetch one user
=======================
*/

const userFetchOneController = expressAsyncHandler(async (req, res) => {
    const { id } = req.params;
    //check if user id is valid
    validateMongoDbId(id);
    try {
        const user = await User.findById(id);
        res.json(user);

    } catch (error) {
        res.json(error);
    }
});

/*
=======================
user profile - can only be viewed by the logged-in user
=======================
*/

const userProfileController = expressAsyncHandler(async(req,res) =>{
    const { id } = req.params;
    //check if user id is valid
    validateMongoDbId(id);
    try{
        const myProfile = await User.findById(id)
        res.json(myProfile);
    }catch(error){
        res.json(error);
    }
});

/*
=======================
update user profile
=======================
*/

const updateUserProfileController = expressAsyncHandler(async(req,res) =>{
   const { _id } = req?.user;
   //check if user id is valid
   validateMongoDbId(_id);
    const user = await User.findByIdAndUpdate(
        _id,
        {
            firstName: req?.body?.firstName,
            lastName: req?.body?.lastName,
            email: req?.body?.email,
            bio: req?.body?.bio,
        },
        {
            new: true,
            runValidators: true,
        }
    );
    res.json(user);
});

/*
=======================
update user password
=======================
*/

const updateUserPasswordController = expressAsyncHandler(async (req,res) =>{
    //destructure _id from req.user
    const { _id } = req.user;
    //destructure password field from req.body
    const { password } = req.body;
    validateMongoDbId(_id);
    //find user by id
    const user = await User.findById(_id);

    if(password){
        user.password = password;
        const updatedUser = await user.save();
        res.json(updatedUser);
    }else{
        res.json(user);
    }
});

/*
=======================
follow another user
=======================
*/

const followingUserController = expressAsyncHandler(async(req,res) =>{
    const { followId } = req.body;
    const loginUserId = req.user.id;

    //find the target user and check if the login id exist
    const targetUser = await User.findById(followId);
    const alreadyFollowing = targetUser?.followers?.find(
        user => user?.toString() === loginUserId.toString()
    );

    if (alreadyFollowing) throw new Error("You have already followed this user");
    //1. Find the user you want to follow and update it's followers field
    await User.findByIdAndUpdate(
        followId,
        {
            $push: { followers: loginUserId },
            isFollowing: true,
        },
        { new: true }
    );
    //2. Update the login user following field
    await User.findByIdAndUpdate(
        loginUserId,
        {
            $push: { following: followId },
        },
        { new: true }
    );
    res.json("You have successfully followed this user");
});

/*
=======================
unfollow another user
=======================
*/

const unfollowUserController = expressAsyncHandler(async (req, res) => {
    const { unfollowId } = req.body;
    const loggedInUserId = req.user.id;

    await User.findByIdAndUpdate(
        unfollowId,
        {
            $pull: { followers: loggedInUserId },
            isFollowing: false,
        },
        { new: true }
    );

    await User.findByIdAndUpdate(
        loggedInUserId,
        {
            $pull: { following: unfollowId },
        },
        { new: true }
    );

    res.json("You have successfully unfollowed this user");
});

/*
=======================
ban user (admin only)
=======================
*/

const banUserController = expressAsyncHandler(async(req,res) => {
    const{id} = req.params;
    validateMongoDbId(id);

    const user = await User.findByIdAndUpdate(
        id, {
        isBanned: true,
    }, {new: true});

    res.json(user);
});

/*
=======================
unban user (admin only)
=======================
*/

const unbanUserController = expressAsyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    const user = await User.findByIdAndUpdate(
        id, {
        isBanned: false,
    }, { new: true });

    res.json(user);
});

/*
=======================
generate email verification token
=======================
*/

const generateVerificationTokenController = expressAsyncHandler(async(req,res) =>{
    const loggedInUserId = req.user.id;
    const user = await User.findById(loggedInUserId);
    try{
        //generate token 
        const verificationToken = await user.createAccountVerificationToken();
        //save the user
        await user.save();
        //build your message object
        const resetURL = `Please verify your account within the next 10 minutes. <a href = http://localhost:3000/verify-account/${verificationToken}>Click here to verify your account.</a>`;
        const msg = {
            to:user?.email,
            from:"emilythearmstrong@gmail.com",
            subject:"Verify Your Account",
            html: resetURL,
        };
        await sgMail.send(msg);
        res.json(resetURL);
    }catch(error){
        res.json(error);
    }
});

/*
=======================
verify user account
=======================
*/

const accountVerificationController = expressAsyncHandler(async(req,res) =>{
    const {token} = req.body;
    const hashedToken = crypto.createHash('sha256').update(token).digest("hex");
    //find user by token
    const userFound = await User.findOne({
        accountVerificationToken: hashedToken,
        accountVerificationTokenExpires: {$gt: new Date ()},
    });
    if(!userFound){
        throw new Error("Token expired, please try again.");
    };
    //update the isAccountVerified property to true
    userFound.isAccountVerified = true;
    userFound.accountVerificationToken = undefined;
    userFound.accountVerificationTokenExpires = undefined;
    await userFound.save();
    res.json(userFound);
});

/*
=======================
generate password reset token
=======================
*/




/*
=======================
password reset
=======================
*/


module.exports = {
    userRegisterController,
    userLoginController, 
    userFetchController,
    userDeleteController,
    userFetchOneController,
    userProfileController,
    updateUserProfileController,
    updateUserPasswordController,
    followingUserController,
    unfollowUserController,
    banUserController,
    unbanUserController,
    generateVerificationTokenController,
    accountVerificationController
};