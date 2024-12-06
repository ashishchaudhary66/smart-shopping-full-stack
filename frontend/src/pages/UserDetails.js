import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";

const UserDetails = () => {
  const [user, setUser] = useState(null);
  const decodeToken = (token) => {
      try {
          const decodedPayload = jwtDecode(token);
          return decodedPayload;
        } catch (error) {
            console.error("Failed to decode token", error);
        }
    };
    const fetchUserDetails = () => {
      const token = Cookies.get("token");
      const payload= decodeToken(token);
      console.log("Payload: ",payload)
      setUser(payload);
    };

    useEffect(()=>{
        fetchUserDetails();
    },[])
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      {
        user ? (
            <div className="bg-white shadow-md rounded-lg p-6 max-w-md w-full">
                <h1 className="text-2xl font-bold text-gray-800 mb-4">User Details</h1>
                <div className="space-y-4">
                <div>
                    <span className="block font-semibold text-gray-600">Email:</span>
                    <span className="text-gray-800">{user.email}</span>
                </div>
                <div>
                    <span className="block font-semibold text-gray-600">ID:</span>
                    <span className="text-gray-800">{user._id}</span>
                </div>
                <div>
                    <span className="block font-semibold text-gray-600">Role:</span>
                    <span className="text-gray-800">{user.role}</span>
                </div>
                <div>
                    <span className="block font-semibold text-gray-600">Name:</span>
                    <span className="text-gray-800">{user.name}</span>
                </div>
                <div>
                    <span className="block font-semibold text-gray-600">
                    Is Deleted:
                    </span>
                    <span
                    className={`text-sm ${
                        user.isDeleted ? "text-red-500" : "text-green-500"
                    }`}
                    >
                    {user.isDeleted ? "De-Active" : "Active"}
                    </span>
                </div>
                </div>
            </div>
        ) : (
            <div className="bg-white shadow-md rounded-lg p-6 max-w-md w-full">
                <h1 className="text-2xl font-bold text-gray-800 mb-4">User Not Found</h1>
            </div>
        )
      }
    </div>
  );
};

export default UserDetails;
