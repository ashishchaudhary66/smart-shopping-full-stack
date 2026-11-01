const Wishlist = require("../models/wishlistModel");
const Product = require("../models/productModel");

exports.addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    if (!productId) return res.status(400).json({ message: "Product ID is required." });
    const product = await Product.findOne({ _id: productId, isDeleted: false });
    if (!product) return res.status(404).json({ message: "Product not found." });
    const userId = req.user._id;
    let wishlist = await Wishlist.findOne({ userId });
    if (!wishlist) wishlist = new Wishlist({ userId, products: [productId] });
    else {
      if (wishlist.products.some((id) => id.toString() === productId)) {
        return res.status(409).json({ message: "Product already in wishlist." });
      }
      wishlist.products.push(productId);
    }
    await wishlist.save();
    return res.status(200).json({ message: "Product added to wishlist.", wishlist });
  } catch (error) {
    console.error("Add to wishlist error:", error);
    return res.status(500).json({ message: "Unable to update wishlist." });
  }
};

exports.removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    if (!productId) return res.status(400).json({ message: "Product ID is required." });
    const wishlist = await Wishlist.findOne({ userId: req.user._id });
    if (!wishlist) return res.status(404).json({ message: "Wishlist not found." });
    wishlist.products = wishlist.products.filter((id) => id.toString() !== productId);
    await wishlist.save();
    return res.status(200).json({ message: "Product removed from wishlist.", wishlist });
  } catch (error) {
    console.error("Remove from wishlist error:", error);
    return res.status(500).json({ message: "Unable to update wishlist." });
  }
};

exports.getWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ userId: req.user._id }).populate("products");
    return res.status(200).json({ wishlist: wishlist || { products: [] } });
  } catch (error) {
    console.error("Get wishlist error:", error);
    return res.status(500).json({ message: "Unable to fetch wishlist." });
  }
};
