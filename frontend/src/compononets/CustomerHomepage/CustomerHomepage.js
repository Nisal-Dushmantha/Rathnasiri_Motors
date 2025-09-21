import React from 'react';
import CustomerNavBar from '../CustomerNavBar/CustomerNavBar';
import CustomerFooter from '../CustomerFooter/CustomerFooter';

function CustomerHomepage() {
  return (
    <div className="bg-gradient-to-b from-blue-50 to-white min-h-screen">
      <CustomerNavBar />

      {/* Hero Section */}
      <section className="bg-white shadow-md py-16 px-6 md:px-12 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-blue-800 mb-4">
          Welcome to Rathnasiri Motors
        </h1>
        <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto mb-6">
          Your trusted partner for all things automotive—sales, repairs, servicing, spare parts, insurance, and loyalty programs.
        </p>
        <p className="text-md text-gray-600">Proudly serving Colombo, Sri Lanka for over 20 years.</p>
      </section>

      {/* Features Grid */}
      <section className="max-w-6xl mx-auto px-6 md:px-12 py-16">
        <h2 className="text-3xl font-bold text-blue-700 mb-10 text-center">
          What We Offer
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { icon: '🏍️', title: 'Bikes', desc: 'Browse new and used bikes, view details, and track your purchases.' },
            { icon: '⚙️', title: 'Spare Parts', desc: 'Order genuine spare parts and accessories for your vehicle.' },
            { icon: '📅', title: 'Service Dates', desc: 'Book and manage your service appointments with ease.' },
            { icon: '🛠️', title: 'Repairs', desc: 'Track repair jobs, view job cards, and download service documents.' },
            { icon: '💼', title: 'Insurance & Registration', desc: 'Manage your vehicle insurance and registration details.' },
            { icon: '🎁', title: 'Customer Loyalty', desc: 'Earn rewards and benefits through our loyalty program.' },
          ].map((feature, index) => (
            <div
              key={index}
              className="bg-white border-l-4 border-blue-500 rounded-xl shadow-md p-6 hover:shadow-xl transition duration-300"
            >
              <h3 className="text-xl font-bold text-blue-700 mb-2 flex items-center">
                <span className="mr-2 text-2xl">{feature.icon}</span>
                {feature.title}
              </h3>
              <p className="text-gray-700">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>
      <CustomerFooter />
    </div>
  );
}

export default CustomerHomepage;
