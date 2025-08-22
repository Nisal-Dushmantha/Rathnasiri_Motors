import React from "react";

function Footer() {
  return (
    <footer className="bg-blue-900 text-white py-6 mt-10">
      <div className="container mx-auto text-center text-sm">
        <p>&copy; {new Date().getFullYear()} Rathnasiri Motors. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
