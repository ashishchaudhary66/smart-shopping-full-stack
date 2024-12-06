import React, { useState } from "react";
import { NavLink,useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

export default function Signup() {
    const navigate=useNavigate();
    const [loading,setLoading] = useState(false);

    const [signUpData,setSignUpData] = useState(
        {
            name:"",
            email:"",
            password:"",
            confirmPassword:""
        }
    )

    function handleChange(event) {
        const { name, value } = event.target;
        setSignUpData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    }

    const submitHandler = async(event) => {
        event.preventDefault();

        if (!signUpData.name || !signUpData.email || !signUpData.password || !signUpData.confirmPassword) {
            toast.error("Please fill in all fields");
            return;
        }

        if(signUpData.password !== signUpData.confirmPassword){
            toast.error("Password must be equal");
            return;
        }

        try {
            setLoading(true);

            // Call the login endpoint
            const response = await fetch(`${process.env.REACT_APP_BASE_URL}/signup`, {
                method: "POST",
                headers: {
                "Content-Type": "application/json",
                },
                body: JSON.stringify(signUpData),
            });

            const result = await response.json();

            if (response.ok) {
                toast.success("Account created successfully");
                navigate("/login");
            } else {
                // Handle error from the server
                toast.error(result.message || "Login failed");
                console.error("Login failed:", result);
            }
        } catch (error) {
            toast.error("Something went wrong. Please try again.");
            console.error("Error:", error);
        } finally {
            setLoading(false);
        }
    }
    return (
        <div>
            <div className="flex flex-col items-center min-h-screen pt-6 sm:justify-center sm:pt-0 bg-gray-50">
                <div>
                    <h3 className="text-4xl font-bold text-green-500 mt-8">
                        Registration
                    </h3>
                </div>
                <div className="w-full px-6 py-4 mt-6 overflow-hidden bg-white shadow-md sm:max-w-lg sm:rounded-lg">
                    <form onSubmit={submitHandler} className="mt-6">
                        <div>
                            <label
                                htmlFor="name"
                                className="block text-sm font-semibold text-gray-800"
                                
                            >
                                Name
                            </label>
                            <div className="flex flex-col items-start">
                                <input
                                    type="text"
                                    name="name"
                                    value={signUpData.name}
                                    onChange={handleChange}
                                    required
                                    className="block w-full px-4 py-2 mt-2 text-green-500 bg-white border rounded-md focus:border-green-400 focus:ring-green-300 focus:outline-none focus:ring focus:ring-opacity-40"
                                />
                            </div>
                        </div>
                        <div className="mt-4">
                            <label
                                htmlFor="email"
                                className="block text-sm font-semibold text-gray-800"
                                
                            >
                                Email
                            </label>
                            <div className="flex flex-col items-start">
                                <input
                                    type="email"
                                    name="email"
                                    value={signUpData.email}
                                    onChange={handleChange}
                                    required
                                    className="block w-full px-4 py-2 mt-2 text-green-500 bg-white border rounded-md focus:border-green-400 focus:ring-green-300 focus:outline-none focus:ring focus:ring-opacity-40"
                                    
                                />
                            </div>
                        </div>
                        <div className="mt-4">
                            <label
                                htmlFor="password"
                                className="block text-sm font-semibold text-gray-800"
                                
                            >
                                Password
                            </label>
                            <div className="flex flex-col items-start">
                                <input
                                    type="password"
                                    name="password"
                                    value={signUpData.password}
                                    onChange={handleChange}
                                    required
                                    minLength={4}
                                    className="block w-full px-4 py-2 mt-2 text-green-500 bg-white border rounded-md focus:border-green-400 focus:ring-green-300 focus:outline-none focus:ring focus:ring-opacity-40"
                                    
                                />
                            </div>
                        </div>
                        <div className="mt-4">
                            <label
                                htmlFor="password_confirmation"
                                className="block text-sm font-semibold text-gray-800"
                                
                            >
                                Confirm Password
                            </label>
                            <div className="flex flex-col items-start">
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={signUpData.confirmPassword}
                                    onChange={handleChange}
                                    required
                                    className="block w-full px-4 py-2 mt-2 text-green-500 bg-white border rounded-md focus:border-green-400 focus:ring-green-300 focus:outline-none focus:ring focus:ring-opacity-40"
                                    
                                />
                            </div>
                        </div>
                        <NavLink to='/signup' className="text-xs text-green-500 hover:underline">Forget Password?</NavLink>

                        <div className="flex items-center mt-4">
                            <button disabled={loading} type="submit" className="w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-green-500 rounded-md hover:bg-green-400 focus:outline-none focus:bg-green-400">
                                {loading?'Loading...':'Register'}
                            </button>
                        </div>
                    </form>
                    <div className="mt-4 text-grey-600">
                        Already have an account?{" "}
                        <span>
                        <NavLink to="/login" className="text-green-500 hover:underline" >Log in</NavLink>
                        </span>
                    </div>
                    <div className="flex items-center w-full my-4">
                        <hr className="w-full" />
                        <p className="px-3 ">OR</p>
                        <hr className="w-full" />
                    </div>
                    <div className="my-6 space-y-2">
                        <button
                            aria-label="Login with Google"
                            type="button"
                            className="flex items-center justify-center w-full p-2 space-x-4 border rounded-md focus:ring-2 focus:ring-offset-1 dark:border-gray-400 focus:ring-green-300"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 32 32"
                                className="w-5 h-5 fill-current"
                            >
                                <path d="M16.318 13.714v5.484h9.078c-0.37 2.354-2.745 6.901-9.078 6.901-5.458 0-9.917-4.521-9.917-10.099s4.458-10.099 9.917-10.099c3.109 0 5.193 1.318 6.38 2.464l4.339-4.182c-2.786-2.599-6.396-4.182-10.719-4.182-8.844 0-16 7.151-16 16s7.156 16 16 16c9.234 0 15.365-6.49 15.365-15.635 0-1.052-0.115-1.854-0.255-2.651z"></path>
                            </svg>
                            <p>Login with Google</p>
                        </button>
                        
                    </div>
                </div>
            </div>
        </div>
    );
}