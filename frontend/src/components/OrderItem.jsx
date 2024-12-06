import React from "react";

function OrderItem({ items, setShowDetails }) {

  if (!items) {
    return (
      <div className="p-6">
        <span onClick={() => setShowDetails(null)} className="w-fit text-red-500">
          Back
        </span>
        <p className="text-red-500">No order details available.</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Back Button */}
      <span onClick={() => setShowDetails(null)} className="cursor-pointer text-red-500">
        Back
      </span>

      {/* Transaction Details */}
      <div className="border border-gray-300 rounded-lg shadow-md p-4">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-800">
            Transaction ID: {items.transactionId}
          </h2>
          <p className="text-sm text-gray-600">
            Order Date: {new Date(items.date).toLocaleDateString()}
          </p>
          <p className="text-sm text-gray-600">Customer: {items.name}</p>
          <p className="text-sm text-gray-600">Email: {items.email}</p>
          <p className="text-sm text-gray-600">Address: {items.address}</p>
        </div>

        {/* Product Details */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">Products Ordered:</h3>
          {items.products.map((product) => (
            <div
              key={product.productId._id}
              className="flex items-center space-x-4 border-b pb-4"
            >
              {/* Product Image */}
              <img
                src={product.productId.image}
                alt={product.productId.title}
                className="max-w-[80px] max-h-[80px] p-1"
              />

              {/* Product Info */}
              <div>
                <h4 className="text-base font-medium text-gray-800">
                  {product.productId.title}
                </h4>
                <p className="text-sm text-gray-600">
                  Quantity: {product.quantity}
                </p>
                <p className="text-sm text-gray-600">
                  Price: ₹{product.productId.price.toFixed(2)}
                </p>
                <p className="text-sm text-gray-600">
                  Subtotal: ₹{(product.productId.price * product.quantity).toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="mt-4">
          <h3 className="text-lg font-semibold text-gray-800">Order Total</h3>
          <p className="text-lg text-gray-800 font-medium">
            ₹{items.totalPrice.toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
}

export default OrderItem;
