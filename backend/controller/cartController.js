const Cart = require("../models/cartModel");
const Product = require("../models/productModel");

exports.addToCart = async (req, res) => {
  try {
    const { userId, productId } = req.body;

    const product = await Product.findById({_id:productId});
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    let cart = await Cart.findOne({userId});

    if (!cart) {
      cart = new Cart({ userId, products: [productId] });
    } 
    else {
        if (!cart.products.includes(productId)) {
          cart.products.push(productId);
        } else {
          return res.status(400).json({ message: "Product already in cart" });
        }
    }

    await cart.save();
    res.status(200).json({ message: "Product added to cart", cart });
  } catch (error) {
    res.status(500).json({ message: "An error occurred", error: error.message });
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    const { userId, productId } = req.body;

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    
   cart.products = cart.products.filter(
      (id) => id.toString() !== productId
   );

    await cart.save();
    res.status(200).json({ message: "Product removed from cart", cart });
  } catch (error) {
    res.status(500).json({ message: "An error occurred", error: error.message });
  }
};

exports.getCart = async (req, res) => {
  try {
    const { userId } = req.params;

    const cart = await Cart.findOne({ userId }).populate("products");
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    res.status(200).json({ cart });
  } catch (error) {
    res.status(500).json({ message: "An error occurred", error: error.message });
  }
};