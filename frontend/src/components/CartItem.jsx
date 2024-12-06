import {MdDeleteForever} from "react-icons/md";
import { useDispatch} from "react-redux";
import {remove} from "../redux/Slices/cartSlice"
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

const CartItem = ({item}) => {
  const dispatch=useDispatch()
  const API_BASE_URL = process.env.REACT_APP_BASE_URL;
  function removeFromCart(){
    dispatch(remove(item._id))
  }
  const decodeToken = (token) => {
    try {
      const decodedPayload = jwtDecode(token);
      return decodedPayload;
    } catch (error) {
      console.error("Failed to decode token", error);
    }
  };
  const handleRemoveFromCart = async() => {
    const token = Cookies.get("token");
    if (!token) {
      toast.error("No token found. Please log in.");
      return;
    }
    toast.success("item removed from cart")
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
  
  return (
    <div className="flex flex-col md:flex-row w-full gap-5 items-center mb-5 mt-5">
      <div className="w-[400px] flex justify-center">
        <img src={item.image} className="object-fill h-[200px]" alt="addedProduct"/>
      </div>
      <div className="max-w-[250px] md:max-w-[400px] mr-4">
        <p className="font-bold mb-2">{item.title}</p>
        <p className="mb-4">{item.description}</p>
        <div className="flex justify-between items-center">
          <p className="font-semibold text-lg text-green-600">₹ ${item.price}</p>
          <button className="w-[40px] h-[40px] bg-red-200 flex items-center justify-center rounded-full" onClick={handleRemoveFromCart}>
              <MdDeleteForever fontSize={20}/>
          </button>
        </div>
      </div>
    </div>
  )
};

export default CartItem;
