import { MdDeleteForever } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { removeWishlist } from "../redux/Slices/wishList";
import { toast } from "react-hot-toast";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { add, remove } from "../redux/Slices/cartSlice";

const WishlistItems = ({ item }) => {
  const dispatch = useDispatch();
  const API_BASE_URL = process.env.REACT_APP_BASE_URL;
  const cart = useSelector((state) => state.cart);
  function removeFromWishlist() {
    dispatch(removeWishlist(item._id));
  }
  function removeFromCart() {
    dispatch(remove(item._id));
    toast.error("item removed from cart");
  }
  function addToCart() {
    dispatch(add(item));
    toast.success("item added to cart");
  }
  const handleRemoveToWishlist = async () => {
    const token = Cookies.get("token");
    if (!token) {
      toast.error("No token found. Please log in.");
      return;
    }
    const userData = decodeToken(token);
    try {
      const response = await fetch(`${API_BASE_URL}/wishlist/remove`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: userData._id,
          productId: item._id,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        removeFromWishlist();
      } else {
        // Handle error from the server
        toast.error(result.message || "failed to remove wishlist");
        console.error("wishlist remove failed:", result);
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
      console.error("Error:", error);
    }
  };

  const decodeToken = (token) => {
    try {
      const decodedPayload = jwtDecode(token);
      return decodedPayload;
    } catch (error) {
      console.error("Failed to decode token", error);
    }
  };

  return (
    <div className="flex justify-between flex-col md:flex-row w-full gap-5 items-center mb-5 mt-5 border p-4 rounded-lg shadow-md">
      {/* Product Image */}
      <div className="w-full p-2">
        <img src={item.image} 
              alt={item.title}
              className="max-w-[160px] max-h-[150px] mx-auto p-1">
          </img>
      </div>

      {/* Product Details */}
      <div className="flex flex-col">
        <p className="font-bold text-lg mb-2 text-gray-800">{item.title}</p>
        <p className="text-sm mb-4 text-gray-600">{item.description}</p>

        {/* Product Price and Wishlist Removal */}
        <div className="flex justify-between items-center mb-4">
          <p className="font-semibold text-lg text-green-600">₹ {item.price}</p>
          <button
            className="w-[40px] h-[40px] bg-red-200 hover:bg-red-300 flex items-center justify-center rounded-full transition duration-150"
            onClick={handleRemoveToWishlist}
            aria-label="Remove from wishlist"
          >
            <MdDeleteForever fontSize={24} className="text-red-600" />
          </button>
        </div>

        {/* Cart Action Buttons */}
        {cart.some((p) => p._id === item._id) ? (
          <button
            className="bg-red-600 text-white text-sm py-2 px-4 rounded-full hover:bg-red-700 transition duration-150"
            onClick={removeFromCart}
          >
            REMOVE FROM CART
          </button>
        ) : (
          <button
            className="bg-blue-600 text-white text-sm py-2 px-4 rounded-full hover:bg-blue-700 transition duration-150"
            onClick={addToCart}
          >
            ADD TO CART
          </button>
        )}
      </div>
    </div>
  );
};

export default WishlistItems;
