import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Home } from "lucide-react"; // Import home icon for returning to index

function CustomerHeader() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };
  
  const navigateToIndexPage = () => {
    // Redirect to the main index page
    navigate("/");
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">

        {/* Left: Brand / Logo */}
        <div className="flex items-center space-x-2">
          <span className="text-blue-700 text-3xl font-extrabold">🚘</span>
          <h1 className="text-xl font-bold text-gray-900">Rathnasiri Motors</h1>
        </div>

        {/* Center: Navigation Links */}
        <nav className="flex-grow flex justify-center">
          <ul className="flex items-center space-x-6 text-gray-700 font-medium relative">

            <li>
              <Link to="/CustomerHomepage">
                <button className="hover:text-blue-600 transition">Home</button>
              </Link>
            </li>

            {/* Clickable Dropdown for Bikes with Transition */}
            <li className="relative">
              <button
                onClick={toggleDropdown}
                className="hover:text-blue-600 transition focus:outline-none"
              >
                Bikes
              </button>
              <div
                className={`absolute left-0 mt-2 w-48 bg-white shadow-lg rounded-lg transform transition-all duration-300 origin-top ${
                  isDropdownOpen
                    ? "opacity-100 scale-100 visible"
                    : "opacity-0 scale-95 invisible"
                }`}
              >
                <ul>
                  <li>
                    <Link
                      to="/CustomerBrandNewBikes"
                      className="block px-4 py-2 text-gray-700 hover:bg-blue-100 hover:text-blue-700"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      Brand New Bikes
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/CustomerUsedBikes"
                      className="block px-4 py-2 text-gray-700 hover:bg-blue-100 hover:text-blue-700"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      Used Bikes
                    </Link>
                  </li>
                </ul>
              </div>
            </li>

            <li>
              <Link to="/CustomerSpareParts">
                <button className="hover:text-blue-600 transition">Spare Parts</button>
              </Link>
            </li>
            <li>
              <Link to="/CustomerServiceDates">
                <button className="hover:text-blue-600 transition">Service Dates</button>
              </Link>
            </li>
            <li>
              <Link to="/CustomerAboutUs">
                <button className="hover:text-blue-600 transition">About Us</button>
              </Link>
            </li>
          </ul>
        </nav>

        {/* Right: Leave Button */}
        <div>
          <button 
            onClick={navigateToIndexPage}
            className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
          >
            <Home className="h-4 w-4 mr-2" />
            Leave
          </button>
        </div>
      </div>
    </header>
  );
}

export default CustomerHeader;
