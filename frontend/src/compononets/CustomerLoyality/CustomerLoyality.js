// CustomerLoyality.js
import React, { useState } from "react";

function CustomerLoyality() {
  const [customers, setCustomers] = useState([
  ]);

  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updatedPoints, setUpdatedPoints] = useState(0);

  const handleUpdateClick = (cust) => {
    setSelectedCustomer(cust);
    setUpdatedPoints(cust.points);
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (selectedCustomer && updatedPoints !== null) {
      setCustomers(prevCustomers => 
        prevCustomers.map(cust => 
          cust.id === selectedCustomer.id 
            ? { ...cust, points: parseInt(updatedPoints) }
            : cust
        )
      );
      setIsModalOpen(false);
      setSelectedCustomer(null);
      setUpdatedPoints(0);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setSelectedCustomer(null);
    setUpdatedPoints(0);
  };

  const closeModal = (e) => {
    if (e.target === e.currentTarget) {
      handleCancel();
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen relative">
      <h1 className="text-2xl font-bold mb-6 text-blue-900">Customer Loyalty Records</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow-lg overflow-hidden">
          <thead className="bg-blue-800 text-white">
            <tr>
              <th className="py-3 px-4 text-left">Customer ID</th>
              <th className="py-3 px-4 text-left">Customer Name</th>
              <th className="py-3 px-4 text-left">Interaction</th>
              <th className="py-3 px-4 text-left">Interaction Date</th>
              <th className="py-3 px-4 text-left">Loyalty Point Score</th>
              <th className="py-3 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((cust, index) => (
              <tr key={cust.id} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                <td className="py-3 px-4">{cust.id}</td>
                <td className="py-3 px-4">{cust.name}</td>
                <td className="py-3 px-4">{cust.interaction}</td>
                <td className="py-3 px-4">{cust.date}</td>
                <td className="py-3 px-4 font-semibold text-blue-700">{cust.points}</td>
                <td className="py-3 px-4">
                  <button
                    className="bg-yellow-500 text-white px-4 py-1 rounded hover:bg-yellow-600 transition"
                    onClick={() => handleUpdateClick(cust)}
                  >
                    Update
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Overlay */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn"
          onClick={closeModal}
        >
          {/* Modal Content */}
          <div className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-md mx-4 animate-slideIn">
            <h2 className="text-xl font-bold mb-4 text-blue-900">Update Loyalty Points</h2>
            
            {selectedCustomer && (
              <div className="space-y-4">
                <div className="p-3 bg-gray-50 rounded">
                  <p className="text-sm text-gray-600">Customer ID</p>
                  <p className="font-semibold">{selectedCustomer.id}</p>
                </div>
                
                <div className="p-3 bg-gray-50 rounded">
                  <p className="text-sm text-gray-600">Customer Name</p>
                  <p className="font-semibold">{selectedCustomer.name}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Loyalty Points
                  </label>
                  <input
                    type="number"
                    value={updatedPoints}
                    onChange={(e) => setUpdatedPoints(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="0"
                  />
                </div>
                
                <div className="flex justify-end gap-3 pt-4">
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Save
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}


    </div>
  );
}

export default CustomerLoyality;
