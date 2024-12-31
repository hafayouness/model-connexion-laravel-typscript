import React, { useEffect, useState } from "react";
import "../index.css";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { FaFacebook } from "react-icons/fa";
import { SiGoogle } from "react-icons/si";
import { useAuth } from "../authContext";

const Signin: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        email,
        password,
      };
      const response = await api.post("/signin", payload, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
      console.log(response.data);
      const token = response.data.token;
      if (token) {
        login(token);
        console.log("Token récupéré et login effectué:", token);
        alert("Signin successful!");
        navigate("/dashboard");
      } else {
        alert("No token received!");
      }
    } catch (error: any) {
      console.log(error.message);
      alert("Error during signin! Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center  min-h-screen bg-gray-100 ">
      <div
        className="bg-white p-8 rounded-lg shadow-lg sign-width sm:w-96"
        style={{ width: "600px" }}
      >
        <form onSubmit={handleSubmit}>
          <h2 className="text-2xl font-bold text-center text-blue-500 mb-6 tracking-wide">
            Sign in
          </h2>

          <div className="flex flex-col  mt-5">
            <label htmlFor="email" className="mb-1">
              Email :
            </label>
            <input
              id="email"
              placeholder="enter your email"
              type="email"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="flex flex-col mt-5">
            <label htmlFor="Password" className="mb-1">
              Password :
            </label>
            <input
              id="password"
              placeholder="enter your password"
              type="password"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 mt-8 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Submit
          </button>
          <div className="text-center mt-4">
            <p className="text-gray-600">
              If you don’t have an account,{" "}
              <a href="/signup" className="text-blue-500 hover:underline">
                Sign Up
              </a>
            </p>
          </div>
          <div className="relative flex py-5 items-center">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="flex-shrink mx-4 text-gray-500">or</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>
          <div className="flex items-center justify-between gap-4">
            <button
              type="submit"
              className="flex items-center justify-center w-full py-2 mt-8 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              <FaFacebook className="mr-2" /> Facebook
            </button>
            <button
              type="submit"
              className="flex items-center justify-center w-full py-2 mt-8 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
            >
              <SiGoogle className="mr-2" /> Google
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signin;
