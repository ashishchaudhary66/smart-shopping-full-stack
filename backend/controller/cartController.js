const Cart = require("../models/cartModel");
const Product = require("../models/productModel");

exports.addToCart = async (req, res) => {
  try {
    const { productId } = req.body;
    if (!productId) return res.status(400).json({ message: "Product ID is required." });
    const product = await Product.findOne({ _id: productId, isDeleted: false });
    if (!product) return res.status(404).json({ message: "Product not found." });
    const userId = req.user._id;
    let cart = await Cart.findOne({ userId });
    if (!cart) cart = new Cart({ userId, products: [productId] });
    else {
      if (cart.products.some((id) => id.toString() === productId)) {
        return res.status(409).json({ message: "Product already in cart." });
      }
      cart.products.push(productId);
    }
    await cart.save();
    return res.status(200).json({ message: "Product added to cart.", cart });
  } catch (error) {
    console.error("Add to cart error:", error);
    return res.status(500).json({ message: "Unable to update cart." });
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    const { productId } = req.body;
    if (!productId) return res.status(400).json({ message: "Product ID is required." });
    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) return res.status(404).json({ message: "Cart not found." });
    cart.products = cart.products.filter((id) => id.toString() !== productId);
    await cart.save();
    return res.status(200).json({ message: "Product removed from cart.", cart });
  } catch (error) {
    console.error("Remove from cart error:", error);
    return res.status(500).json({ message: "Unable to update cart." });
  }
};

exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user._id }).populate("products");
    return res.status(200).json({ cart: cart || { products: [] } });
  } catch (error) {
    console.error("Get cart error:", error);
    return res.status(500).json({ message: "Unable to fetch cart." });
  }
};
