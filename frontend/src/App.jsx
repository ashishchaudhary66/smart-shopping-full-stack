import { Navigate, Route, Routes } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Wishlist from "./pages/Wishlist";
import OrderHistory from "./pages/OrderHistory";
import Checkout from "./pages/Checkout";
import UserDetails from "./pages/UserDetails";
import { loggedIn, loggedOut } from "./redux/Slices/authenticationSlice";
import { add, clear } from "./redux/Slices/cartSlice";
import { addWishlist, clearWishlist } from "./redux/Slices/wishList";
import "./index.css";

const API = process.env.REACT_APP_BASE_URL;

const App = () => {
  const dispatch = useDispatch();
  const login = useSelector((state) => state.login.value);
  const [user, setUser] = useState(null);
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    let active = true;
    async function loadSession() {
      try {
        const response = await fetch(`${API}/me`, { credentials: "include" });
        if (!response.ok) throw new Error("No active session");
        const result = await response.json();
        if (!active) return;
        setUser(result.user);
        dispatch(loggedIn());

        const [cartResponse, wishlistResponse] = await Promise.all([
          fetch(`${API}/cart`, { credentials: "include" }),
          fetch(`${API}/wishlist`, { credentials: "include" }),
        ]);
        if (cartResponse.ok) {
          const data = await cartResponse.json();
          dispatch(clear());
          (data.cart?.products || []).forEach((item) => dispatch(add(item)));
        }
        if (wishlistResponse.ok) {
          const data = await wishlistResponse.json();
          dispatch(clearWishlist());
          (data.wishlist?.products || []).forEach((item) => dispatch(addWishlist(item)));
        }
      } catch {
        if (!active) return;
        setUser(null);
        dispatch(loggedOut());
        dispatch(clear());
        dispatch(clearWishlist());
      } finally {
        if (active) setCheckingSession(false);
      }
    }
    loadSession();
    return () => { active = false; };
  }, [dispatch, login]);

  if (checkingSession) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div>
      <Navbar user={user} />
      <Routes>
        <Route path="/login" element={login ? <Navigate to="/" /> : <Login />} />
        <Route path="/signup" element={login ? <Navigate to="/" /> : <Signup />} />
        <Route path="/profile" element={login ? <UserDetails /> : <Navigate to="/login" />} />
        <Route path="/cart" element={login ? <Cart /> : <Navigate to="/login" />} />
        <Route path="/checkout" element={login ? <Checkout /> : <Navigate to="/login" />} />
        <Route path="/wishlist" element={login ? <Wishlist /> : <Navigate to="/login" />} />
        <Route path="/order" element={login ? <OrderHistory /> : <Navigate to="/login" />} />
        <Route path="/" element={login ? <Home /> : <Navigate to="/login" />} />
      </Routes>
    </div>
  );
};

export default App;
