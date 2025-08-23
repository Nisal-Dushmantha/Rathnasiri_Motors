import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function AllBikes() {
  const [bikes, setBikes] = useState([]);

  useEffect(() => {
    fetchBikes();
  }, []);

  const fetchBikes = async () => {
    try {
      const res = await axios.get("http://localhost:5000/newBs");
      setBikes(res.data.newBs);
    } catch (err) {
      console.error("Error fetching bikes:", err);
      alert("Failed to load bikes");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center mb-8 text-blue-900">All Bikes</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {bikes.map((bike) => (
          <div
            key={bike._id}
            className="bg-white shadow-lg rounded-2xl p-5 flex flex-col items-center"
          >
            {bike.imageFilename ? (
              <img
                src={`http://localhost:5000/uploads/${bike.imageFilename}`}
                alt={bike.model}
                className="w-full h-48 object-cover rounded-xl mb-4"
              />
            ) : (
              <div className="w-full h-48 bg-gray-200 flex items-center justify-center rounded-xl mb-4">
                <span className="text-gray-500">No Image</span>
              </div>
            )}
            <h2 className="text-xl font-semibold text-gray-800">{bike.model}</h2>
            <p className="text-gray-600">Type: {bike.type}</p>
            <p className="text-gray-600">Color: {bike.color}</p>
            <p className="text-gray-600">Price: {bike.price}</p>
            <p className={`font-medium mt-2 ${bike.status === "Sold" ? "text-red-600" : "text-green-600"}`}>
              Status: {bike.status}
            </p>

            <div className="flex gap-3 mt-4">
              <Link
                to={`/edit-bike/${bike._id}`}
                className="px-3 py-1 bg-yellow-500 text-white rounded-lg hover:bg-yellow-400"
              >
                Edit
              </Link>
              <Link
                to={`/delete-bike/${bike._id}`}
                className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-500"
              >
                Delete
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AllBikes;
