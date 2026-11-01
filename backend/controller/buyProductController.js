const User = require("../models/userModel");
const Product = require("../models/productModel");
const Transaction = require("../models/transactionModel");

exports.buyProduct = async (req, res) => {
  try {
    const { products, name, email, address } = req.body;
    const userId = req.user._id;
    if (!Array.isArray(products) || products.length === 0 || !address?.trim()) {
      return res.status(400).json({ message: "A valid product list and shipping address are required." });
    }
    const user = await User.findById(userId);
    if (!user || user.isDeleted) return res.status(404).json({ message: "User not found." });

    const purchasedProducts = [];
    let totalPrice = 0;
    for (const item of products) {
      const quantity = Number(item.quantity);
      if (!item.productId || !Number.isSafeInteger(quantity) || quantity < 1 || quantity > 99) {
        return res.status(400).json({ message: "Each product must have a valid ID and quantity between 1 and 99." });
      }
      const product = await Product.findOne({ _id: item.productId, isDeleted: false });
      if (!product) return res.status(404).json({ message: `Product ${item.productId} not found.` });
      const lineTotal = Math.round((product.price * quantity + Number.EPSILON) * 100) / 100;
      totalPrice += lineTotal;
      purchasedProducts.push({
        productId: product._id,
        quantity,
        title: product.title,
        image: product.image,
        unitPrice: product.price,
        lineTotal,
      });
    }
    totalPrice = Math.round((totalPrice + Number.EPSILON) * 100) / 100;
    const transaction = await Transaction.create({
      transactionId: `TXN${Date.now()}`,
      userId,
      products: purchasedProducts,
      address: address.trim(),
      name: name?.trim() || user.name,
      email: email?.trim().toLowerCase() || user.email,
      totalPrice,
    });
    return res.status(201).json({ message: "Transaction successful.", transaction });
  } catch (error) {
    console.error("Transaction error:", error);
    return res.status(500).json({ message: "Transaction failed." });
  }
};

exports.getTransactionHistory = async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user._id }).sort({ date: -1 });
    return res.status(200).json(transactions);
  } catch (error) {
    console.error("Transaction history error:", error);
    return res.status(500).json({ message: "Unable to fetch transaction history." });
  }
};
