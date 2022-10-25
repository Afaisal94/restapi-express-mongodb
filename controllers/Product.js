const fs = require("fs");
const Product = require("../models/Product");

// GET ALL
const getProducts = async (req, res) => {
  const name = req.query.name;
  const currentPage = req.query.page || 1;
  const perPage = req.query.perpage || 10;

  let condition = name
    ? { name: { $regex: new RegExp(name), $options: "i" } }
    : {};

  try {
    const products = await Product.find(condition)
      .skip((currentPage - 1) * perPage)
      .limit(perPage)
      .populate({ path: "category", select: "_id name" })
      .sort("name");
    res.status(200).json({
      posts: post,
      total_posts: post.length,
    });
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
};

// GET ONE
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById({ _id: req.params.id }).populate({
      path: "category",
      select: "_id name",
    });
    res.status(200).json(post);
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
};

// CREATE
const createProduct = async (req, res) => {
  if (req.files === null)
    return res.status(400).json({ msg: "No Image Uploaded" });

  const imageUrl = `${req.protocol}://${req.get("host")}/${req.file.filename}`;

  const createProduct = new Product({
    name: req.body.title,
    price: req.body.content,
    category: req.body.category,
    image: imageUrl,
  });
  try {
    const product = await createProduct.save();
    res.status(201).json({
      message: "Product Created Successfuly",
    });
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
};

// UPDATE
const updateProduct = async (req, res) => {
  const productById = await Product.findById({ _id: req.params.id });
  // Check Image
  if (req.file == undefined) {
    try {
      const productUpdate = await Product.updateOne(
        { _id: req.params.id },
        {
          name: req.body.title,
          price: req.body.content,
          category: req.body.category,
        }
      );
      res.status(201).json({
        message: "Product Updated Successfuly",
      });
    } catch (err) {
      res.status(400).json({
        message: err.message,
      });
    }
  } else {
    try {
      const imageUrl = `${req.protocol}://${req.get("host")}/${
        req.file.filename
      }`;
      const productUpdate = await Product.updateOne(
        { _id: req.params.id },
        {
          name: req.body.title,
          price: req.body.content,
          category: req.body.category,
          image: imageUrl,
        }
      );
      // Delete old image
      const filepath = `./uploads/${productById.image}`;
      fs.unlinkSync(filepath);
      res.status(201).json({
        message: "Product Updated Successfuly",
      });
    } catch (err) {
      res.status(400).json({
        message: err.message,
      });
    }
  }
};

// DELETE
const deleteProduct = async (req, res) => {
  try {
    // Delete Product by id
    const productDelete = await Product.deleteOne({ _id: req.params.id });
    res.status(200).json({
      message: "Post successfully deleted !",
    });
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
