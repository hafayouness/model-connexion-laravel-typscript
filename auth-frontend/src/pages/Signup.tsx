import React, { useEffect, useState } from "react";
import "../index.css";

import api from "../api";
import { useNavigate } from "react-router-dom";
import { SiGoogle } from "react-icons/si";

const Signup: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [comfirmePassword, setConfirmePassword] = useState("");
  const navigate = useNavigate();
  const [googleToken, setGoogleToken] = useState<string | null>(null);
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [role, setRole] = useState<string>("student");

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const preview = URL.createObjectURL(file);
      setPhotoPreview(preview);

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setProfilePhoto(base64String);
        setPhotoFile(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const handelSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== comfirmePassword) {
      alert("Passwords do not match!");
      return;
    }
    try {
      let payload: SignUpPayload = {
        name,
        email,
        password,
        password_confirmation: comfirmePassword,
        profile_photo: profilePhoto || undefined,
        role: role,
      };

      if (googleToken) {
        payload = { ...payload, google_token: googleToken };
      }

      const response = await api.post("/signup", payload, {
        withCredentials: true,
      });
      console.log("Signup successful:", response.data);
      alert("Signup successful!");
      navigate("/signin");
      setName("");
      setEmail("");
      setPassword("");
      setConfirmePassword("");
      setGoogleToken(null);
      setProfilePhoto(null);
      setPhotoFile(null);
      setRole("student");
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Signup failed";
      alert(errorMessage);
      console.error("Signup error:", error);
    }
  };

  useEffect(() => {
    window.google?.accounts?.id?.initialize({
      client_id:
        "479696637781-k6cdnokb1id7uvu63jds3l72pr73dqh4.apps.googleusercontent.com", // Replace with your actual client ID
      callback: handleGoogleCallback,
    });
  }, []);

  const handleGoogleCallback = async (response: any) => {
    try {
      const token = response.credential;
      const res = await api.post("/auth/google", { token });

      if (res.status === 200) {
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("An error occurred during Google login", error);
    }
  };

  const handleGoogle = () => {
    window.google?.accounts?.id?.prompt();
  };

  return (
    <div className="flex items-center justify-center bg-gray-100">
      <div
        className="bg-white p-8 rounded-lg shadow-lg sign-width sm:w-96"
        style={{ width: "600px", margin: "10px" }}
      >
        <form onSubmit={handelSubmit}>
          <h2 className="text-2xl font-bold text-center text-blue-500 mb-6 tracking-wide">
            Sign up
          </h2>

          <div className="flex flex-col items-center">
            <label htmlFor="photo" className="cursor-pointer">
              <div className="w-24 h-24 rounded-full flex items-center justify-center overflow-hidden border-2 border-blue-500 hover:border-blue-700">
                {photoPreview ? (
                  <img
                    src={photoPreview}
                    alt="Profile Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-center text-gray-500">
                    Choose Photo
                  </span>
                )}
              </div>
            </label>
            <input
              id="photo"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePhotoChange}
            />
          </div>

          <div className="flex flex-col mt-3">
            <label htmlFor="name" className="mb-1">
              Name :
            </label>
            <input
              id="name"
              placeholder="Full Name"
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="flex flex-col mt-5">
            <label htmlFor="email" className="mb-1">
              Email :
            </label>
            <input
              id="email"
              placeholder="Enter your email"
              type="email"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="flex flex-col mt-5">
            <label
              htmlFor="options"
              className="mb-1"
              // className="block text-sm font-medium text-gray-700"
            >
              Role :
            </label>
            <select
              id="options"
              name="options"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-400"
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="" className="text-black">
                Choose an option
              </option>
              <option value="professor" className="text-black">
                Professor
              </option>
              <option value="student" className="text-black">
                Student
              </option>
            </select>
          </div>

          <div className="flex flex-col mt-5">
            <label htmlFor="password" className="mb-1">
              Password :
            </label>
            <input
              id="password"
              placeholder="Enter your password"
              type="password"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="flex flex-col mt-5">
            <label htmlFor="confirmPassword" className="mb-1">
              Confirm Password :
            </label>
            <input
              id="confirmPassword"
              placeholder="Confirm your password"
              type="password"
              className="w-full px-6 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              onChange={(e) => setConfirmePassword(e.target.value)}
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
              Already have an account?
              <a href="/signin" className="text-blue-500 hover:underline ml-1">
                Sign In
              </a>
            </p>
          </div>

          <div className="relative flex py-3 items-center">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="flex-shrink mx-4 text-gray-500">or</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          <div className="flex items-center justify-center">
            <button
              type="button"
              className="flex items-center justify-center w-full py-2 mt-8 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
              onClick={handleGoogle}
            >
              <SiGoogle className="mr-2" /> Google
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
