const express = require("express");
const { isAdmin, requireSignIn } = require("../middlewares/authMiddleware");

const {
  createProductController,
  productFilterController,
  productCountController,
  productListController,
  getProductController,
  getSingleProductController,
  searchProdcutController,
  relatedProductController,
  deleteProductController,
  updateProductController,
  productPhotoController,
} = require("../Controllers/productController");

const formidable = require("express-formidable");
const paymentController = require("../Controllers/Payment");

const router = express.Router();

router.post("/create-session",paymentController.createAccountSession);

router.post(
  "/create-product",
  requireSignIn,
  isAdmin,
  formidable(),
  createProductController
);

router.get("/get-product", getProductController);

router.get("/get-product/:id", getSingleProductController);

router.get("/product-photo/:pid", productPhotoController);

router.delete("/delete-product/:pid", deleteProductController);

router.put(
  "/update-product/:pid",
  requireSignIn,
  isAdmin,
  formidable(),
  updateProductController
);

//filter product
router.post("/product-filters", productFilterController);

//count products
router.get("/product-count", productCountController);

// product per page
router.get("/product-list/:page", productListController);

router.get('/search/:keyword', searchProdcutController);

router.get('/related-product/:pid/:cid', relatedProductController)


module.exports = router;
