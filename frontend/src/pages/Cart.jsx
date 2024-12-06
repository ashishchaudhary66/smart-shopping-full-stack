import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CartItem from "../components/CartItem";
import { NavLink, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { add, clear } from "../redux/Slices/cartSlice";
import { jwtDecode } from "jwt-decode";

const Cart = () => {
  const cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const API_BASE_URL = process.env.REACT_APP_BASE_URL;
  const navigate = useNavigate();

  async function fetchCart() {
    const token = Cookies.get("token");
    if (!token) {
      toast.error("No token found. Please log in.");
      return;
    }
    const userData = decodeToken(token);
    try {
      const URL = `${API_BASE_URL}/cart/${userData._id}`;
      const response = await fetch(URL, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const cartData = await response.json();
        cartData.cart.products.map((item) => {
          dispatch(add(item));
        });
      } else {
        console.error("error while fetching cart data ");
      }
    } catch (error) {
      console.log("error while fetching cart data ", error);
      dispatch(clear());
    }
  }

  const decodeToken = (token) => {
    try {
      const decodedPayload = jwtDecode(token);
      return decodedPayload;
    } catch (error) {
      console.error("Failed to decode token", error);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);
  const goToCheckout = () => {
    navigate("/checkout",);
  };
  return (
    <div className="flex flex-col-reverse items-center md:items-start md:flex-row max-w-[900px] mx-auto gap-10 mt-12">
      {cart && cart.length > 0 ? (
        <>
          <div className="w-full">
            {cart.map((item, index) => (
              <div key={item.id}>
                <CartItem item={item} index={index} />
                <div className="w-full h-[2px] bg-slate-600"></div>
              </div>
            ))}
          </div>
          <div className="flex flex-col justify-between h-[75vh] min-w-[300px]">
            <div>
              <p className="text-green-600 text-2xl font-bold">YOUR CART</p>
              <p className="text-green-600 text-4xl font-bold">SUMMARY</p>
              <p className=" mt-2">
                Total Items : <span className="font-bold">{cart.length}</span>
              </p>
            </div>
            <div>
              <p>
                Total Amount :{" "}
                <span className="font-semibold">
                  ₹ {cart.reduce((acc, cur) => acc + cur.price, 0).toFixed(2)}
                </span>{" "}
              </p>
              <button
                onClick={goToCheckout}
                className="w-full bg-green-500 rounded-lg p-2 text-white hover:bg-green-600 mt-2 font-semibold"
              >
                Checkout Now
              </button>
            </div>
          </div>
        </>
      ) : (
        <div className="flex flex-col gap-4 w-full h-[75vh] items-center justify-center">
          <p className="font-bold text-2xl text-slate-900 ">
            Your Cart is Empty
          </p>
          <NavLink to="/">
            <button className="bg-green-500 rounded-xl py-2 px-8 text-white hover:bg-green-600 mt-2 font-semibold">
              Go to Home
            </button>
          </NavLink>
        </div>
      )}
    </div>
  );
};

export default Cart;
