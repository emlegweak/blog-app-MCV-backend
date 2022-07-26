const multer = require("multer");
const sharp = require("sharp");
const path = require("path");
//storage
const multerStorage = multer.memoryStorage();

//filter requests by file type
const multerFilter = (req, file, cb) => {
    //check file type
    if (file.mimetype.startsWith("image")) {
        cb(null, true);
    } else {
        //rejected files
        cb({message: "Unsupported file format",},false);
    }
};

//export image
const photoUpload = multer({
    storage: multerStorage,
    fileFilter: multerFilter,
    //1mb limit
    limits: { fileSize: 1000000 },
});

//image resizing
const profilePhotoResize = async(req,res,next) =>{
    //check if there is a file
    if(!req.file){
        return next();
    };
    //generate unique filename property
    req.file.filename = `user-${Date.now()}-${req.file.originalname}`;
    //resize image and format, set quality, set destination of saved img
    await sharp(req.file.buffer).resize(250,250).toFormat('jpeg').jpeg({quality: 90}).toFile(path.join(`public/images/profile/${req.file.filename}`));
    next();
};

module.exports = { photoUpload, profilePhotoResize };