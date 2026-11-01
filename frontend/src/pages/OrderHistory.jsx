import React, { useState, useEffect } from "react";
import axios from "axios";
import OrderItem from "../components/OrderItem";

const OrderHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDetails, setShowDetails] = useState(null);
  const API_BASE_URL = process.env.REACT_APP_BASE_URL;

  useEffect(() => {
    let active = true;
    axios.get(`${API_BASE_URL}/order-history`, { withCredentials: true })
      .then((response) => { if (active) setTransactions(response.data); })
      .catch((err) => { if (active) setError(err.response?.data?.message || "Failed to fetch transaction history."); })
      .finally(() => { if (active) setIsLoading(false); });
    return () => { active = false; };
  }, [API_BASE_URL]);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Orders History</h1>
      {isLoading ? <p className="text-gray-500">Loading...</p> :
        error ? <p className="text-red-500">{error}</p> :
        transactions.length === 0 ? <p className="text-gray-500">No transactions found.</p> :
        showDetails ? <OrderItem items={showDetails} setShowDetails={setShowDetails} /> :
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead><tr className="bg-gray-100">
              <th className="border px-4 py-2 text-left">Transaction ID</th>
              <th className="border px-4 py-2 text-left">Date</th>
              <th className="border px-4 py-2 text-left">Products</th>
              <th className="border px-4 py-2 text-left">Total Price</th>
              <th className="border px-4 py-2 text-left">Address</th>
            </tr></thead>
            <tbody>{transactions.map((transaction) => <tr key={transaction.transactionId}>
              <td className="border px-2 py-1"><button type="button" onClick={() => setShowDetails(transaction)} className="border-b-2 hover:text-green-500">{transaction.transactionId}</button></td>
              <td className="border px-2 py-1">{new Date(transaction.date).toLocaleDateString()}</td>
              <td className="border px-2 py-1">{transaction.products.map((product, index) => <div key={product._id || product.productId} className="mb-2 text-xs p-1">{index + 1}. <span className="text-green-500">{product.title || product.productId?.title || "Product"}</span> (x {product.quantity})</div>)}</td>
              <td className="border px-2 py-1">₹ {Number(transaction.totalPrice).toFixed(2)}</td>
              <td className="border px-2 py-1">{transaction.address}</td>
            </tr>)}</tbody>
          </table>
        </div>}
    </div>
  );
};

export default OrderHistory;
