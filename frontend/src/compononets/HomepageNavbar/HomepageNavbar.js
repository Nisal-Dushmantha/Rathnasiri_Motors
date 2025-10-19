import React from "react";
import { Link, useLocation } from "react-router-dom";
import { AiOutlineLogout } from "react-icons/ai";

function HomepageNavbar() {
  const location = useLocation();

  const navItems = [
    {
      name: "Home",
      path: "/homepage",
    },
    {
      name: "Users",
      path: "/user",
    },
    {
      name: "Products",
      path: "/products",
    },
    {
      name: "Inventory",
      path: "/inventory",
    },
    {
      name: "Services",
      path: "/service",
    },
    {
      name: "Finance",
      path: "/finance",
    },
    {
      name: "Insurance and Registration",
      path: "/insurance",
    },
  ];

  return (
    <div className="bg-white">
      {/* Main navigation */}
      <div className="bg-[#0B3954] border-b border-[#0B3954]">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link to="/homepage" className="flex items-center">
              <div className="mr-3">
                <img
                  src="\rathnasiri-logo.jpeg"
                  alt="Logo"
                  className="h-12 w-12 rounded-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M20 16.2A4.5 4.5 0 0 0 17.5 8h-1.8A7 7 0 1 0 4 14.9'%3E%3C/path%3E%3Cpath d='M12 16v6'%3E%3C/path%3E%3Cpath d='m16 16-4 6'%3E%3C/path%3E%3Cpath d='m8 16 4 6'%3E%3C/path%3E%3C/svg%3E";
                  }}
                />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">
                  Rathnasiri Motors
                </h1>
              </div>
            </Link>

            {/* Logout Button */}
            <Link
              to="/"
              className="flex items-center bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors duration-200"
            >
              <span className="mr-1">Logout</span>
              <AiOutlineLogout size={20} />
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-center">
            <div className="hidden md:flex space-x-2 py-3">
              {navItems.map((item, index) => {
                // Check if the current path matches the item path
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={index}
                    to={item.path}
                    className={`px-4 py-2 text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "text-blue-600 border-b-2 border-blue-600"
                        : "text-gray-700 hover:text-blue-600"
                    }`}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu button - Hidden on desktop */}
      <div className="md:hidden px-4 py-3 border-b border-gray-100">
        <button className="w-full flex items-center justify-between py-2 px-4 rounded-md bg-gray-50 text-gray-700">
          <span>Menu</span>
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default HomepageNavbar;
