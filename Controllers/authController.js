const { hashPassword, comparePassword } = require("../helpers/authHelper");
const userModel = require("../models/userModel");
const orderModel = require("../models/orderModel");
const JWT = require("jsonwebtoken");

const registerController = async (req, res) => {
  try {
    const { name, email, password, phone, address, answer } = req.body;

    if ((!name || !email || !password || !phone || !address, !answer)) {
      return res.send({
        error: "please enter all the details",
      });
    }

    //existing user
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      res.status(200).send({
        success: false,
        message: " already registered with this email",
      });
    }

    //register user
    const hashedPassword = await hashPassword(password);

    const user = new userModel({
      name,
      email,
      phone,
      address,
      password: hashedPassword,
      answer,
    }).save();

    res.status(201).send({
      success: true,
      message: " user registered successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "error in registeration",
      error,
    });
  }
};

const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(404).send({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Verification of user
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Email is not registered",
      });
    }

    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(500).send({
        success: false,
        message: "Password is incorrect",
      });
    }

    // Token
    const token = await JWT.sign({ _id: user._id }, "PRATYUSH1569", {
      expiresIn: "7d",
    });
    res.status(200).send({
      success: true,
      message: "Login successfully",
      user: {
        _id: user._id,
        name: user.name,
        phone: user.phone,
        address: user.address,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in login",
      error,
    });
  }
};

const testController = (req, res) => {
  try {
    res.send("protected routes");
  } catch (error) {
    console.log(error);
    res.send({ error });
  }
};

const forgotPasswordController = async (req, res) => {
  try {
    const { email, answer, newPassword } = req.body;

    if (!email) {
      res.status(400).send({
        message: "email is required",
      });
    }
    if (!answer) {
      res.status(400).send({
        message: "question is required",
      });
    }
    if (!newPassword) {
      res.status(400).send({
        message: "new password is required",
      });
    }

    //check

    const user = await userModel.findOne({ email, answer });

    if (!user) {
      return res.status(404).send({
        succes: false,
        message: "Wrong Email or Password",
      });
    }
    const hashed = await hashPassword(newPassword);

    await userModel.findByIdAndUpdate(user._id, { password: hashed });
    res.status(200).send({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in changing the Password",
      error,
    });
  }
};

const updateProfileController = async (req, res) => {
  try {
    const { name, email, password, address, phone } = req.body;
    const user = await userModel.findById(req.user._id);

    if (password && password.length < 6) {
      return res.json({ error: "Password is required and 6 characters long" });
    }
    const hashedPassword = password ? await hashPassword(password) : undefined;
    const updatedUser = await userModel.findByIdAndUpdate(
      req.user._id,
      {
        name: name || user.name,
        password: hashedPassword || user.password,
        phone: phone || user.phone,
        address: address || user.address,
      },
      { new: true }
    );

    res.status(200).send({
      success: true,
      message: "user updated succesfully",
      updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in update Profile",
      error,
    });
  }
};

const getOrderController = async (req, res) => {
  try {
    const orders = await orderModel
      .find({ buyer: req.user._id })
      .populate("products", "-photo")
      .populate("buyer", "name");
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error While Getting Order",
      error,
    });
  }
};
const getAllOrdersController = async (req, res) => {
  try {
    const orders = await orderModel
      .find({ })
      .populate("products", "-photo")
      .populate("buyer", "name")
      .sort({createdAt : "-1"});
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error While Getting Order",
      error,
    });
  }
};

const orderStatusController = async(req,res) => {
    try {
      const { orderId} = req.params;
      const {status} = req.body;
      const orders = await orderModel.findByIdAndUpdate(
        orderId,
        {status},
        {new : true}
      );
      res.json(orders);

    } catch (error) {
      console.log(error);
      res.status(500).send({
        success : false,
        message : "Error int update Order status Api",
        error
      });
    }
}
module.exports = {
  registerController,
  getAllOrdersController,
  loginController,
  getOrderController,
  testController,
  orderStatusController,
  updateProfileController,
  forgotPasswordController,
};
