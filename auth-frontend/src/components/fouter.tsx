import React from "react";
import Logo from "../assets/logo.png";
import { BsFacebook, BsInstagram, BsGithub } from "react-icons/bs";
import { Link } from "react-router-dom";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="mb-6 flex flex-col items-center md:items-start">
              <Link to="/home">
                <img
                  src={Logo}
                  alt="logo de projet"
                  className="w-16 h-15 mb-4"
                />
              </Link>
              <div className="flex space-x-4">
                <a
                  href="https://github.com/hafayouness"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <BsGithub className="text-2xl hover:text-gray-400" />
                </a>
                <a
                  href="https://www.instagram.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <BsInstagram className="text-2xl hover:text-gray-400" />
                </a>
                <a
                  href="https://www.facebook.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <BsFacebook className="text-2xl hover:text-gray-400" />
                </a>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-4 text-center md:text-left">
            <div>
              <h3 className="text-lg font-semibold mb-4">All Sections</h3>
              <ul>
                <li className="mb-2">
                  <Link to="/about" className="text-gray-400 hover:text-white">
                    About
                  </Link>
                </li>
                <li className="mb-2">
                  <Link
                    to="/contact"
                    className="text-gray-400 hover:text-white"
                  >
                    Contact
                  </Link>
                </li>
                <li className="mb-2">
                  <Link
                    to="/courses"
                    className="text-gray-400 hover:text-white"
                  >
                    All Courses
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Follow us</h3>
              <ul>
                <li className="mb-2">
                  <a
                    href="https://github.com/hafayouness"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white"
                  >
                    Github
                  </a>
                </li>
                <li className="mb-2">
                  <Link to="#" className="text-gray-400 hover:text-white">
                    Discord
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul>
                <li className="mb-2">
                  <Link to="#" className="text-gray-400 hover:text-white">
                    Privacy Policy
                  </Link>
                </li>
                <li className="mb-2">
                  <Link to="#" className="text-gray-400 hover:text-white">
                    Terms & Conditions
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-400 mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} Savoir+. All rights reserved.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://www.facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gray-400"
              >
                <BsFacebook className="text-2xl" />
              </a>
              <a
                href="https://www.instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gray-400"
              >
                <BsInstagram className="text-2xl" />
              </a>
              <a
                href="https://github.com/hafayouness"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gray-400"
              >
                <BsGithub className="text-2xl" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
