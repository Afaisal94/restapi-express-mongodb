const Category = require("../models/Category");

// GET ALL
const getCategories = async (req, res) => {
  const name = req.query.name;
  let condition = name
    ? { name: { $regex: new RegExp(name), $options: "i" } }
    : {};

  try {
    const categories = await Category.find(condition).select("_id name");
    res.status(200).json({
      categories: categories,
      total_categories: categories.length,
    });
  } catch (err) {
    res.status(400).json({ message: err });
  }
};

// GET ONE
const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById({ _id: req.params.id }).select(
      "_id name"
    );
    res.status(200).json(category);
  } catch (err) {
    res.status(400).json({ message: err });
  }
};

// CREATE
const createCategory = async (req, res) => {
  try {
    const data = new Category({
      name: req.body.name,
    });
    const category = await data.save();
    res.status(201).json(category);
  } catch (err) {
    res.status(400).json({ message: err });
  }
};

// UPDATE
const updateCategory = async (req, res) => {
  try {
    const data = req.body;
    const options = { new: true };

    const result = await Category.findByIdAndUpdate(
      req.params.id,
      data,
      options
    );
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ message: err });
  }
};

// DELETE
const deleteCategory = async (req, res) => {
  try {
    const data = await Category.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Comment successfully deleted !" });
  } catch (err) {
    res.status(400).json({ message: err });
  }
};

module.exports = {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
