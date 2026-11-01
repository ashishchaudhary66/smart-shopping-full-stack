import React from "react";

function OrderItem({ items, setShowDetails }) {
  if (!items) return <div className="p-6"><button type="button" onClick={() => setShowDetails(null)} className="text-red-500">Back</button><p className="text-red-500">No order details available.</p></div>;

  return (
    <div className="p-6 space-y-6">
      <button type="button" onClick={() => setShowDetails(null)} className="cursor-pointer text-red-500">Back</button>
      <div className="border border-gray-300 rounded-lg shadow-md p-4">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Transaction ID: {items.transactionId}</h2>
          <p className="text-sm text-gray-600">Order Date: {new Date(items.date).toLocaleDateString()}</p>
          <p className="text-sm text-gray-600">Customer: {items.name}</p>
          <p className="text-sm text-gray-600">Email: {items.email}</p>
          <p className="text-sm text-gray-600">Address: {items.address}</p>
        </div>
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">Products Ordered:</h3>
          {items.products.map((product, index) => {
            const title = product.title || product.productId?.title || "Product";
            const image = product.image || product.productId?.image || "";
            const unitPrice = Number(product.unitPrice ?? product.productId?.price ?? 0);
            const lineTotal = Number(product.lineTotal ?? unitPrice * product.quantity);
            return <div key={product._id || product.productId?._id || index} className="flex items-center space-x-4 border-b pb-4">
              <img src={image} alt={title} className="max-w-[80px] max-h-[80px] p-1" />
              <div>
                <h4 className="text-base font-medium text-gray-800">{title}</h4>
                <p className="text-sm text-gray-600">Quantity: {product.quantity}</p>
                <p className="text-sm text-gray-600">Price: ₹{unitPrice.toFixed(2)}</p>
                <p className="text-sm text-gray-600">Subtotal: ₹{lineTotal.toFixed(2)}</p>
              </div>
            </div>;
          })}
        </div>
        <div className="mt-4"><h3 className="text-lg font-semibold text-gray-800">Order Total</h3><p className="text-lg text-gray-800 font-medium">₹{Number(items.totalPrice).toFixed(2)}</p></div>
      </div>
    </div>
  );
}

export default OrderItem;
