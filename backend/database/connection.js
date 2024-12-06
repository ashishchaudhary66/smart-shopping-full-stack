const mongoose=require("mongoose");

const connectionURL=process.env.MONGOOSE_URL

exports.dbConnect=()=>{
    mongoose.connect(connectionURL)
    .then(()=>{
        console.log("DB Connected Successfully!")
    })
    .catch((error)=>{
        console.log("Db connection failed : ");
        console.error(error);
        process.exit(1);
    })
}