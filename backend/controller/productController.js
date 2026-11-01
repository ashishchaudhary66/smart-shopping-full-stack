const Product = require("../models/productModel");

exports.displayProducts = async (req, res) => {
  try {
    const products = await Product.find({ isDeleted: false }).sort({ title: 1 });
    return res.status(200).json({ success: true, message: "Products fetched successfully.", data: products });
  } catch (error) {
    console.error("Display products error:", error);
    return res.status(500).json({ success: false, message: "Unable to fetch products." });
  }
};

exports.softDeleteProduct = async (req, res) => {
  try {
    const product = await Product.findOneAndUpdate(
      { _id: req.params.productId, isDeleted: false },
      { $set: { isDeleted: true } },
      { new: true, runValidators: true }
    );
    if (!product) return res.status(404).json({ success: false, message: "Product not found." });
    return res.status(200).json({ success: true, message: "Product soft-deleted successfully.", data: product });
  } catch (error) {
    console.error("Soft delete product error:", error);
    return res.status(400).json({ success: false, message: "Unable to delete product." });
  }
};

exports.addProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    return res.status(201).json({ success: true, message: "Product added successfully.", data: product });
  } catch (error) {
    console.error("Add product error:", error);
    return res.status(400).json({ success: false, message: "Unable to add product." });
  }
};

exports.addProducts = async (req, res) => {
  try {
    if (!Array.isArray(req.body) || req.body.length === 0) {
      return res.status(400).json({ success: false, message: "Provide a non-empty array of products." });
    }
    const products = await Product.insertMany(req.body, { ordered: true });
    return res.status(201).json({ success: true, message: "Products added successfully.", data: products });
  } catch (error) {
    console.error("Add products error:", error);
    return res.status(400).json({ success: false, message: "Unable to add products." });
  }
};
