import React, { useState } from "react";
import { useSelector } from "react-redux";
import axios from 'axios';
import toast from "react-hot-toast";
import Cookies from 'js-cookie';
import { jwtDecode } from "jwt-decode";

const Checkout = () => {
  const cart = useSelector((state) => state.cart);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const API_BASE_URL = process.env.REACT_APP_BASE_URL;

  const [products, setProducts] = useState(
    cart.map((product) => {
      return {
        productId: product._id,
        name: product.title,
        image: product.image,
        quantity: 1,
        price: product.price,
      };
    })
  );
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
  });
  // Update quantity of a product
  const handleQuantityChange = (id, newQuantity) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.productId === id
          ? { ...product, quantity: newQuantity > 0 ? newQuantity : 1 } // Prevent quantity < 1
          : product
      )
    );
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Calculate the total price
  const totalPrice = products.reduce(
    (acc, product) => acc + product.price * product.quantity,
    0
  );

  // Handle form submission
  const handleCheckout = (e) => {
    e.preventDefault();

    setIsSubmitting(true); // Disable the submit button during processing
    const token = Cookies.get("token");
    const user = decodeToken(token);
    const responseBody = {
      userId:user._id,
      products,
      name:formData.name,
      email:formData.email,
      address:formData.address
    }
    
    executeCheckout(responseBody,token);
    console.log("Completed Checkout: ",responseBody);
    
  };

  const executeCheckout = async(requestBody,token) => {
    const URL = `${API_BASE_URL}/buy`;
    try {
      const response = await axios.post(URL,requestBody,{
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
      })

      toast.success("Order Placed");
      console.log("Response:", response);
    } catch (error) {
      toast.error("Order unsuccessful, Try again");
      console.error("Error sending POST request:", error.message);
    }
    finally{
      setIsSubmitting(false);
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

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>

      {/* Product List */}
      <div className="space-y-4">
        {products.map((product) => (
          <div
            key={product.id}
            className="flex items-center gap-4 border p-4 rounded-lg shadow-sm"
          >
            {/* Product Image */}
            <img
              src={product.image}
              alt={product.name}
              className="max-w-[80px] max-h-[80px] p-1"
            />

            {/* Product Details */}
            <div className="flex-1">
              <h2 className="text-lg font-medium">{product.name}</h2>
              <p className="text-sm text-gray-500">ID: {product.productId}</p>

              {/* Editable Quantity */}
              <div className="flex items-center gap-2 mt-2">
                <label className="text-sm font-medium">Quantity:</label>
                <input
                  type="number"
                  value={product.quantity}
                  min="1"
                  onChange={(e) =>
                    handleQuantityChange(
                      product.productId,
                      parseInt(e.target.value)
                    )
                  }
                  className="w-16 border rounded p-1 text-center"
                />
              </div>

              <p className="text-sm mt-2">
                Price per unit:{" "}
                <span className="font-semibold">₹ {product.price}</span>
              </p>
              <p className="text-sm">
                Subtotal:{" "}
                <span className="font-semibold">
                ₹ {(product.price * product.quantity).toFixed(2)}
                </span>
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Total Price */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold">
          Total: <span className="text-blue-600">₹ {totalPrice.toFixed(2)}</span>
        </h2>
      </div>

      {/* Checkout Form */}
      <form onSubmit={handleCheckout} className="mt-6 space-y-4">
        {/* Name Field */}
        <div>
          <label className="block text-sm font-medium mb-2">Name</label>
          <input
            type="text"
            name="name"
            placeholder="Your Full Name"
            className="w-full border rounded p-2"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        </div>

        {/* Email Field */}
        <div>
          <label className="block text-sm font-medium mb-2">Email</label>
          <input
            type="email"
            name="email"
            placeholder="Your Email Address"
            className="w-full border rounded p-2"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
        </div>

        {/* Address Field */}
        <div>
          <label className="block text-sm font-medium mb-2">Address</label>
          <textarea
            name="address"
            placeholder="Your Shipping Address"
            className="w-full border rounded p-2"
            rows="3"
            value={formData.address}
            onChange={handleInputChange}
            required
          ></textarea>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Processing..." : "Complete Checkout"}
        </button>
      </form>
    </div>
  );
};

export default Checkout;
