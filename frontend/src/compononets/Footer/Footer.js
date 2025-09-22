import React from "react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-[#0B3954] text-white mt-10">
      <div className="max-w-7xl mx-auto px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-xl font-semibold mb-3">About Rathnasiri Motors</h3>
            <p className="text-white/80 text-sm leading-relaxed">
              Placeholder text: We are a trusted name for bikes, services, and spare parts. Replace this copy with your own.
            </p>
          </div>

          {/* Quick Facts */}
          <div>
            <h3 className="text-xl font-semibold mb-3">Quick Facts</h3>
            <ul className="space-y-2 text-sm text-white/90 list-disc list-inside">
              <li>Serving riders since 1998</li>
              <li>2000+ services completed yearly</li>
              <li>Certified technicians on-site</li>
              <li>Genuine spare parts inventory</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xl font-semibold mb-3">Contact</h3>
            <ul className="space-y-2 text-sm text-white/90">
              <li>Phone: +94 7X XXX XXXX</li>
              <li>Email: info@rathnasirimotors.lk</li>
              <li>Address: 123 Main Street, Anytown</li>
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h3 className="text-xl font-semibold mb-3">Working Hours</h3>
            <ul className="space-y-1 text-sm text-white/90">
              <li>Mon–Fri: 8:30 AM – 6:00 PM</li>
              <li>Sat: 9:00 AM – 4:00 PM</li>
              <li>Sun: Closed</li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 mt-10 pt-6 text-sm text-white/80 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>&copy; {new Date().getFullYear()} Rathnasiri Motors. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link to="/privacy" className="hover:text-white">Privacy</Link>
            <span className="opacity-50">|</span>
            <Link to="/terms" className="hover:text-white">Terms</Link>
            <span className="opacity-50">|</span>
            <Link to="/support" className="hover:text-white">Support</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
