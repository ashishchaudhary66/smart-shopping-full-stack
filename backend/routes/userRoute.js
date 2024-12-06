const express=require("express");
const { signup, login, logout } = require("../controller/userController");
const { addProducts, displayProducts } = require("../controller/productController");
const { getTransactionHistory, buyProduct } = require("../controller/buyProductController");
const { addToWishlist, removeFromWishlist, getWishlist } = require("../controller/wishlistController");
const { addToCart, removeFromCart, getCart, } = require("../controller/cartController");
const { auth } = require("../middleware/auth");
const router=express.Router();

router.post('/signup',signup);
router.post('/login',login);
router.get('/logout',auth,logout);

router.post('/addProducts',auth,addProducts);
router.get('/getProducts',auth,displayProducts);
router.post('/buy',auth,buyProduct);
router.get('/order-history/:userId',auth,getTransactionHistory);

// Wishlist
router.post("/wishlist/add",auth,addToWishlist);
router.post("/wishlist/remove",auth,removeFromWishlist);
router.get("/wishlist/:userId",auth,getWishlist);

// Cart
router.post("/cart/add",auth,addToCart);
router.post("/cart/remove",auth,removeFromCart);
router.get("/cart/:userId",auth,getCart);

module.exports=router;