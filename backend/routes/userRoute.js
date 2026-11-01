const express = require("express");
const { signup, login, logout, currentUser } = require("../controller/userController");
const { addProducts, displayProducts, softDeleteProduct } = require("../controller/productController");
const { getTransactionHistory, buyProduct } = require("../controller/buyProductController");
const { addToWishlist, removeFromWishlist, getWishlist } = require("../controller/wishlistController");
const { addToCart, removeFromCart, getCart } = require("../controller/cartController");
const { auth, requireAdmin } = require("../middleware/auth");
const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/me", auth, currentUser);
router.post("/logout", auth, logout);

router.post("/addProducts", auth, requireAdmin, addProducts);
router.delete("/products/:productId", auth, requireAdmin, softDeleteProduct);
router.get("/getProducts", auth, displayProducts);
router.post("/buy", auth, buyProduct);
router.get("/order-history", auth, getTransactionHistory);

router.post("/wishlist/add", auth, addToWishlist);
router.post("/wishlist/remove", auth, removeFromWishlist);
router.get("/wishlist", auth, getWishlist);

router.post("/cart/add", auth, addToCart);
router.post("/cart/remove", auth, removeFromCart);
router.get("/cart", auth, getCart);

module.exports = router;
