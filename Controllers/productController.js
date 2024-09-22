const productModel = require("../models/productModel");
const fs = require("fs");
const slugify = require("slugify");

const createProductController = async (req, res) => {
  try {
    const { name, slug, description, price, category, quantity, shipping } =
      req.fields;
    const { photo } = req.files;

    switch (true) {
      case !name:
        return res.status(500).send({ message: "Name is Required" });
      case !description:
        return res.status(500).send({ message: "Description is Required" });
      case !price:
        return res.status(500).send({ message: "Price is Required" });
      case !category:
        return res.status(500).send({ message: "Category is Required" });
      case !quantity:
        return res.status(500).send({ message: "Quantity is Required" });
      case !photo:
        return res.status(500).send({ message: "Photo is Required" });
      case photo.size > 1000000:
        return res
          .status(500)
          .send({ message: "Photo should be less than 1 MB" });
    }

    const products = new productModel({
      ...req.fields,
      slug: slugify(name),
    });

    if (photo) {
      products.photo.data = fs.readFileSync(photo.path);
      products.photo.contentType = photo.type;
    }

    await products.save();

    res.status(201).send({
      success: true,
      message: "Product created successfully",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in creating product",
      error,
    });
  }
};

const getProductController = async (req, res) => {
  try {
    const products = await productModel
      .find({})
      .populate("category")
      .select("-photo")
      .limit(12)
      .sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      countTotal: products.length,
      message: "All Products",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Getting Prouct",
      error,
    });
  }
};

const getSingleProductController = async (req, res) => {
  try {
    console.log("req.params.id",req.params.id);
    const products = await productModel
      .findOne({ _id: req.params.id })
      .populate("category")
      .select("-photo");
    console.log(products);

    res.status(200).send({
      success: true,

      message: "single Product fetched",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Getting Prouct",
      error,
    });
  }
};

const productPhotoController = async (req, res) => {
  try {
    console.log(req.params);
    const product = await productModel.findById(req.params.pid).select("photo");
    if (product.photo.data) {
      res.set("content-type", product.photo.contentType);
      return res.status(200).send(product.photo.data);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Getting Photo",
      error,
    });
  }
};

const deleteProductController = async (req, res) => {
  try {
    const products = await productModel
      .findByIdAndDelete(req.params.pid)
      .select("-photo");
    res.status(200).send({
      success: true,

      message: "product deleted succesfully",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in deleting product",
      error,
    });
  }
};

const updateProductController = async (req, res) => {
  try {
    const { name, slug, description, price, category, quantity, shipping } =
      req.fields;
    const { photo } = req.files;

    switch (true) {
      case !name:
        return res.status(400).send({ message: "Name is required" });

      case !description:
        return res.status(400).send({ message: "Description is required" });

      case !price:
        return res.status(400).send({ message: "Price is required" });

      case !category:
        return res.status(400).send({ message: "Category is required" });

      case !quantity:
        return res.status(400).send({ message: "Quantity is required" });

      case photo && photo.size > 1000000:
        return res
          .status(400)
          .send({ message: "Photo should be less than 1 MB" });
    }

    const product = await productModel.findByIdAndUpdate(
      req.params.pid,
      {
        ...req.fields,
        slug: slugify(name),
      },
      { new: true } // This ensures the updated document is returned
    );

    if (photo) {
      product.photo.data = fs.readFileSync(photo.path);
      product.photo.contentType = photo.type;
      await product.save();
    }

    res.status(200).send({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in updating product",
      error,
    });
  }
};

// filters

const productFilterController = async (req, res) => {
  try {
    const { checked, radio } = req.body;
    let args = {};
    if (checked.length > 0) args.category = checked;
    if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] };
    const products = await productModel.find(args);
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: " false",
      message: "Error in the filter Controller",
      error,
    });
  }
};

const productCountController = async (req, res) => {
  try {
    const total = await productModel.find({}).estimatedDocumentCount();
    res.status(200).send({
      success: true,
      total,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error In the product count controller",
      error,
    });
  }
};
const productListController = async (req, res) => {
  try {
    const perPage = 6;
    const page = req.params.page ? req.params.page : 1;

    const products = await productModel
      .find({})
      .select("-photo")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .sort({ createdAt: -1 });

    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in product list controller",
    });
  }
};

const  searchProdcutController = async(req,res) => {
  try {
   const {keyword} = req.params;
   const results = await productModel.find({
          $or: [
            {name :{$regex: keyword , $options:"i"}},
            {description :{$regex: keyword , $options:"i"}}
          ]
   }).select("-photo")
   res.json(results);

  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Search API",
    });
  }

}

const relatedProductController = async(req,res) => {
         try {
           const {pid, cid} = req.params;
           console.log("123",req.params);
           
           const products = await productModel.find({
            category:cid,
            _id:{ $ne: pid},
           }).select("--photo").limit(3).populate("category");
           res.status(200).send({
            success : true,
            products,
           })
         } catch (error) {
          console.log(error);
          res.status(500).send({
            success: false,
            message: "Error in RElated Product Api"
          })
         }
}

module.exports = {
  productFilterController,
  productListController,
  relatedProductController,
  searchProdcutController,
  createProductController,
  productCountController,
  getProductController,
  getSingleProductController,
  productPhotoController,
  deleteProductController,
  updateProductController,
};
