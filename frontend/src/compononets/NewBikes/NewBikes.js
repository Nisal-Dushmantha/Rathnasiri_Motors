import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Search } from "lucide-react"; // ✅ Modern search icon

function NewBikes() {
  const [bikes, setBikes] = useState([]);
  const [filteredBikes, setFilteredBikes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState('');

  useEffect(() => {
    fetchBikes();
  }, []);

  const fetchBikes = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/newBs");
      setBikes(res.data.newBs);
      setFilteredBikes(res.data.newBs); // initially show all bikes
      setError(null);
    } catch (err) {
      console.error("Error fetching bikes:", err);
      setError("Failed to load bikes");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this bike?")) {
      try {
        await axios.delete(`http://localhost:5000/newBs/${id}`);
        alert("Bike deleted successfully!");
        fetchBikes(); // Refresh the list
      } catch (err) {
        console.error("Error deleting bike:", err);
        alert("Failed to delete bike");
      }
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    setFilteredBikes(
      bikes.filter((bike) => bike.model.toLowerCase().includes(value))
    );
  };

  const handleTypeFilter = (type) => {
    setTypeFilter(type);
    if (type === '') {
      setFilteredBikes(bikes.filter((bike) => bike.model.toLowerCase().includes(searchTerm)));
    } else {
      setFilteredBikes(
        bikes.filter(
          (bike) => bike.type === type && bike.model.toLowerCase().includes(searchTerm)
        )
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-100 to-blue-50 flex items-center justify-center">
        <div className="text-2xl font-semibold text-blue-900">
          Loading bikes...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-100 to-blue-50 flex items-center justify-center">
        <div className="text-xl text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-4xl font-bold text-blue-900">Vehicle Overview</h1>
          <div className="flex items-center gap-4">
            {/* Filter Buttons */}
            <div className="flex gap-2">
              <button
                className={`px-4 py-2 rounded-lg font-semibold border transition-all duration-200 hover:bg-blue-100 focus:bg-blue-200 focus:outline-none ${typeFilter === '' ? 'bg-blue-700 text-white border-blue-700' : 'bg-white text-blue-700 border-blue-700'}`}
                onClick={() => handleTypeFilter('')}
              >
                All
              </button>
              <button
                className={`px-4 py-2 rounded-lg font-semibold border transition-all duration-200 hover:bg-blue-100 focus:bg-blue-200 focus:outline-none ${typeFilter === 'Scooter' ? 'bg-blue-700 text-white border-blue-700' : 'bg-white text-blue-700 border-blue-700'}`}
                onClick={() => handleTypeFilter('Scooter')}
              >
                Scooter
              </button>
              <button
                className={`px-4 py-2 rounded-lg font-semibold border transition-all duration-200 hover:bg-blue-100 focus:bg-blue-200 focus:outline-none ${typeFilter === 'Motor Bike' ? 'bg-blue-700 text-white border-blue-700' : 'bg-white text-blue-700 border-blue-700'}`}
                onClick={() => handleTypeFilter('Motor Bike')}
              >
                Motor Bike
              </button>
            </div>

            {/* Search Bar on the Right */}
            <div className="relative w-80">
              <input
                type="text"
                placeholder="Search by bike model..."
                value={searchTerm}
                onChange={handleSearch}
                className="w-full pl-10 pr-4 py-2 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>
            <Link
              to="/NewBikesForm"
              className="bg-blue-800 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition font-semibold"
            >
              Add New Bike
            </Link>
          </div>
        </div>

        {/* Bike Cards */}
        {filteredBikes.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-2xl text-gray-600 mb-4">No bikes found</div>
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
                    className={`w-full h-56 bg-gray-200 flex items-center justify-center rounded-2xl absolute top-0 left-0 ${bike.image ? 'hidden' : ''}`}
                  >
                    <span className="text-gray-500 text-lg">No Image</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <h2 className="text-xl font-extrabold text-gray-800 tracking-tight flex items-center gap-2">
                    {bike.model}
                  </h2>
                  <div className="text-gray-600 text-sm">
                    <p><span className="font-semibold">Type:</span> {bike.type}</p>
                    <p><span className="font-semibold">Color:</span> {bike.color}</p>
                    <p><span className="font-semibold">Quantity:</span> {bike.quantity}</p>
                    <p><span className="font-semibold">Price:</span> <span className="text-blue-700 font-bold">Rs. {bike.price}</span></p>
                    <p><span className="font-semibold">Offers:</span> <span className="text-pink-600 font-semibold">{bike.offers}</span></p>
                  </div>
                </div>
                <div className="flex gap-2 mt-6">
                  <Link
                    to={`/UpdateNewBike/${bike._id}`}
                    className="flex-1 bg-blue-600 text-white py-2 px-2 rounded-xl hover:bg-blue-500 transition text-center font-semibold"
                  >
                    Update
                  </Link>
                  <button
                    onClick={() => handleDelete(bike._id)}
                    className="flex-1 bg-red-500 text-white py-2 px-3 rounded-xl hover:bg-red-500 transition font-semibold"
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

export default NewBikes;
