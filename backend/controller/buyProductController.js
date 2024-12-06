const User = require("../models/userModel");
const Product = require("../models/productModel");
const Transaction = require("../models/transactionModel");

exports.buyProduct = async (req, res) => {
  try {
    const { userId, products,name, email ,address, totalPrice } = req.body;

    // Fetch user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    let totalPriceCal = 0; // Variable to calculate total price
    const productsToUpdate = [];

    for (let productItem of products) {
      const { productId, quantity } = productItem;

      // Fetch product
      const product = await Product.findById(productId);
      if (!product || product.isDeleted) {
        return res
          .status(404)
          .json({ message: `Product ${productId} not found or deleted` });
      }

      totalPriceCal += product.price * quantity;
    }

    // Save product updates
    await Promise.all(productsToUpdate.map((product) => product.save()));

    // Calculate final totalPrice (use provided value if valid; otherwise, use calculated price)
    let finalTotalPrice =
      totalPrice && totalPrice > 0 ? totalPrice : totalPriceCal;
    finalTotalPrice = preciseRound(finalTotalPrice, 2);
    // Create transaction
    const transaction = new Transaction({
      transactionId: `TXN${Date.now()}`, // Unique transaction ID
      userId,
      products: products.map((productItem) => ({
        productId: productItem.productId,
        quantity: productItem.quantity,
      })),
      address,
      name: name || user.name,
      email: email || user.email,
      totalPrice: finalTotalPrice,
    });

    await transaction.save();

    res.status(200).json({ message: "Transaction successful", transaction });
  } catch (error) {
    console.error("Transaction error:", error);
    res
      .status(500)
      .json({ message: "Transaction failed", error: error.message });
  }
};

exports.getTransactionHistory = async (req, res) => {
  const { userId } = req.params; // Get userId from the request parameters

  try {
    // Fetch transactions for the given userId
    const transactions = await Transaction.find({ userId })
      .populate("products.productId") // Populate product details (optional fields: title, price)
      .exec();

    // Check if transactions exist
    if (!transactions || transactions.length === 0) {
      return res
        .status(404)
        .json({ message: "No transactions found." });
    }

    // Send the transactions as the response
    res.status(200).json(transactions);
  } catch (error) {
    console.error("Error fetching transaction history:", error);
    res
      .status(500)
      .json({
        message: "An error occurred while fetching transaction history.",
      });
  }
};

function preciseRound(num, decimalPlaces = 0) {
  const factor = Math.pow(10, decimalPlaces);
  return Math.round((num + Number.EPSILON) * factor) / factor;
}

function formatToIST(utcDate) {
  const date = new Date(utcDate);
  return new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(date);
}
