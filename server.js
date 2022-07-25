const express = require("express");
const dotenv = require("dotenv");
const dbConnect=require("./config/db/dbConnect");
const {userRegisterController} = require('./controllers/users/usersController')
const userRoute = require("./route/users/userRoute");
const {errorHandler,notFoundError} = require("./middlewares/error/errorHandler");
const app = express();
dotenv.config();

//database
dbConnect();

//middleware
app.use(express.json());

//User Route
app.use('/api/users', userRoute);


//error handler - call AFTER ALL ROUTES
app.use(notFoundError);
app.use(errorHandler);

//server
const PORT = process.env.PORT || 5000;
app.listen(PORT,() =>{
    console.log(`Server is running on port: ${PORT}, better go catch it...`);
});


