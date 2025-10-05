import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function SparePartsDisplay() {
  const [spareParts, setSpareParts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
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

  // Pagination logic
  const indexOfLastPart = currentPage * partsPerPage;
  const indexOfFirstPart = indexOfLastPart - partsPerPage;
  const currentParts = spareParts.slice(indexOfFirstPart, indexOfLastPart);
  const totalPages = Math.ceil(spareParts.length / partsPerPage);

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
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-bold text-blue-900">
            Spare Parts Inventory
          </h1>
          <Link to="/SparePartsForm">
            <button className="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white text-blue-700 font-semibold py-2 px-6 hover:bg-blue-50 transition shadow-sm">
              + Add New
            </button>
          </Link>
        </div>

        {/* Results Count */}
        <div className="mb-4 text-sm text-gray-600">
          Showing {spareParts.length} parts
        </div>

        {/* Table */}
        <div className="overflow-x-auto bg-white shadow-lg rounded-2xl p-6 border border-gray-100">
          <table className="w-full border-collapse">
            <thead>
              <tr className="text-left text-blue-900 border-b border-gray-200 bg-gray-50">
                <th className="py-3 px-4 rounded-tl-xl font-semibold">Barcode</th>
                <th className="py-3 px-4 font-semibold">Name</th>
                <th className="py-3 px-4 font-semibold">Brand</th>
                <th className="py-3 px-4 font-semibold">Rack</th>
                <th className="py-3 px-4 font-semibold">Quantity</th>
                <th className="py-3 px-4 font-semibold">Price (Rs.)</th>
                <th className="py-3 px-4 rounded-tr-xl text-center font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {currentParts.length > 0 ? (
                currentParts.map((part) => (
                  <tr
                    key={part._id}
                    className="border-b border-gray-100 hover:bg-blue-50 transition-colors"
                  >
                    <td className="py-3 px-4">{part.barcode}</td>
                    <td className="py-3 px-4">{part.name}</td>
                    <td className="py-3 px-4 font-medium">{part.brand}</td>
                    <td className="py-3 px-4">{part.rack}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          part.Quentity < 10
                            ? "bg-red-100 text-red-800"
                            : part.Quentity < 20
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {part.Quentity}
                      </span>
                    </td>
                    <td className="py-3 px-4">Rs. {part.price}</td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() =>
                          navigate(`/SparePartsViewForm/${part._id}`)
                        }
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition shadow-sm"
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
              className="px-3 py-1 rounded-md border border-gray-200 bg-white text-blue-700 hover:bg-blue-50 disabled:opacity-50"
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
                    : "border border-gray-200 bg-white text-blue-700 hover:bg-blue-50"
                }`}
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
    </div>
  );
}

export default SparePartsDisplay;
