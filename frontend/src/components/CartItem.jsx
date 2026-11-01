import { MdDeleteForever } from "react-icons/md";
import { useDispatch } from "react-redux";
import { remove } from "../redux/Slices/cartSlice";
import toast from "react-hot-toast";

const CartItem = ({ item }) => {
  const dispatch = useDispatch();
  const API = process.env.REACT_APP_BASE_URL;

  const handleRemoveFromCart = async () => {
    try {
      const response = await fetch(`${API}/cart/remove`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: item._id }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Unable to remove item");
      dispatch(remove(item._id));
      toast.success("Item removed from cart");
    } catch (error) {
      toast.error(error.message || "Something went wrong. Please try again.");
    }
  };

  return (
    <div className="flex flex-col md:flex-row w-full gap-5 items-center mb-5 mt-5">
      <div className="w-[400px] flex justify-center"><img src={item.image} alt={item.title} className="object-fill h-[200px]" /></div>
      <div className="max-w-[250px] md:max-w-[400px] mr-4">
        <p className="font-bold mb-2">{item.title}</p>
        <p className="mb-4">{item.description}</p>
        <div className="flex justify-between items-center">
          <p className="font-semibold text-lg text-green-600">₹ {Number(item.price).toFixed(2)}</p>
          <button aria-label="Remove from cart" className="w-[40px] h-[40px] bg-red-200 flex items-center justify-center rounded-full" onClick={handleRemoveFromCart}><MdDeleteForever fontSize={20} /></button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
