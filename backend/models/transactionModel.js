const mongoose = require("mongoose");

const transactionSchema = mongoose.Schema({
  transactionId: {
    type: String,
    required: true,
    unique: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  products: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required:true
      },
      quantity: {
        type: Number,
        default: 1,
      },
    },
  ],
  address:{
    type: String,
    required: true
  },
  name:{
    type: String,
    required: true
  },
  email:{
    type: String,
    required: true
  },
  totalPrice: { type: Number, required: true },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Transaction", transactionSchema);
