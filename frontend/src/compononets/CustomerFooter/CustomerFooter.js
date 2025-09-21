import React from 'react';

function CustomerFooter() {
  return (
    <footer className="bg-blue-900 text-white py-10 mt-20">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">

        {/* Brand & Description */}
        <div>
          <h2 className="text-2xl font-bold mb-2">Rathnasiri Motors</h2>
          <p className="text-sm text-blue-100">
            Serving Sri Lanka for over 20 years with trusted automotive solutions—from bikes and spare parts to repairs and insurance.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2 text-blue-100 text-sm">
            <li><a href="#" className="hover:text-white transition">Home</a></li>
            <li><a href="#" className="hover:text-white transition">Services</a></li>
            <li><a href="#" className="hover:text-white transition">Blog</a></li>
            <li><a href="#" className="hover:text-white transition">Contact</a></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Contact Us</h3>
          <ul className="space-y-2 text-blue-100 text-sm">
            <li>📞 +8801777787848</li>
            <li>✉️ support@uprankly.com</li>
            <li>📍 Colombo, Sri Lanka</li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="mt-10 border-t border-blue-700 pt-4 text-center text-sm text-blue-300">
        © {new Date().getFullYear()} Rathnasiri Motors. All rights reserved.
      </div>
    </footer>
  );
}

export default CustomerFooter;
