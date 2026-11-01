import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loggedIn } from "../redux/Slices/authenticationSlice";
import { toast } from "react-hot-toast";

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [loginData, setLoginData] = useState({ email: "", password: "" });

  function handleChange(event) {
    const { name, value } = event.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
  }

  async function submitHandler(event) {
    event.preventDefault();
    if (!loginData.email || !loginData.password) {
      toast.error("Please fill in all fields");
      return;
    }
    try {
      setLoading(true);
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/login`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
      });
      const result = await response.json();
      if (!response.ok) {
        toast.error(result.message || "Login failed");
        return;
      }
      dispatch(loggedIn());
      toast.success("Logged in successfully");
      navigate("/");
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative flex flex-col justify-center mt-16 overflow-hidden">
      <div className="w-full p-6 m-auto bg-white rounded-md shadow-xl lg:max-w-xl">
        <h1 className="text-3xl font-semibold text-center text-green-500 uppercase">Sign in</h1>
        <form onSubmit={submitHandler} className="mt-6">
          <div className="mb-2">
            <label htmlFor="email" className="block text-sm font-semibold text-gray-800">Email</label>
            <input id="email" type="email" name="email" value={loginData.email} onChange={handleChange} required className="block w-full px-4 py-2 mt-2 text-green-500 bg-white border rounded-md" />
          </div>
          <div className="mb-2">
            <label htmlFor="password" className="block text-sm font-semibold text-gray-800">Password</label>
            <input id="password" type="password" name="password" value={loginData.password} onChange={handleChange} required className="block w-full px-4 py-2 mt-2 text-green-500 bg-white border rounded-md" />
          </div>
          <div className="mt-6">
            <button type="submit" disabled={loading} className="w-full px-4 py-2 text-white bg-green-500 rounded-md hover:bg-green-400">{loading ? "Loading..." : "Login"}</button>
          </div>
        </form>
        <p className="mt-8 text-xs text-center text-gray-700">Don't have an account? <NavLink to="/signup" className="font-medium text-green-500 hover:underline">Sign Up</NavLink></p>
      </div>
    </div>
  );
}
