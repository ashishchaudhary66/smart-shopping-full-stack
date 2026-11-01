import React, { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import toast from "react-hot-toast";
import { clear } from "../redux/Slices/cartSlice";

const Checkout = () => {
  const cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", address: "" });
  const API_BASE_URL = process.env.REACT_APP_BASE_URL;
  const products = useMemo(() => cart.map((item) => ({
    productId: item._id,
    name: item.title,
    image: item.image,
    quantity: 1,
    price: item.price,
  })), [cart]);
  const [quantities, setQuantities] = useState({});
  const getQuantity = (id) => quantities[id] || 1;
  const totalPrice = products.reduce((sum, item) => sum + item.price * getQuantity(item.productId), 0);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckout = async (event) => {
    event.preventDefault();
    if (!products.length) return toast.error("Your cart is empty.");
    setIsSubmitting(true);
    try {
      await axios.post(`${API_BASE_URL}/buy`, {
        products: products.map((item) => ({ productId: item.productId, quantity: getQuantity(item.productId) })),
        name: formData.name,
        email: formData.email,
        address: formData.address,
      }, { withCredentials: true });
      dispatch(clear());
      toast.success("Order placed successfully.");
    } catch (error) {
      toast.error(error.response?.data?.message || "Order unsuccessful. Please try again.");
      console.error("Checkout error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>
      <div className="space-y-4">
        {products.map((product) => (
          <div key={product.productId} className="flex items-center gap-4 border p-4 rounded-lg shadow-sm">
            <img src={product.image} alt={product.name} className="max-w-[80px] max-h-[80px] p-1" />
            <div className="flex-1">
              <h2 className="text-lg font-medium">{product.name}</h2>
              <p className="text-sm text-gray-500">ID: {product.productId}</p>
              <label className="flex items-center gap-2 mt-2 text-sm font-medium">
                Quantity:
                <input type="number" min="1" max="99" value={getQuantity(product.productId)}
                  onChange={(event) => setQuantities((prev) => ({ ...prev, [product.productId]: Math.min(99, Math.max(1, Number(event.target.value) || 1)) }))}
                  className="w-16 border rounded p-1 text-center" />
              </label>
              <p className="text-sm mt-2">Price per unit: <span className="font-semibold">₹ {product.price.toFixed(2)}</span></p>
              <p className="text-sm">Subtotal: <span className="font-semibold">₹ {(product.price * getQuantity(product.productId)).toFixed(2)}</span></p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6"><h2 className="text-xl font-semibold">Total: <span className="text-blue-600">₹ {totalPrice.toFixed(2)}</span></h2></div>
      <form onSubmit={handleCheckout} className="mt-6 space-y-4">
        <div><label className="block text-sm font-medium mb-2">Name</label><input type="text" name="name" placeholder="Your Full Name" className="w-full border rounded p-2" value={formData.name} onChange={handleInputChange} required /></div>
        <div><label className="block text-sm font-medium mb-2">Email</label><input type="email" name="email" placeholder="Your Email Address" className="w-full border rounded p-2" value={formData.email} onChange={handleInputChange} required /></div>
        <div><label className="block text-sm font-medium mb-2">Address</label><textarea name="address" placeholder="Your Shipping Address" className="w-full border rounded p-2" rows="3" value={formData.address} onChange={handleInputChange} required /></div>
        <button type="submit" disabled={isSubmitting || !products.length} className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50">{isSubmitting ? "Processing..." : "Complete Checkout"}</button>
      </form>
    </div>
  );
};

export default Checkout;
