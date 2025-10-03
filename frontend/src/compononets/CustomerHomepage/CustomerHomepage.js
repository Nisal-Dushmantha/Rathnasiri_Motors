import React from 'react';
import CustomerNavBar from '../CustomerNavBar/CustomerNavBar';
import CustomerFooter from '../CustomerFooter/CustomerFooter';

function CustomerHomepage() {
  return (
    <div className="bg-gradient-to-b from-blue-50 to-white min-h-screen">
      {/* Top announcement bar */}
      <div className="bg-gray-100 py-2 text-center text-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <div className="hidden md:block">Island-wide service • Quality repairs guaranteed</div>
          <div className="mx-auto md:mr-0">
            <a href="tel:+94760195368" className="text-blue-600 hover:underline flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
              +94 76 019 5368
            </a>
          </div>
        </div>
      </div>
      
      <CustomerNavBar />

      {/* Hero Section - Blue Gradient Background with Content */}
      <section className="bg-gradient-to-r from-blue-900 to-blue-700 py-20 px-6 md:px-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-center bg-cover opacity-20" style={{ 
          backgroundImage: "url('/rathnasiri-logo.jpeg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundBlendMode: "overlay"
        }}></div>
        
        <div className="relative z-10 max-w-6xl mx-auto flex flex-col md:flex-row items-center">
          {/* Hero Text Content */}
          <div className="w-full md:w-1/2 text-left mb-10 md:mb-0">
            <div className="inline-block bg-blue-800/60 rounded-full px-4 py-1 text-blue-100 text-sm font-semibold mb-4">
              <span className="mr-1">⭐</span> Sri Lanka's #1 Motorcycle Service Center
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight">
              Your <span className="text-blue-200">Dream</span><br />
              <span className="text-blue-300">Motorcycle</span>
            </h1>
            <p className="text-lg text-blue-100 mb-8 max-w-md">
              Experience excellence in motorcycle service, repairs, and genuine parts. 
              We bring expert craftsmanship right to your doorstep.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="/CustomerSpareParts" className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition duration-300 flex items-center">
                <span>Shop Products</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="/CustomerServiceDates" className="bg-transparent hover:bg-blue-800 text-white border border-blue-400 px-6 py-3 rounded-xl font-medium transition duration-300 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
                <span>Book Service</span>
              </a>
            </div>
          </div>
          
          {/* We'll leave space for an image or decorative element on the right side */}
          <div className="w-full md:w-1/2 flex justify-end">
            {/* This space could contain a motorcycle image if available */}
          </div>
        </div>
      </section>

      {/* Features Grid - Services & Products */}
      <section className="max-w-6xl mx-auto px-6 md:px-12 py-16">
        <h2 className="text-3xl font-bold text-blue-800 mb-4 text-center">
          Our Services & Products
        </h2>
        <p className="text-gray-600 text-center mb-10 max-w-2xl mx-auto">
          Comprehensive motorcycle solutions all in one place, from brand new bikes to repairs and maintenance.
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { 
              icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>, 
              title: 'Brand New Bikes', 
              desc: 'Explore our selection of the latest motorcycle models with manufacturer warranty.'
            },
            { 
              icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>, 
              title: 'Used Bikes', 
              desc: 'Quality pre-owned motorcycles, thoroughly inspected and certified for reliability.'
            },
            { 
              icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>, 
              title: 'Spare Parts', 
              desc: 'Genuine parts and accessories to keep your motorcycle running at peak performance.'
            },
            { 
              icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>, 
              title: 'Service Appointments', 
              desc: 'Schedule maintenance and tune-ups with our certified technicians online.'
            },
            { 
              icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>, 
              title: 'Repairs & Diagnostics', 
              desc: 'Expert repair services with comprehensive diagnostics and quality workmanship.'
            },
            { 
              icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>, 
              title: 'Insurance & Loyalty', 
              desc: 'Comprehensive insurance options and exclusive benefits for loyal customers.'
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition duration-300 border border-gray-100"
            >
              <div className="bg-blue-50 p-3 rounded-lg inline-block mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>
      <CustomerFooter />
    </div>
  );
}

export default CustomerHomepage;
