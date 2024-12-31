import React, { useEffect, useState } from "react";
import { IoConstruct, IoCreate, IoHome, IoRefresh } from "react-icons/io5";
import { MdSpaceDashboard } from "react-icons/md";
import { FaRegUser } from "react-icons/fa";
import { IoSettingsOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import api from "../api";

const SideBar: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      // const token = localStorage.getItem("authToken");
      // if (!token) {
      //   navigate("/signin");
      //   return;
      // }

      try {
        const response = await api.get(
          "/user"
          //   headers: {
          //     Authorization: `Bearer ${token}`,
          //   },
        );

        setUser(response.data);
      } catch (error: any) {
        console.error(
          "Error fetching user data:",
          error.response ? error.response.data : error.message
        );
        setUser(null);
        navigate("/signin");
      }
    };
    fetchUserData();
  }, [navigate]);

  return (
    <div className="w-64 h-400 bg-gray-800 text-white p-6 shadow-lg">
      <div className="flex items-center space-x-4 mb-8">
        <div className="w-16 h-16 rounded-full flex items-center justify-center overflow-hidden border-2 border-blue-500 hover:border-blue-700 ">
          <img
            src={`http://localhost:8000/storage/${user?.profile_photo}`}
            alt="Profile"
            // className="w-12 h-12 rounded-full object-contain"
            className="w-full h-full object-contain"
          />
        </div>

        <span className="text-md font-semibold uppercase">{user?.name}</span>
      </div>

      <div className="space-y-6">
        {user?.role === "professor" && (
          <div
            onClick={() => navigate("/dashboard")}
            className="flex items-center space-x-3 cursor-pointer hover:bg-gray-700 p-3 rounded-md"
          >
            <MdSpaceDashboard />
            <span>Dashboard</span>
          </div>
        )}
        {user?.role === "professor" && (
          <div
            onClick={() => navigate("/create-course")}
            className="flex items-center space-x-3 cursor-pointer hover:bg-gray-700 p-3 rounded-md"
          >
            <IoCreate />
            <span>Creation a Course</span>
          </div>
        )}

        <div
          onClick={() => navigate("/profile")}
          className="flex items-center space-x-3 cursor-pointer hover:bg-gray-700 p-3 rounded-md"
        >
          <FaRegUser />
          <span>Profile</span>
        </div>
        <div
          onClick={() => navigate("/settings")}
          className="flex items-center space-x-3 cursor-pointer hover:bg-gray-700 p-3 rounded-md"
        >
          <IoSettingsOutline />
          <span>Settings</span>
        </div>
      </div>
      {/* User Info Section (optional)
      <div className="mt-auto text-center">
        {user ? (
          <div>
            <img
              src={user.avatar || "default-avatar-url"}
              alt="User Avatar"
              className="w-10 h-10 rounded-full mx-auto"
            />
            <p className="text-sm mt-2">{user.name}</p>
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </div> */}
    </div>
  );
};

export default SideBar;
