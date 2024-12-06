import { useDispatch, useSelector } from "react-redux";
import {remove,add} from "../redux/Slices/cartSlice"
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { addWishlist, removeWishlist } from "../redux/Slices/wishList";
import Cookies from 'js-cookie';
import { jwtDecode } from "jwt-decode";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

const Product = ({item}) => {
  const isLogin=useSelector((state)=>state.login.value)
  const cart=useSelector((state)=>state.cart)
  const wishlist=useSelector((state)=>state.wishlist)
  const navigate=useNavigate();
  const dispatch=useDispatch();
  const API_BASE_URL = process.env.REACT_APP_BASE_URL;
  function removeFromCart(){
    dispatch(remove(item._id))
  }
  function addToCart(){
    dispatch(add(item))
  }
  function addToWishlist(){
    dispatch(addWishlist(item))
  }
  function removeFromWishlist(){
    dispatch(removeWishlist(item._id))
  }
  function moveToSignin(){
    navigate('/login')
  }

  const decodeToken = (token) => {
    try {
      const decodedPayload = jwtDecode(token);
      return decodedPayload;
    } catch (error) {
      console.error("Failed to decode token", error);
    }
  };

  const handleAddToCart = async() => {
    const token = Cookies.get("token");
    if (!token) {
      toast.error("No token found. Please log in.");
      return;
    }
    const userData = decodeToken(token);
    try {

      const response = await fetch(`${API_BASE_URL}/cart/add`, {
          method: "POST",
          headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            userId:userData._id, 
            productId:item._id
          }),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success("item added to cart")
        addToCart();
      } else {
          // Handle error from the server
          toast.error(result.message || "failed to add cart");
          console.error("cart addition failed:", result);
      }
    } catch (error) {
        toast.error("Something went wrong. Please try again.");
        console.error("Error:", error);
    }
  }

  const handleRemoveFromCart = async() => {
    const token = Cookies.get("token");
    if (!token) {
      toast.error("No token found. Please log in.");
      return;
    }
    const userData = decodeToken(token);
    try {

      const response = await fetch(`${API_BASE_URL}/cart/remove`, {
          method: "POST",
          headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            userId:userData._id, 
            productId:item._id
          }),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success("item removed from cart")
        removeFromCart();
      } else {
          // Handle error from the server
          toast.error(result.message || "failed to remove cart");
          console.error("cart remove failed:", result);
      }
    } catch (error) {
        toast.error("Something went wrong. Please try again.");
        console.error("Error:", error);
    }
  }

  const handleAddToWishlist = async() => {
    const token = Cookies.get("token");
    if (!token) {
      toast.error("No token found. Please log in.");
      return;
    }
    toast.success("item added to wishlist");
    addToWishlist();
    const userData = decodeToken(token);
    try {

      const response = await fetch(`${API_BASE_URL}/wishlist/add`, {
          method: "POST",
          headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            userId:userData._id, 
            productId:item._id
          }),
      });

      const result = await response.json();

      if (!response.ok) {
        removeFromCart();
        // Handle error from the server
        toast.error(result.message || "failed to add wishlist");
        console.error("wishlist addition failed:", result);
      }
    } catch (error) {
        toast.error("Something went wrong. Please try again.");
        console.error("Error:", error);
    }
  }

  const handleRemoveFromWishlist = async() => {
    const token = Cookies.get("token");
    if (!token) {
      toast.error("No token found. Please log in.");
      return;
    }
    toast.success("item removed from wishlist");
    removeFromWishlist();
    const userData = decodeToken(token);
    try {

      const response = await fetch(`${API_BASE_URL}/wishlist/remove`, {
          method: "POST",
          headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            userId:userData._id, 
            productId:item._id
          }),
      });

      const result = await response.json();
      if (!response.ok) {
         addToWishlist();
         // Handle error from the server
         toast.error(result.message || "failed to remove wishlist");
         console.error("wishlist remove failed:", result);
      }
    } catch (error) {
        addToWishlist();
        toast.error("Something went wrong. Please try again.");
        console.error("Error:", error);
    }
  }

  return(
    <div className="max-w-[340px] md:max-w-[250px] rounded-xl flex flex-col justify-between p-4 mb-4 border-[2px] box-shadow transition-all duration-500 relative">
      {
        wishlist.some((p)=>p._id===item._id)? 
          <FavoriteIcon className="absolute right-1 top-2 cursor-pointer" fontSize="medium" color="success" onClick={handleRemoveFromWishlist} />:
            <FavoriteBorderIcon className="absolute right-1 top-2 cursor-pointer" fontSize="medium" color="success" onClick={handleAddToWishlist} />      
      }
      <div className="p-2">
        <p className="mb-4 font-bold text-sm">{item.title}</p>
        <p className="text-xs">{item.description.substring(0,150)}...</p>
      </div>
      <div className="w-full p-2">
        <img src={item.image} alt="productPic" className="max-w-[160px] max-h-[150px] mx-auto p-1"></img>
      </div>
      <div className="flex justify-between items-center">
        <p className="text-green-700 font-semibold text-sm">₹ {item.price}</p>
        {
          cart.some((p)=>p._id===item._id)? 
            <button className="bg-slate-900 text-white text-xs py-1 px-2 rounded-full" onClick={handleRemoveFromCart}>REMOVE FROM CART</button>:
              <button className="bg-slate-900 text-white text-xs py-1 px-2 rounded-full" onClick={isLogin?handleAddToCart:moveToSignin}>ADD TO CART</button>
        }
        
      </div>
    </div>
  )
};

export default Product;
