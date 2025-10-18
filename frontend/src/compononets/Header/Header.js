import React from "react";
import { Link } from "react-router-dom";
import Button from "../ui/Button";

function Header() {
  return (
    <header className="bg-[#0B3954] text-white shadow-sm">
      <div className="w-full mx-auto flex items-center px-8 py-5">
        {/* Logo / Title */}
        <Link to="/" className="flex items-center gap-3 text-white">
          <img
            src={(process.env.PUBLIC_URL || '') + '/rathnasiri-logo.jpeg'}
            alt="Rathnasiri Motors logo"
            className="h-10 w-auto rounded-md shadow-sm"
          />
          <span className="text-3xl font-bold">Rathnasiri Motors</span>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-3 ml-auto">
          <Link to="/Index">
            <Button variant="danger">Logout</Button>
          </Link>
        </nav>
      </div>
    </header>
  );
}

export default Header;
