const mongoose = require('mongoose');

const dbConnect = async() => {

    mongoose.connect(`mongodb+srv://itzrohit:rohit6@ecommerce.tenbyh2.mongodb.net/ShopEase`).then(()=> {
        console.log("Database is Connected");
    }).catch((error)=>{
        console.log(error, "error");
    })


}

module.exports= dbConnect;