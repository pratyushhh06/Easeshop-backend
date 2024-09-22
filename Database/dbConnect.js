const mongoose = require('mongoose');

const dbConnect = async() => {

    mongoose.connect(`mongodb://127.0.0.1:27017/ShopEase`).then(()=> {
        console.log("Database is Connected");
    }).catch((error)=>{
        console.log(error, "error");
    })


}

module.exports= dbConnect;