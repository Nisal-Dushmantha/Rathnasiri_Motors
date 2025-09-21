import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { FaSearch } from "react-icons/fa";

function SparePartsDisplay() {
  const [spareParts, setSpareParts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const partsPerPage = 10;

  const navigate = useNavigate();

  // Fetch spare parts
  useEffect(() => {
    const fetchSpareParts = async () => {
      try {
        const res = await axios.get("http://localhost:5000/sp");
        setSpareParts(res.data.sp);
      } catch (err) {
        console.error("Error fetching spare parts:", err);
        alert("Failed to fetch spare parts!");
      } finally {
        setLoading(false);
      }
    };

    fetchSpareParts();
  }, []);

  // Get unique brands for dropdown
  const brands = [...new Set(spareParts.map(part => part.brand))].sort();

  // Filter spare parts by search term and brand
  const filteredParts = spareParts.filter((part) => {
    const matchesSearch = part.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBrand = selectedBrand === "" || part.brand === selectedBrand;
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
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-lg font-semibold">
        Loading spare parts...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-bold text-blue-900">
            Spare Parts Inventory
          </h1>
          <Link to="/SparePartsForm">
            <button className="bg-blue-800 text-white font-semibold py-2 px-6 rounded-xl hover:bg-blue-700 transition">
              + Add New
            </button>
          </Link>
        </div>

        {/* Search and Filter Section */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
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
              className="w-full pl-10 pr-4 py-2 border border-blue-200 bg-white rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
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
              className="w-full p-2 border border-blue-200 bg-white rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
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
        <div className="mb-4 text-sm text-gray-600">
          Showing {filteredParts.length} of {spareParts.length} parts
          {selectedBrand && ` for brand: ${selectedBrand}`}
        </div>

        {/* Table */}
        <div className="overflow-x-auto bg-white shadow-xl rounded-2xl p-6">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-blue-600 text-white text-left">
                <th className="py-3 px-4 rounded-tl-xl">Barcode</th>
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Brand</th>
                <th className="py-3 px-4">Rack</th>
                <th className="py-3 px-4">Quantity</th>
                <th className="py-3 px-4">Price (Rs.)</th>
                <th className="py-3 px-4 rounded-tr-xl text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {currentParts.length > 0 ? (
                currentParts.map((part) => (
                  <tr
                    key={part._id}
                    className="border-b hover:bg-blue-50 transition-colors"
                  >
                    <td className="py-3 px-4">{part.barcode}</td>
                    <td className="py-3 px-4">{part.name}</td>
                    <td className="py-3 px-4 font-medium">{part.brand}</td>
                    <td className="py-3 px-4">{part.rack}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        part.Quentity < 10 
                          ? "bg-red-100 text-red-800" 
                          : part.Quentity < 20 
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-800"
                      }`}>
                        {part.Quentity}
                      </span>
                    </td>
                    <td className="py-3 px-4">Rs. {part.price}</td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() =>
                          navigate(`/SparePartsViewForm/${part._id}`)
                        }
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="7"
                    className="text-center py-6 text-gray-500 italic"
                  >
                    No spare parts found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-6 space-x-2">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded-md text-gray-700 hover:bg-gray-200 disabled:opacity-50"
            >
              &lt; Previous
            </button>

            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => goToPage(i + 1)}
                className={`px-3 py-1 rounded-md ${
                  currentPage === i + 1
                    ? "bg-blue-600 text-white"
                    : "text-gray-700 hover:bg-gray-200"
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded-md text-gray-700 hover:bg-gray-200 disabled:opacity-50"
            >
              Next &gt;
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default SparePartsDisplay;