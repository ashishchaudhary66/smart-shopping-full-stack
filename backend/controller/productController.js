const { response } = require("express");
const Product = require("../models/productModel");

exports.displayProducts = async (req,res) => {
    try {
        const products = await Product.find({ isDeleted: false });
        res.status(200).json({
            message: "products fetched successfully",
            success:true,
            data:products
        });
    } catch (error) {
        console.error("Error display products:", error);
        res.status(500).json({
            message: "An error occurred while adding products.",
            error: error.message
        });
    }
}

exports.softDeleteProduct = async (req, res) => {
    try {
        const { _id } = req.query;

        const product = await Product.findById(_id);

        if (!product) {
            return res.status(404).json({
                message: "Product not found",
            });
        }

        product.isDeleted = true;
        await product.save();

        res.status(200).json({
            message: "Product soft-deleted successfully",
            success: true,
            data: product,
        });
    } catch (error) {
        console.error("Error soft-deleting product:", error);
        res.status(500).json({
            message: "An error occurred while soft-deleting the product.",
            error: error.message,
        });
    }
};

exports.addProduct = async(req,res) => {
    try {
        const products = req.body;

        const result = await Product.create(products);

        res.status(201).json({
            message: "Products added successfully!",
            success:true,
            status:result
        });
    } catch (error) {
        console.error("Error adding product:", error);
        res.status(500).json({
            message: "An error occurred while adding products.",
            error: error.message
        });
    }
}


exports.addProducts = async(req,res) => {
    try {
        const products = req.body; // Expecting an array of product objects in the request body
        if (!Array.isArray(products)) {
            return res.status(400).json({ message: "Input should be an array of products." });
        }

        // Insert the array of products into the database
        const result = await Product.insertMany(products);

        res.status(201).json({
            message: "Products added successfully!",
            success:true,
            products:result
        });
    } catch (error) {
        console.error("Error adding products:", error);
        res.status(500).json({
            message: "An error occurred while adding products.",
            error: error.message
        });
    }
}