const mongoose = require("mongoose");

const validateMongoDbId = id =>{
    const isValidId = mongoose.Types.ObjectId.isValid(id);
    if(!isValidId){
        throw new Error("Invalid User ID. Please try again.");
    }
}

module.exports = validateMongoDbId;