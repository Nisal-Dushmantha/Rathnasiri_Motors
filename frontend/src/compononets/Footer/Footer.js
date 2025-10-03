import React from "react";

function Footer() {
  return (
    <footer className="bg-[#0B3954] text-white mt-6">
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="border-t border-white/10 pt-4 text-xs text-white/80 text-center">
          <p>&copy; {new Date().getFullYear()} Rathnasiri Motors. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
