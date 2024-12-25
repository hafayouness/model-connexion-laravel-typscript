import React, { useEffect, useRef, useState } from "react";
import Logo from "../assets/logo.png";
import api from "../api";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../authContext";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { FaCog, FaMoon, FaQuestionCircle } from "react-icons/fa";
import { IoLogOutOutline } from "react-icons/io5";

const Header: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const { isAuthenticated, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const navbarRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const handleClickOutside = (event: MouseEvent) => {
    if (
      navbarRef.current &&
      !navbarRef.current.contains(event.target as Node)
    ) {
      setIsMenuOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (!user) {
          const response = await api.get("/user");
          console.log("response", response.data);
          setUser(response.data);
        }
      } catch (error: any) {
        console.error(
          "Error fetching user:",
          error.response ? error.response.data : error.message
        );
        setUser(null);
      }
    };
    fetchUser();
  }, [isAuthenticated, user]);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setUser(null);
    logout();
    navigate("/signin");
  };

  const handleCourse = () => {
    navigate("/courses");
  };

  return (
    <div className="flex items-center justify-between sticky top-0 bg-white z-50 shadow-lg">
      <div className="">
        <img src={Logo} alt="logo de projet" className="w-16 h-15 ml-7" />
      </div>
      <div>
        <ul className="flex items-center justify-center gap-10">
          <li className="text-gray-400 hover:text-blue-400">
            <a href="/courses">Courses</a>
          </li>
          <li className="text-gray-400 hover:text-blue-400">
            <a href="/about">About us</a>
          </li>
          <li className="text-gray-400 hover:text-blue-400">
            <a href="/contact">Contact</a>
          </li>
        </ul>
      </div>
      <div className="flex gap-8">
        {isAuthenticated && user ? (
          <div className="flex items-center gap-4 mr-2 relative">
            <div
              className="w-12 h-12 rounded-full flex items-center bg-gray-200 justify-center overflow-hidden border-2 border-blue-500 hover:border-blue-700 object-cover "
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <img
                src={`http://localhost:8000/storage/${user?.profile_photo}`}
                alt="Profile Preview"
                // className="w-12 h-12 object-contain"
              />
              <div className="absolute bottom-0 right-0 w-4 h-4 bg-gray-300 rounded-full border-none flex items-center justify-center">
                <span className="text-black">
                  <MdOutlineKeyboardArrowDown className="border-white" />
                </span>
              </div>
            </div>

            {isMenuOpen && (
              <div
                className={`absolute right-0 top-14 w-80 h-95 bg-white rounded-lg shadow-lg border ${
                  isVisible ? "block" : "hidden"
                }`}
                ref={navbarRef}
              >
                <ul className="text-gray-700">
                  <li className="px-4 py-2 text-center border-b-2">
                    <div className="flex items-center gap-4 hover:bg-gray-100 cursor-pointer">
                      <Link
                        to="/profile"
                        className="flex items-center gap-4 hover:bg-gray-100 cursor-pointer"
                      >
                        <img
                          src={`http://localhost:8000/storage/${user?.profile_photo}`}
                          alt="Profile Preview"
                          className="w-12 h-12 rounded-full object-contain border-2 border-blue-500 mb-2"
                        />
                        <span className="text-black font-bold text-2xl">
                          {user?.name}
                        </span>
                      </Link>
                    </div>
                    <hr />
                    <button
                      className="text-black border-2 rounded-lg mt-3 px-8 py-2 text-center w-full bg-gray-100"
                      onClick={handleCourse}
                    >
                      See your courses
                    </button>
                  </li>
                  <li className="px-4 hover:bg-gray-100 cursor-pointer border-b-1">
                    <div className="flex items-center gap-2 p-3 border-b hover:bg-gray-100 rounded-lg cursor-pointer">
                      <FaCog className="text-2xl bg-gray-300 rounded-full p-1" />
                      <span className="text-lg font-medium">Setting</span>
                    </div>
                  </li>
                  <li className="px-4 hover:bg-gray-100 cursor-pointer border-b-1">
                    <div className="flex items-center gap-2 p-3 border-b hover:bg-gray-100 rounded-lg cursor-pointer">
                      <FaQuestionCircle className="text-black text-2xl bg-gray-300 rounded-full p-1" />
                      <span className="text-lg font-medium">Help</span>
                    </div>
                  </li>
                  <li className="px-4 hover:bg-gray-100 cursor-pointer border-b-1">
                    <div className="flex items-center gap-3 p-3 hover:bg-gray-100 rounded-lg cursor-pointer">
                      <FaMoon className="text-black text-2xl bg-gray-300 rounded-full p-1" />
                      <span className="text-lg font-medium">Accessibility</span>
                    </div>
                  </li>
                  <li className="px-4 py-2 cursor-pointer text-center">
                    <button
                      onClick={handleLogout}
                      className="flex items-center justify-center gap-2 border px-4 py-1 rounded-lg bg-white text-gray-400 hover:bg-gray-100 hover:text-black hover:border w-full"
                    >
                      <IoLogOutOutline className="text-black text-2xl bg-gray-300 rounded-full p-1" />
                      <span>Logout</span>
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        ) : (
          <>
            <button className="border px-5 py-1 rounded-lg bg-blue-500 text-white hover:bg-white hover:text-blue-500 hover:border">
              <a href="/signin">Sign in</a>
            </button>
            <button className="border px-5 py-1 rounded-lg mr-4 bg-blue-500 text-white hover:bg-white hover:text-blue-500 hover:border">
              <a href="/signup">Sign up</a>
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Header;
