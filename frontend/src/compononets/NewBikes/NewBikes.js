import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function NewBikes() {
  const [bikes, setBikes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBikes();
  }, []);

  const fetchBikes = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/newBs");
      setBikes(res.data.newBs);
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
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-blue-900">Vehicle Overview</h1>
          <Link
            to="/NewBikesForm"
            className="bg-blue-800 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition font-semibold"
          >
            Add New Bike
          </Link>
        </div>

        {bikes.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-2xl text-gray-600 mb-4">No bikes found</div>
            <Link
              to="/NewBikesForm"
              className="bg-blue-800 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition font-semibold"
            >
              Add Your First Bike
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {bikes.map((bike) => (
              <div
                key={bike._id}
                className="bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all hover:scale-105 p-6"
              >
                <div className="mb-4">
                  {bike.image ? (
                    <img
                      src={`http://localhost:5000${bike.image}`}
                      alt={bike.model}
                      className="w-full h-65 object-cover rounded-2xl"
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.nextSibling.style.display = "flex";
                      }}
                    />
                  ) : null}
                  <div
                    className={`w-full h-65 bg-gray-200 flex items-center justify-center rounded-2xl ${
                      bike.image ? "hidden" : ""
                    }`}
                  >
                    <span className="text-gray-500 text-lg">No Image</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h2 className="text-xl font-bold text-gray-800">
                    {bike.model}
                  </h2>
                  <div className="text-gray-600">
                    <p>
                      <span className="font-semibold">Type:</span> {bike.type}
                    </p>
                    <p>
                      <span className="font-semibold">Chassi No:</span> {bike.chassi_no}
                    </p>
                    <p>
                      <span className="font-semibold">Color:</span> {bike.color}
                    </p>
                    <p>
                      <span className="font-semibold">Quantity:</span> {bike.quantity}
                    </p>
                    <p>
                      <span className="font-semibold">Price:</span> Rs.{" "}
                      {bike.price}
                    </p>
                    <p>
                      <span className="font-semibold">Offers:</span> {bike.offers}
                    </p>
                  </div>
                  <div
                    className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                      bike.status === "Available"
                        ? "bg-green-100 text-green-800"
                        : bike.status === "Sold"
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {bike.status}
                  </div>
                </div>

                <div className="flex gap-2 mt-4">
                  <Link
                    to={`/UpdateNewBike/${bike._id}`}
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-xl hover:bg-blue-500 transition text-center font-semibold"
                  >
                    Edit
                  </Link>

                  <button
                    onClick={() => handleDelete(bike._id)}
                    className="flex-1 bg-red-600 text-white py-2 px-4 rounded-xl hover:bg-red-500 transition font-semibold"
                  >
                    Delete
                    
                  </button>

                   <Link
                    to={`/BikesSalesHisForm/${bike._id}`}
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-xl hover:bg-blue-500 transition text-center font-semibold"
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
