const mongoose = require("mongoose");

const dbConnect = async() =>{
    try{
        await mongoose.connect(process.env.MONGODB_URL,{
            useNewUrlParser:true,
            useUnifiedTopology:true,
        });
        console.log(`Successful database connection! Ain't that swell?`)
    }catch(error){
        console.log(`Error ${error.message}`);
    }
}

module.exports=dbConnect;