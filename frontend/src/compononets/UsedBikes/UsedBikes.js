import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function UsedBikes() {
  const [bikes, setBikes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [typeFilter, setTypeFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredBikes, setFilteredBikes] = useState([]);

  useEffect(() => {
    fetchBikes();
  }, []);

  useEffect(() => {
    setFilteredBikes(bikes);
  }, [bikes]);

  const fetchBikes = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/usedBs");
      if (res.status === 200 && Array.isArray(res.data.usedBs)) {
        setBikes(res.data.usedBs);
        setError(null);
      } else if (res.status === 404) {
        setBikes([]);
        setError(null); // Show 'No bikes found' instead of error
      } else {
        setError("Failed to load bikes");
      }
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setBikes([]);
        setError(null); // Show 'No bikes found' instead of error
      } else {
        console.error("Error fetching bikes:", err);
        setError("Failed to load bikes");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleTypeFilter = (type) => {
    setTypeFilter(type);
    if (type === "") {
      setFilteredBikes(
        bikes.filter((bike) => bike.model.toLowerCase().includes(searchTerm))
      );
    } else {
      setFilteredBikes(
        bikes.filter(
          (bike) =>
            bike.type === type &&
            bike.model.toLowerCase().includes(searchTerm)
        )
      );
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    setFilteredBikes(
      bikes.filter(
        (bike) =>
          (typeFilter === "" || bike.type === typeFilter) &&
          bike.model.toLowerCase().includes(value)
      )
    );
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this bike?")) {
      try {
        await axios.delete(`http://localhost:5000/usedBs/${id}`);
        alert("Bike deleted successfully!");
        fetchBikes(); // Refresh the list
      } catch (err) {
        console.error("Error deleting bike:", err);
        alert("Failed to delete bike");
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl font-semibold text-blue-900">
          Loading bikes...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-4xl font-bold text-blue-900">Used Bikes Overview</h1>
          <div className="flex items-center gap-4">
            {/* Filter Buttons */}
            <div className="flex gap-2">
              <button
                className={`px-4 py-2 rounded-lg font-semibold border transition-all duration-200 hover:bg-blue-100 focus:bg-blue-200 focus:outline-none ${
                  typeFilter === ""
                    ? "bg-blue-700 text-white border-blue-700"
                    : "bg-white text-blue-700 border-blue-700"
                }`}
                onClick={() => handleTypeFilter("")}
              >
                All
              </button>
              <button
                className={`px-4 py-2 rounded-lg font-semibold border transition-all duration-200 hover:bg-blue-100 focus:bg-blue-200 focus:outline-none ${
                  typeFilter === "Scooter"
                    ? "bg-blue-700 text-white border-blue-700"
                    : "bg-white text-blue-700 border-blue-700"
                }`}
                onClick={() => handleTypeFilter("Scooter")}
              >
                Scooter
              </button>
              <button
                className={`px-4 py-2 rounded-lg font-semibold border transition-all duration-200 hover:bg-blue-100 focus:bg-blue-200 focus:outline-none ${
                  typeFilter === "Motor Bike"
                    ? "bg-blue-700 text-white border-blue-700"
                    : "bg-white text-blue-700 border-blue-700"
                }`}
                onClick={() => handleTypeFilter("Motor Bike")}
              >
                Motor Bike
              </button>
            </div>
            {/* Search Bar */}
            <div className="relative w-80">
              <input
                type="text"
                placeholder="Search by bike model..."
                value={searchTerm}
                onChange={handleSearch}
                className="w-full pl-10 pr-4 py-2 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </div>
            <Link
              to="/UsedBikesForm"
              className="bg-blue-800 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition font-semibold"
            >
              Add Used Bike
            </Link>
          </div>
        </div>

        {bikes.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-2xl text-gray-600 mb-4">No bikes found</div>
            <Link
              to="/UsedBikesForm"
              className="bg-blue-800 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition font-semibold"
            >
              Add Your First Bike
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredBikes.map((bike) => (
              <div
                key={bike._id}
                className="bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all hover:scale-[1.03] p-6 border border-gray-100 relative group overflow-hidden"
              >
                <div className="mb-4 relative">
                  {bike.image ? (
                    <img
                      src={`http://localhost:5000${bike.image}`}
                      alt={bike.model}
                      className="w-full h-56 object-cover rounded-2xl group-hover:opacity-90 transition duration-300"
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.nextSibling.style.display = "flex";
                      }}
                    />
                  ) : null}
                  <div
                    className={`w-full h-56 bg-gray-200 flex items-center justify-center rounded-2xl absolute top-0 left-0 ${
                      bike.image ? "hidden" : ""
                    }`}
                  >
                    <span className="text-gray-500 text-lg">No Image</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <h2 className="text-xl font-extrabold text-gray-800 tracking-tight flex items-center gap-2">
                    {bike.model}
                  </h2>
                  <div className="text-gray-600 text-sm">
                    <p>
                      <span className="font-semibold">Type:</span> {bike.type}
                    </p>
                    <p>
                      <span className="font-semibold">Model:</span> {bike.model}
                    </p>
                    <p>
                      <span className="font-semibold">Color:</span> {bike.color}
                    </p>
                    <p>
                      <span className="font-semibold">Price:</span>{" "}
                      <span className="text-blue-700 font-bold">Rs. {bike.price}</span>
                    </p>
                    <p>
                      <span className="font-semibold">Mileage:</span> Km{" "}
                      {bike.mileage}
                    </p>
                    <p>
                      <span className="font-semibold">Year:</span> {bike.year}
                    </p>
                    <p>
                      <span className="font-semibold">Previous Owners:</span>{" "}
                      {bike.owner}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 mt-6">
                  <Link
                    to={`/UpdateUsedBike/${bike._id}`}
                    className="flex-1 bg-blue-600 text-white py-2 px-2 rounded-xl hover:bg-blue-500 transition text-center font-semibold"
                  >
                    Update
                  </Link>
                  <button
                    onClick={() => handleDelete(bike._id)}
                    className="flex-1 bg-red-600 text-white py-2 px-3 rounded-xl hover:bg-red-500 transition font-semibold"
                  >
                    Delete
                  </button>
                  <Link
                    to={{
                      pathname: `/BikesSalesHisForm/${bike._id}`,
                    }}
                    state={{ bike }}
                    className="flex-1 bg-green-500 text-white py-2 px-4 rounded-xl hover:bg-green-600 transition text-center font-semibold"
                  >
                    Sold
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default UsedBikes;
