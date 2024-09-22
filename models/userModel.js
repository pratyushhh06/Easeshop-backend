const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name:{
        type:String,
        required : true,
    },
    email:{
        type:String,
        required : true,
        unique : true,
    },
    password:{
        type:String,
        required : true,
    },
    phone:{
        type:Number,
        required : true,
    },
    address:{
        type: {},
        required : true,
    },
    answer : {
        type: String,
        required : true
    },
    role:{
        type: Number,
       default :0
    },
   

})

const Users = mongoose.model('Users', userSchema);
module.exports = Users;