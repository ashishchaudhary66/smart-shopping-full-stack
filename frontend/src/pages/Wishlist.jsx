import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import WishlistItems from "../components/WishlistItem";
import { addWishlist, clearWishlist } from "../redux/Slices/wishList";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { jwtDecode } from "jwt-decode";
import { NavLink } from "react-router-dom";

function Wishlist() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const wishlistItems = useSelector((state) => state.wishlist);
  const API_BASE_URL = process.env.REACT_APP_BASE_URL;

  async function fetchWishlist() {
    const token = Cookies.get("token");
    if (!token) {
      toast.error("No token found. Please log in.");
      return;
    }
    const userData = decodeToken(token);
    try {
      setLoading(true);
      const URL = `${API_BASE_URL}/wishlist/${userData._id}`;
      const response = await fetch(URL, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const wishlistData = await response.json();
        wishlistData.wishlist.products.map((item) => {
          dispatch(addWishlist(item));
        });
      } else {
        console.error("error while fetching wishlist data ");
      }
    } catch (error) {
      console.log("error while fetching wishlist data ", error);
      dispatch(clearWishlist());
    } finally {
      setLoading(false);
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
    fetchWishlist();
  }, []);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">
        Your WishList
      </h1>
      {wishlistItems && wishlistItems.length > 0 ? (
        <div className="w-full">
          {wishlistItems.map((item, index) => (
            <div key={index}>
              <WishlistItems item={item} />
              <div className="w-full h-[2px] bg-slate-600"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-4 w-full h-[75vh] items-center justify-center">
          <p className="font-bold text-2xl text-slate-900 ">Empty Wishlist</p>
          <NavLink to="/">
            <button className="bg-green-500 rounded-xl py-2 px-8 text-white hover:bg-green-600 mt-2 font-semibold">
              Go to Home
            </button>
          </NavLink>
        </div>
      )}
    </div>
  );
}

export default Wishlist;
