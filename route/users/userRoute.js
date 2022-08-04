const express = require('express');
const {
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
    accountVerificationController,
    generatePasswordResetTokenController,
    passwordResetController,
    profilePhotoUploadController
} = require("../../controllers/users/usersController");
const authMiddleware = require("../../middlewares/auth/authMiddleware");
const { photoUpload, profilePhotoResize } = require("../../middlewares/uploads/photoUpload");
const userRoute = express.Router();

//Register
//appends routes to the parent in server.js
userRoute.post('/register', userRegisterController);
userRoute.post('/login', userLoginController);
userRoute.put('/upload-profile-photo', authMiddleware, photoUpload.single('image'), profilePhotoResize, profilePhotoUploadController);
userRoute.get('/', authMiddleware, userFetchController);
userRoute.put('/reset-password', authMiddleware, passwordResetController);
userRoute.post('/generate-password-reset-token', authMiddleware, generatePasswordResetTokenController);
userRoute.put('/password', authMiddleware, updateUserPasswordController);
userRoute.put('/follow', authMiddleware, followingUserController);
userRoute.put('/unfollow', authMiddleware, unfollowUserController);
userRoute.put('/verify-account', authMiddleware, accountVerificationController);
userRoute.post('/generate-email-verification-token', authMiddleware, generateVerificationTokenController);
userRoute.put('/ban-user/:id', authMiddleware, banUserController);
userRoute.put('/unban-user/:id', authMiddleware, unbanUserController);
userRoute.get('/profile/:id', authMiddleware, userProfileController);
userRoute.put('/:id', authMiddleware, updateUserProfileController);
userRoute.delete('/:id', userDeleteController);
userRoute.get('/:id', userFetchOneController);

module.exports = userRoute;