// UpdateLoyalityPoints.js
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function UpdateLoyalityPoints() {
  const location = useLocation();
  const navigate = useNavigate();
  const customer = location.state?.customer;

  const [points, setPoints] = useState(customer?.points || 0);

  const handleSave = () => {
    // Here you would normally call your API to update points
    alert(`Updated ${customer.name}'s points to ${points}`);
    navigate("/CustomerLoyality"); // Go back to the table
  };

  if (!customer) {
    return <div className="p-6 text-red-600">No customer selected</div>;
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-blue-900">Update Loyalty Points</h1>
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <p className="mb-4">Customer: <span className="font-semibold">{customer.name}</span></p>
        <label className="block mb-2 font-medium">Loyalty Points</label>
        <input
          type="number"
          value={points}
          onChange={(e) => setPoints(e.target.value)}
          className="w-full border rounded px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="flex justify-end gap-3">
          <button
            onClick={() => navigate("/CustomerLoyality")}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default UpdateLoyalityPoints;
