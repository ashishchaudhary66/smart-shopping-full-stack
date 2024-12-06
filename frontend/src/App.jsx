import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { loggedIn, loggedOut } from "./redux/Slices/authenticationSlice";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";
import "./index.css";
import { useEffect, useState } from "react";
import Wishlist from "./pages/Wishlist";
import { add, clear } from "./redux/Slices/cartSlice";
import { addWishlist, clearWishlist } from "./redux/Slices/wishList";
import toast from "react-hot-toast";
import { jwtDecode } from "jwt-decode";
import OrderHistory from "./pages/OrderHistory";
import Checkout from "./pages/Checkout";
import UserDetails from "./pages/UserDetails";
import axios from "axios";
import Spinner from "./components/Spinner";

const App = () => {
  const dispatch = useDispatch();
  const login = useSelector((state) => state.login.value);
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isBackendActive,setBackendActive] = useState(false);
  const API_BASE_URL = process.env.REACT_APP_BASE_URL;

  async function fetchWishlist() {
    const token = Cookies.get("token");
    if (!token) {
      toast.error("No token found. Please log in.");
      return;
    }
    const userData = decodeToken(token);
    try {
      const URL = `${API_BASE_URL}/wishlist/${userData._id}`;
      const response = await fetch(URL, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const wishlistData = await response.json();
        for(let i=0;i<wishlistData.wishlist.products.length;i++){
          let value = wishlistData.wishlist.products[i];
          dispatch(addWishlist(value));
        }
      } else {
        console.error("error while fetching wishlist data ");
      }
    } catch (error) {
      console.log("error while fetching wishlist data ", error);
      dispatch(clearWishlist());
    }
  }

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
        for(let i=0;i<cartData.cart.products.length;i++){
          let value = cartData.cart.products[i];
          dispatch(add(value));
        }
      } else {
        console.error("error while fetching cart data ");
      }
    } catch (error) {
      console.log("error while fetching cart data ", error);
      dispatch(clear());
    }
  }

  const isTokenExpired = (token) => {
    if (!token) return true;
    const { exp } = jwtDecode(token);
    const isExpired = Date.now() / 1000 > exp;
    if (isExpired) {
      toast.error("Session Expired");
    }
    return isExpired;
  };

  const decodeToken = (token) => {
    try {
      const decodedPayload = jwtDecode(token);
      return decodedPayload;
    } catch (error) {
      console.error("Failed to decode token", error);
    }
  };

  const fetchBackend = async() => {
    const url=API_BASE_URL.replace('/api/v1','');
    try {
      const response=await axios.get(url);
      setBackendActive(true);
    } catch (error) {
      setBackendActive(false);
    }
  }

  useEffect(() => {
    // Check if token exists in cookies
    const token = Cookies.get("token");
    if (token && !isTokenExpired(token)) {
      const payload = decodeToken(token);
      setUser(payload);
      dispatch(loggedIn());
      fetchWishlist();
      fetchCart();
    } else {
      Cookies.remove("token");
      setUser(null);
      dispatch(loggedOut());
      dispatch(clear());
      dispatch(clearWishlist());
      navigate("/login");
    }
  }, [login]);

  useEffect(()=>{
    if(!isBackendActive){
      fetchBackend();
    }
  })
  if(!isBackendActive){
    return <Spinner />;
  }

  return (
    <div>
      <div>
        <Navbar user={user} />
      </div>
      <Routes>
        <Route
          path="/login"
          element={login ? <Navigate to="/" /> : <Login />}
        />
        <Route
          path="/signup"
          element={login ? <Navigate to="/" /> : <Signup />}
        />

        <Route
          path="/profile"
          element={login ? <UserDetails /> : <Navigate to="/login" />}
        />

        <Route
          path="/cart"
          element={login ? <Cart /> : <Navigate to="/login" />}
        />

        <Route
          path="/checkout"
          element={login ? <Checkout /> : <Navigate to="/login" />}
        />
        <Route
          path="/wishlist"
          element={login ? <Wishlist /> : <Navigate to="/login" />}
        />

        <Route
          path="/order"
          element={login ? <OrderHistory /> : <Navigate to="/login" />}
        />

        <Route path="/" element={login ? <Home /> : <Navigate to="/login" />} />
      </Routes>
    </div>
  );
};

export default App;
