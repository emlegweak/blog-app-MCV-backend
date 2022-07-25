//Not found
const notFoundError = (req,res,next) =>{
    const error = new Error(`Not found - ${req.originalUrl}`);
    res.status(404);
    //passes to next middleware -> errorHandler() in this case
    next(error);
};


//Error handler
const errorHandler=(err,req,res,next)=>{
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);
    res.json({
        message:err?.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
};

module.exports={errorHandler, notFoundError};