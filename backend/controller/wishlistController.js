const Wishlist = require("../models/wishlistModel");
const Product = require("../models/productModel");

exports.addToWishlist = async (req, res) => {
  try {
    const { userId, productId } = req.body;

    const product = await Product.findById({_id:productId});
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    let wishlist = await Wishlist.findOne({userId});

    if (!wishlist) {
      wishlist = new Wishlist({ userId, products: [productId] });
    } 
    else {
        if (!wishlist.products.includes(productId)) {
          wishlist.products.push(productId);
        } else {
          return res.status(400).json({ message: "Product already in wishlist" });
        }
    }

    await wishlist.save();
    res.status(200).json({ message: "Product added to wishlist", wishlist });
  } catch (error) {
    res.status(500).json({ message: "An error occurred", error: error.message });
  }
};

exports.removeFromWishlist = async (req, res) => {
  try {
    const { userId, productId } = req.body;

    let wishlist = await Wishlist.findOne({ userId });
    if (!wishlist) {
      return res.status(404).json({ message: "Wishlist not found" });
    }
    
   wishlist.products = wishlist.products.filter(
      (id) => id.toString() !== productId
   );

    await wishlist.save();
    res.status(200).json({ message: "Product removed from wishlist", wishlist });
  } catch (error) {
    res.status(500).json({ message: "An error occurred", error: error.message });
  }
};

exports.getWishlist = async (req, res) => {
  try {
    const { userId } = req.params;

    const wishlist = await Wishlist.findOne({ userId }).populate("products");
    if (!wishlist) {
      return res.status(404).json({ message: "Wishlist not found" });
    }

    res.status(200).json({ wishlist });
  } catch (error) {
    res.status(500).json({ message: "An error occurred", error: error.message });
  }
};
