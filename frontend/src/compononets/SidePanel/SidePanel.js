import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  AiOutlineHome,
  AiOutlineUser,
  AiOutlineShoppingCart,
  AiOutlineTool,
  AiOutlineFileText,
  AiOutlineBarChart,
  AiOutlineTag
} from 'react-icons/ai';

function SidePanel({ onNavigate }) {
  const location = useLocation();

  const menuItems = [
    { 
      name: "HomePage", 
      icon: <AiOutlineHome size={22} />, 
      path: "/homepage",
      color: "bg-blue-100 text-blue-600" 
    },
    { 
      name: "User Management", 
      icon: <AiOutlineUser size={22} />, 
      path: "/user",
      color: "bg-purple-100 text-purple-600"
    },
    { 
      name: "Product Management", 
      icon: <AiOutlineShoppingCart size={22} />, 
      path: "/products",
      color: "bg-green-100 text-green-600"
    },
    { 
      name: "Inventory Management", 
      icon: <AiOutlineFileText size={22} />, 
      path: "/inventory",
      color: "bg-amber-100 text-amber-600"
    },
    { 
      name: "Service and Repair", 
      icon: <AiOutlineTool size={22} />, 
      path: "/service",
      color: "bg-sky-100 text-sky-600"
    },
    { 
      name: "Finance Management", 
      icon: <AiOutlineTag size={22} />, 
      path: "/finance",
      color: "bg-indigo-100 text-indigo-600"
    },
    { 
      name: "Insurance and Registration", 
      icon: <AiOutlineBarChart size={22} />, 
      path: "/insurance",
      color: "bg-red-100 text-red-600"
    },
  ];

  return (
    <div className="w-64 min-h-screen bg-white border-r border-gray-100 flex flex-col sticky top-0 overflow-y-auto">
      {/* Logo / Title */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="bg-blue-100 rounded-lg p-2">
            <img 
              src="/logo192.png" 
              alt="Logo" 
              className="w-8 h-8"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 24 24' fill='none' stroke='%232563eb' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M20 16.2A4.5 4.5 0 0 0 17.5 8h-1.8A7 7 0 1 0 4 14.9'%3E%3C/path%3E%3Cpath d='M12 16v6'%3E%3C/path%3E%3Cpath d='m16 16-4 6'%3E%3C/path%3E%3Cpath d='m8 16 4 6'%3E%3C/path%3E%3C/svg%3E";
              }}
            />
          </div>
          <div>
            <h1 className="font-semibold text-gray-800 leading-tight">Rathnasiri Motors</h1>
            <p className="text-xs text-gray-500">Management System</p>
          </div>
        </div>
      </div>

      {/* Menu */}
      <nav className="flex-1 py-6 px-3">
        <ul className="space-y-1.5">
          {menuItems.map((item, index) => {
            const isActive = location.pathname === item.path;
            return (
              <li key={index}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                    isActive 
                      ? "bg-blue-50" 
                      : "hover:bg-gray-50"
                  }`}
                  onClick={() => {
                    if (typeof onNavigate === 'function') onNavigate();
                  }}
                >
                  <div className={`rounded-lg p-1.5 ${item.color}`}>
                    {item.icon}
                  </div>
                  <span className={`text-sm ${isActive ? "font-medium" : "font-normal"} text-gray-800`}>
                    {item.name}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}

export default SidePanel;
