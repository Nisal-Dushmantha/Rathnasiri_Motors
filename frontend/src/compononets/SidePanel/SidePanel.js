import React from "react";
import {
  AiOutlineHome,
  AiOutlineUser,
  AiOutlineShoppingCart,
  AiOutlineDatabase,
  AiOutlineTool,
  AiOutlineMoneyCollect,
} from "react-icons/ai";
import { Link } from "react-router-dom";

function SidePanel() {
  const menuItems = [
    { name: "HomePage", icon: <AiOutlineHome size={20} />, path: "/homepage" },
    { name: "User Management", icon: <AiOutlineUser size={20} />, path: "/user" },
    { name: "Product Management", icon: <AiOutlineShoppingCart size={20} />, path: "/products" },
    { name: "Inventory Management", icon: <AiOutlineDatabase size={20} />, path: "/inventory" },
    { name: "Service and Repair", icon: <AiOutlineTool size={20} />, path: "/service" },
    { name: "Finance Management", icon: <AiOutlineMoneyCollect size={20} />, path: "/finance" },
    { name: "Insurance and Registration", icon: <AiOutlineMoneyCollect size={20} />, path: "/insurance" },
  ];

  return (
    <div className="w-80 min-h-screen bg-white text-blue-900 flex flex-col p-5 border-r border-gray-100 shadow-sm sticky top-0 overflow-y-auto">
      {/* Logo / Title */}
      <div className="mb-10 flex items-center justify-center flex-col">
        <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mb-3 shadow-sm border border-gray-200">
          <span className="text-blue-800 font-bold text-xl">RM</span>
        </div>
        <h1 className="text-2xl font-bold text-center text-blue-900">Rathnasiri Motors</h1>
      </div>

      {/* Menu */}
      <ul className="space-y-3">
        {menuItems.map((item, index) => (
          <li key={index}>
            <Link
              to={item.path}
              className="group cursor-pointer p-3 flex items-center gap-3 rounded-lg transition-all duration-200 border border-transparent hover:bg-blue-50 hover:text-blue-700 hover:border-blue-100 hover:shadow-sm"
            >
              <span className="text-blue-600 transition-colors group-hover:text-blue-700">{item.icon}</span>
              <span className="text-lg text-blue-900 transition-all group-hover:font-semibold">{item.name}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SidePanel;
