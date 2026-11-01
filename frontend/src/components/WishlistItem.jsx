import { MdDeleteForever } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { removeWishlist } from "../redux/Slices/wishList";
import { add, remove } from "../redux/Slices/cartSlice";
import { toast } from "react-hot-toast";

const WishlistItems = ({ item }) => {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);
  const API = process.env.REACT_APP_BASE_URL;

  const removeFromWishlist = async () => {
    try {
      const response = await fetch(`${API}/wishlist/remove`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: item._id }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Unable to remove item");
      dispatch(removeWishlist(item._id));
      toast.success("Item removed from wishlist");
    } catch (error) {
      toast.error(error.message || "Something went wrong. Please try again.");
    }
  };

  const updateCart = async (adding) => {
    try {
      const response = await fetch(`${API}/cart/${adding ? "add" : "remove"}`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: item._id }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Unable to update cart");
      dispatch(adding ? add(item) : remove(item._id));
      toast.success(adding ? "Item added to cart" : "Item removed from cart");
    } catch (error) {
      toast.error(error.message || "Something went wrong. Please try again.");
    }
  };

  const inCart = cart.some((product) => product._id === item._id);
  return (
    <div className="flex justify-between flex-col md:flex-row w-full gap-5 items-center mb-5 mt-5 border p-4 rounded-lg shadow-md">
      <div className="w-full p-2"><img src={item.image} alt={item.title} className="max-w-[160px] max-h-[150px] mx-auto p-1" /></div>
      <div className="flex flex-col">
        <p className="font-bold text-lg mb-2 text-gray-800">{item.title}</p>
        <p className="text-sm mb-4 text-gray-600">{item.description}</p>
        <div className="flex justify-between items-center mb-4">
          <p className="font-semibold text-lg text-green-600">₹ {Number(item.price).toFixed(2)}</p>
          <button className="w-[40px] h-[40px] bg-red-200 hover:bg-red-300 flex items-center justify-center rounded-full" onClick={removeFromWishlist} aria-label="Remove from wishlist"><MdDeleteForever fontSize={24} className="text-red-600" /></button>
        </div>
        {inCart
          ? <button className="bg-red-600 text-white text-sm py-2 px-4 rounded-full" onClick={() => updateCart(false)}>REMOVE FROM CART</button>
          : <button className="bg-blue-600 text-white text-sm py-2 px-4 rounded-full" onClick={() => updateCart(true)}>ADD TO CART</button>}
      </div>
    </div>
  );
};

export default WishlistItems;
