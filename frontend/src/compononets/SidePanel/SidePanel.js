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
     {name: "Insurance and Registration", icon: <AiOutlineMoneyCollect size={20} />, path: "/insurance" },
  ];

  return (
    <div className="fixed top-0 left-0 w-80 h-screen bg-gradient-to-b from-blue-900 to-blue-800 text-white flex flex-col p-5 shadow-lg">
      {/* Logo / Title */}
      <div className="mb-10 flex items-center justify-center flex-col">
        <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mb-3 shadow-md">
          <span className="text-blue-900 font-bold text-xl">RM</span>
        </div>
        <h1 className="text-2xl font-bold text-center">Rathnasiri Motors</h1>
      </div>

      {/* Menu */}
      <ul className="space-y-3">
        {menuItems.map((item, index) => (
          <li key={index}>
            <Link
              to={item.path}
              className="cursor-pointer p-3 flex items-center gap-3 rounded-lg hover:bg-blue-700 hover:translate-x-2 transition-all duration-200"
            >
              <span>{item.icon}</span>
              <span className="font-medium text-lg">{item.name}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SidePanel;
