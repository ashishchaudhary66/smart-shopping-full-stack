import { useDispatch, useSelector } from "react-redux";
import { remove, add } from "../redux/Slices/cartSlice";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { addWishlist, removeWishlist } from "../redux/Slices/wishList";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

const API = process.env.REACT_APP_BASE_URL;

const Product = ({ item }) => {
  const isLogin = useSelector((state) => state.login.value);
  const cart = useSelector((state) => state.cart);
  const wishlist = useSelector((state) => state.wishlist);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  async function updateCollection(path, productId, successMessage, action) {
    try {
      const response = await fetch(`${API}${path}`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Request failed");
      dispatch(action(productId === item._id ? item._id : productId));
      toast.success(successMessage);
    } catch (error) {
      toast.error(error.message || "Something went wrong. Please try again.");
    }
  }

  const handleAddToCart = () => isLogin
    ? updateCollection("/cart/add", item._id, "Item added to cart", add)
    : navigate("/login");
  const handleRemoveFromCart = () => updateCollection("/cart/remove", item._id, "Item removed from cart", remove);
  const handleAddToWishlist = () => isLogin
    ? updateCollection("/wishlist/add", item._id, "Item added to wishlist", addWishlist)
    : navigate("/login");
  const handleRemoveFromWishlist = () => updateCollection("/wishlist/remove", item._id, "Item removed from wishlist", removeWishlist);

  return (
    <div className="max-w-[340px] md:max-w-[250px] rounded-xl flex flex-col justify-between p-4 mb-4 border-[2px] box-shadow transition-all duration-500 relative">
      {wishlist.some((p) => p._id === item._id)
        ? <FavoriteIcon className="absolute right-1 top-2 cursor-pointer" fontSize="medium" color="success" onClick={handleRemoveFromWishlist} />
        : <FavoriteBorderIcon className="absolute right-1 top-2 cursor-pointer" fontSize="medium" color="success" onClick={handleAddToWishlist} />}
      <div className="p-2"><p className="mb-4 font-bold text-sm">{item.title}</p><p className="text-xs">{item.description?.substring(0, 150)}...</p></div>
      <div className="w-full p-2"><img src={item.image} alt={item.title} className="max-w-[160px] max-h-[150px] mx-auto p-1" /></div>
      <div className="flex justify-between items-center">
        <p className="text-green-700 font-semibold text-sm">₹ {Number(item.price).toFixed(2)}</p>
        {cart.some((p) => p._id === item._id)
          ? <button className="bg-slate-900 text-white text-xs py-1 px-2 rounded-full" onClick={handleRemoveFromCart}>REMOVE FROM CART</button>
          : <button className="bg-slate-900 text-white text-xs py-1 px-2 rounded-full" onClick={handleAddToCart}>ADD TO CART</button>}
      </div>
    </div>
  );
};

export default Product;
