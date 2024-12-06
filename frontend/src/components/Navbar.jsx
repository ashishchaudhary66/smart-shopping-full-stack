import { NavLink, useNavigate } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { loggedOut } from "../redux/Slices/authenticationSlice";
import { clear } from "../redux/Slices/cartSlice";
import { clearWishlist } from "../redux/Slices/wishList";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useState } from "react";

const Navbar = ({ user }) => {
  const navigate = useNavigate();
  const cart = useSelector((state) => state.cart);
  const login = useSelector((state) => state.login.value);
  const dispatch = useDispatch();
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const logoutHandler = async () => {
    try {
      const token = Cookies.get("token");
      if (!token) {
        toast.error("No token found. Please log in.");
        return;
      }

      // Call the logout endpoint
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/logout`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        // Clear local state after successful logout
        Cookies.remove("token");
        dispatch(loggedOut());
        dispatch(clear());
        dispatch(clearWishlist());
        // Show success toast
        toast.success("Logout Successfully");

        // Navigate to login or home page
        navigate("/login");
      } else {
        toast.error("Logout failed, please try again.");
      }
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("An error occurred during logout. Please try again.");
    }
  };

  return (
    <div className="w-full bg-slate-900 py-4 relative">
      <nav className="max-w-[1080px] flex justify-between mx-auto items-center relative px-6 ">
        <NavLink to="/">
          <img
            src="./shop-logo-cart.png"
            alt="logoPic"
            className=" w-[120px] h-[40px]"
          ></img>
        </NavLink>
        <div className="flex gap-4 items-center">
          {login && (
            <NavLink to="/">
              <div className="text-xl text-white hover:border-b-2 transition-all delay-200">Home</div>
            </NavLink>
          )}
          {login && (
            <NavLink to="/cart" className="relative">
              <FaShoppingCart fill="white" fontSize={25} />
              {cart.length > 0 ? (
                <span className="absolute -top-2 -right-2 bg-green-500 p-1 text-xs font-semibold rounded-full w-5 h-5 flex items-center justify-center">
                  {cart.length}
                </span>
              ) : (
                <></>
              )}
            </NavLink>
          )}

          {user && (
            <div className="relative">
              <span className="text-sm text-white">
                {" "}
                <span className="text-xs">Welcome!</span>{" "}
                {user["name"].split(" ")[0]}{" "}
              </span>
              <AccountCircleIcon
                onMouseEnter={() => setShowUserDropdown(true)}
                onMouseLeave={() => setShowUserDropdown(false)}
                color="success"
                fontSize="large"
                className="cursor-pointer"
              />
              {showUserDropdown && (
                <div
                  onMouseEnter={() => setShowUserDropdown(true)}
                  onMouseLeave={() => setShowUserDropdown(false)}
                  className="absolute w-full py-2 font-bold rounded-md bg-slate-200 z-10"
                >
                  <ul className="text-center text-xs">
                    <li onClick={()=>navigate('/profile')} className="cursor-pointer px-2 py-4 hover:bg-slate-300">
                      <span>
                        {/* {user["name"].length > 26
                          ? `${user["name"].substring(0, 24)}...`
                          : user["name"]} */}
                        Profile
                      </span>
                    </li>
                    <li 
                      onClick={() => navigate("/order")}
                      className="cursor-pointer px-2 py-4 hover:bg-slate-300"
                    >
                      <span>Orders</span>
                    </li>
                    <li
                      onClick={() => navigate("/wishlist")}
                      className="cursor-pointer px-2 py-4 hover:bg-slate-300"
                    >
                      <div>Wishlist</div>
                    </li>
                    <li
                      onClick={() => navigate("/cart")}
                      className="cursor-pointer px-2 py-4 hover:bg-slate-300"
                    >
                      <div>Cart</div>
                    </li>
                    <li
                      onClick={logoutHandler}
                      className="cursor-pointer px-2 py-4 hover:bg-slate-300"
                    >
                      <div>Logout</div>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          )}

          {!login && (
            <NavLink to="/login">
              <div className="text-xl text-white">Login</div>
            </NavLink>
          )}
          {!login && (
            <NavLink to="/signup">
              <div className="text-xl text-white">Signup</div>
            </NavLink>
          )}
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
