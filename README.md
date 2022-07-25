Features of the Post API -

-create, read, update, delete (crud operations)
-file upload
-like,dislike
-number of views
-post category (admin only)
-post comment 
-add category

Features of the Users API-

-file upload to cloudinary
-image resizing
-authentication (login/logout, allowing user to -access certain route based on user mgmt role)
-data modeling
-limit number of requests per user
-toggle like/dislike of post endpoint
-user management(admin blocking a user, assigning role to a user)
-block a user
-user profile page (username, # of followers, posts)
-users can view other profile
-update profile
-update profile
-update password
-forgot password(how to reset your password)
-send email using sendgrid (allow user to send email to another user - messaging feature)
-account verification
-ban user (admin)
-roles
-follow/unfollow user
-user can view other profiles
-who can view my profile
-profanity filter - automatic block of account
-make posts public/private
-make user profile private for only logged in users

Tech stack-
-javascript
-express.js
-node.js
-mongoDB => mongoose
-bcrypt.js (encryption)
-express-async-handler
-nodemon (dev)
-jwt (jsonwebtoken - authorization)
-crypto (web token  - user account auth)

data modeling- 
-users
-posts
-comments