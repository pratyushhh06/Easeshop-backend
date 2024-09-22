const JWT = require("jsonwebtoken");

const userModel = require('../models/userModel')
//protected Routes from the base

const requireSignIn = async (req,res,next) => {
    console.log("require sigin");
    try {
        console.log(req.headers.authorization )
        const decode = JWT.verify(req.headers.authorization , 'PRATYUSH1569');
        req.user = decode;
        next();
        
    } catch (error) {
        console.log(error);
    }
};

const isAdmin = async(req,res,next) => {
    console.log("is Admin");
    
    try {
        const user = await userModel.findById(req.user._id);
        if(user.role !== 1) {
            return res.status(401).send({
                success : false ,
                message: 'unauthorized access',
            })
        } else {
            console.log("Next after admin");
            next();
            console.log("completed next");
            
        }
    } catch (error) {
        console.log(error);
        res.status(401).send({
            success: false,
            error,
            message: "Error in admin middleware",
        })
    }

}
module.exports = { requireSignIn, isAdmin};