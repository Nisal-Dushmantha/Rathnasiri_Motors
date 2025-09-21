import React from 'react';
import CustomerNavBar from '../CustomerNavBar/CustomerNavBar';
import CustomerFooter from '../CustomerFooter/CustomerFooter';

function CustomerAboutUs() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-blue-50 flex flex-col">
      <CustomerNavBar />
      <main className="flex-grow p-6">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-blue-900 mb-4">About Rathnasiri Motors</h1>
          <p className="text-lg text-gray-700 mb-8">
            Welcome to <span className="font-semibold text-blue-800">Rathnasiri Motors</span> — your one-stop destination for everything two-wheeled. From brand new bikes to reliable used models, we offer a complete range of services to keep you riding with confidence.
          </p>

          <div className="bg-white rounded-3xl shadow-xl p-8 mb-12">
            <h2 className="text-2xl font-semibold text-blue-800 mb-4">What We Offer</h2>
            <ul className="text-gray-700 text-left list-disc list-inside space-y-2">
              <li><strong>Brand New Bikes:</strong> Explore the latest models from trusted manufacturers.</li>
              <li><strong>Used Bikes:</strong> Carefully inspected pre-owned bikes at unbeatable prices.</li>
              <li><strong>Spare Parts:</strong> Genuine parts and accessories to keep your bike in top shape.</li>
              <li><strong>Service & Repair:</strong> Expert technicians providing maintenance and repairs with care.</li>
              <li><strong>Insurance & Registration:</strong> Hassle-free handling of paperwork and protection plans.</li>
            </ul>
          </div>

          <div className="bg-white rounded-3xl shadow-xl p-8 mb-12">
            <h2 className="text-2xl font-semibold text-blue-800 mb-4">Our Commitment</h2>
            <p className="text-gray-700 leading-relaxed">
              At Rathnasiri Motors, we believe in building long-term relationships with our customers. Whether you're buying your first bike or coming in for a service, we’re committed to delivering quality, transparency, and trust every step of the way.
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-xl p-8">
            <h2 className="text-2xl font-semibold text-blue-800 mb-4">Get in Touch</h2>
            <p className="text-gray-700 mb-4">
              Have questions or need assistance? Our team is here to help you make the right choice and keep your bike running smoothly.
            </p>
            <a
              href="/contact"
              className="inline-block bg-blue-800 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition font-semibold"
            >
              Contact Us
            </a>
          </div>
        </div>
      </main>
      <CustomerFooter />
    </div>
  );
}

export default CustomerAboutUs;
