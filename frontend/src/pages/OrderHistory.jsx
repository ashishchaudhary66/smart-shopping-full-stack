import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import axios from "axios";
import OrderItem from "../components/OrderItem";

const OrderHistory = () => {
  // State to store transactions, loading, and error
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDetails, setShowDetails] = useState(null);
  const API_BASE_URL = process.env.REACT_APP_BASE_URL;

  const fetchTransactions = async () => {
    try {
      setIsLoading(true);
      const token = Cookies.get("token");
      const payload = decodeToken(token);

      const url = `${API_BASE_URL}/order-history/${payload._id}`;
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("history: ", response.data);
      setTransactions(response.data);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to fetch transaction history."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch transaction history from the API
  useEffect(() => {
    fetchTransactions();
  }, []);

  const decodeToken = (token) => {
    try {
      const decodedPayload = jwtDecode(token);
      return decodedPayload;
    } catch (error) {
      console.error("Failed to decode token", error);
    }
  };

  // Render the component
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Orders History</h1>

      {isLoading ? (
        <p className="text-gray-500">Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : transactions.length === 0 ? (
        <p className="text-gray-500">No transactions found.</p>
      ) : showDetails ? (
        <OrderItem items={showDetails} setShowDetails={setShowDetails} />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-4 py-2 text-left">Transaction ID</th>
                <th className="border px-4 py-2 text-left">Date</th>
                <th className="border px-4 py-2 text-left">Products</th>
                <th className="border px-4 py-2 text-left">Total Price</th>
                <th className="border px-4 py-2 text-left">Address</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction.transactionId}>
                  <td className="border px-2 py-1">
                    <span
                      onClick={() => setShowDetails(transaction)}
                      className="cursor-pointer border-b-2 hover:text-green-500 transition-all delay-100"
                    >
                      {transaction.transactionId}
                    </span>
                  </td>
                  <td className="border px-2 py-1">
                    {new Date(transaction.date).toLocaleDateString()}
                  </td>
                  <td className="border px-2 py-1">
                    {transaction.products.map((product, index) => (
                      <div key={product.productId._id} className="mb-2">
                        <p className=" text-xs p-1 ">
                          <span>{index + 1}. </span>
                          <span className=" text-green-500">
                            { product.productId.title}
                          </span>
                          <span>(x {product.quantity})</span>
                        </p>
                      </div>
                    ))}
                  </td>
                  <td className="border px-2 py-1">
                    ${transaction.totalPrice.toFixed(2)}
                  </td>
                  <td className="border px-2 py-1">{transaction.address}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
