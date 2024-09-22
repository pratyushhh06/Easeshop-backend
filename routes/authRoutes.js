const express = require('express');
const router = express.Router();

const { requireSignIn, isAdmin } = require('../middlewares/authMiddleware');
const { registerController,getOrderController,updateProfileController,orderStatusController, loginController,getAllOrdersController, testController, forgotPasswordController } = require('../Controllers/authController');


//register router
router.post('/register', registerController);

//login-router
router.post('/login', loginController);

//test-controller
router.get('/test' , requireSignIn , isAdmin ,testController);

//forgot passord
router.post("/forgot-password", forgotPasswordController);

//protected user Route
router.get('/user-auth' ,requireSignIn , (req,res) =>{
    res.status(200).send({ok:true})
})

//protected admin Route
router.get('/admin-auth' ,requireSignIn ,isAdmin, (req,res) => {
    res.status(200).send({ok:true})
})

router.put('/profile', requireSignIn , updateProfileController)
//order
router.get('/order',requireSignIn , getOrderController);
//all orders
router.get('/all-orders', requireSignIn, isAdmin,getAllOrdersController);

router.put("/order-status/:orderId", requireSignIn, isAdmin , orderStatusController)

module.exports = router;
