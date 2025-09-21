import React from "react";
import { Link } from "react-router-dom";

function Header() {
  return (
    <header className="bg-blue-900 text-white py-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center px-6">
        {/* Logo / Title */}
        <h1 className="text-2xl font-bold">Rathnasiri Motors</h1>

        {/* Navigation */}
        <nav className="space-x-6">
          <Link to="/" className="hover:text-gray-300">Home</Link>
          <Link to="/ServiceJobCard" className="hover:text-gray-300">Service Jobs</Link>
          <Link to="/RepairJobCard" className="hover:text-gray-300">Repair Jobs</Link>
          <Link to="/Reports" className="hover:text-gray-300">Reports</Link>
          <Link to="/Index"><button className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition">Logout</button></Link>
        </nav>
      </div>
    </header>
  );
}

export default Header;
