import React, { useState, useEffect } from 'react';
import CustomerNavBar from '../CustomerNavBar/CustomerNavBar';
import CustomerFooter from '../CustomerFooter/CustomerFooter';
import axios from 'axios';
import { FaSearch } from "react-icons/fa";

function CustomerSpareParts() {
  const [spareParts, setSpareParts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const partsPerPage = 12; // More items per page for customer view

  // Fetch spare parts on component mount
  useEffect(() => {
    const fetchSpareParts = async () => {
      try {
        setLoading(true);
        // Use the same endpoint as your main spare parts component
        const response = await axios.get('http://localhost:5000/sp');
        if (response.data && response.data.sp) {
          setSpareParts(response.data.sp);
        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching spare parts:', err);
        setError('Failed to load spare parts. Please try again later.');
        setLoading(false);
      }
    };

    fetchSpareParts();
  }, []);

  // Get unique brands for dropdown
  const brands = ['All', ...new Set(spareParts.map(part => part.brand || 'Other').filter(Boolean))].sort();

  // Filter spare parts based on search term and brand
  const filteredParts = spareParts.filter(part => {
    const matchesSearch = part.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBrand = selectedBrand === 'All' || selectedBrand === '' || part.brand === selectedBrand;
    return matchesSearch && matchesBrand;
  });
  
  // Pagination logic
  const indexOfLastPart = currentPage * partsPerPage;
  const indexOfFirstPart = indexOfLastPart - partsPerPage;
  const currentParts = filteredParts.slice(indexOfFirstPart, indexOfLastPart);
  const totalPages = Math.ceil(filteredParts.length / partsPerPage);

  const goToPage = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <CustomerNavBar />
      
      <main className="flex-grow py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-blue-900 mb-6">Spare Parts Catalog</h1>
          
          {/* Search and Filter */}
          <div className="mb-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              {/* Search Bar */}
              <div className="relative w-full md:w-1/2">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500" />
                <input
                  type="text"
                  placeholder="Search by part name..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 bg-white rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none"
                />
              </div>
              
              {/* Brand Filter Dropdown */}
              <div className="w-full md:w-1/4">
                <select
                  value={selectedBrand}
                  onChange={(e) => {
                    setSelectedBrand(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full px-4 py-3 border border-gray-200 bg-white rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none"
                >
                  <option value="">All Brands</option>
                  {brands.map((brand) => (
                    <option key={brand} value={brand}>
                      {brand}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            {/* Results Count */}
            <div className="mt-4 text-sm text-gray-600">
              Showing {filteredParts.length} parts
              {selectedBrand && selectedBrand !== 'All' && ` for brand: ${selectedBrand}`}
            </div>
          </div>
          
          {/* Loading, Error and No Results States */}
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
              <p className="text-red-700">{error}</p>
            </div>
          ) : filteredParts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No spare parts found matching your criteria.</p>
            </div>
          ) : (
            <div className="overflow-x-auto bg-white shadow-lg rounded-2xl p-6 border border-gray-100">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="text-left text-blue-900 border-b border-gray-200 bg-gray-50">
                    <th className="py-3 px-4 rounded-tl-xl font-semibold">Part Name</th>
                    <th className="py-3 px-4 font-semibold">Brand</th>
                    <th className="py-3 px-4 font-semibold">Description</th>
                    <th className="py-3 px-4 font-semibold">Price (Rs.)</th>
                    <th className="py-3 px-4 rounded-tr-xl font-semibold">Availability</th>
                  </tr>
                </thead>
                <tbody>
                  {currentParts.length > 0 ? (
                    currentParts.map((part) => (
                      <tr
                        key={part._id}
                        className="border-b border-gray-100 hover:bg-blue-50 transition-colors"
                      >
                        <td className="py-3 px-4 font-medium">{part.name}</td>
                        <td className="py-3 px-4">{part.brand || 'Generic'}</td>
                        <td className="py-3 px-4 max-w-xs truncate">{part.description || 'No description available'}</td>
                        <td className="py-3 px-4 font-semibold">Rs. {part.price}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            part.Quentity < 5 
                              ? "bg-red-100 text-red-800" 
                              : part.Quentity < 15 
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-green-100 text-green-800"
                          }`}>
                            {part.Quentity > 0 ? 'In Stock' : 'Out of Stock'}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="5"
                        className="text-center py-6 text-gray-500 italic"
                      >
                        No spare parts found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center mt-6 space-x-2">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded-md border border-gray-200 bg-white text-blue-700 hover:bg-blue-50 disabled:opacity-50"
              >
                &lt; Previous
              </button>

              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => goToPage(i + 1)}
                  className={`px-3 py-1 rounded-md ${currentPage === i + 1 ? 'bg-blue-600 text-white' : 'border border-gray-200 bg-white text-blue-700 hover:bg-blue-50'}`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 rounded-md border border-gray-200 bg-white text-blue-700 hover:bg-blue-50 disabled:opacity-50"
              >
                Next &gt;
              </button>
            </div>
          )}
        </div>
      </main>
      
      <CustomerFooter />
    </div>
  );
}

export default CustomerSpareParts;
