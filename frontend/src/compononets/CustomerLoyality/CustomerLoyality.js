// CustomerLoyality.js
import React, { useEffect, useState } from "react";
import axios from "axios";

function CustomerLoyality() {
  const [customers, setCustomers] = useState([]);
  const [query, setQuery] = useState("");

  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editForm, setEditForm] = useState(null);

  const [formData, setFormData] = useState({
    customerId: "",
    name: "",
    interaction: "",
    date: "",
    points: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:5000/loyalty");
        setCustomers(res.data || []);
      } catch (err) {
        console.error("Failed to load loyalty records", err);
      }
    };
    fetchData();
  }, []);

  const normalized = (val) => (val ?? "").toString().toLowerCase();
  const filteredCustomers = customers.filter((c) => {
    if (!query) return true;
    const q = query.toLowerCase();
    return (
      normalized(c.customerId).includes(q) ||
      normalized(c.name).includes(q) ||
      normalized(c.interaction).includes(q) ||
      normalized(c.points).includes(q) ||
      normalized(c.date && new Date(c.date).toLocaleDateString()).includes(q)
    );
  });

  const formatDateInput = (value) => {
    if (!value) return "";
    const d = new Date(value);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  const handleUpdateClick = (cust) => {
    setSelectedCustomer(cust);
    setEditForm({
      customerId: cust.customerId || "",
      name: cust.name || "",
      interaction: cust.interaction || "",
      date: formatDateInput(cust.date),
      points: Number(cust.points) || 0,
    });
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (selectedCustomer && editForm) {
      try {
        const payload = {
          customerId: editForm.customerId,
          name: editForm.name,
          interaction: editForm.interaction,
          date: editForm.date ? new Date(editForm.date) : new Date(),
          points: parseInt(editForm.points),
        };
        const res = await axios.put(
          `http://localhost:5000/loyalty/${selectedCustomer._id}`,
          payload
        );
        const updated = res.data;
        setCustomers((prevCustomers) =>
          prevCustomers.map((cust) => (cust._id === updated._id ? updated : cust))
        );
      } catch (err) {
        console.error("Failed to update record", err);
      } finally {
        setIsModalOpen(false);
        setSelectedCustomer(null);
        setEditForm(null);
      }
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setSelectedCustomer(null);
  };

  const closeModal = (e) => {
    if (e.target === e.currentTarget) {
      handleCancel();
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: name === "points" ? Number(value) : value }));
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: name === "points" ? Number(value) : value }));
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        date: formData.date ? new Date(formData.date) : new Date(),
      };
      const res = await axios.post("http://localhost:5000/loyalty", payload);
      setCustomers((prev) => [res.data, ...prev]);
      setFormData({ customerId: "", name: "", interaction: "", date: "", points: 0 });
    } catch (err) {
      console.error("Failed to add loyalty record", err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this loyalty record?")) {
      try {
        await axios.delete(`http://localhost:5000/loyalty/${id}`);
        setCustomers((prev) => prev.filter((cust) => cust._id !== id));
      } catch (err) {
        console.error("Failed to delete loyalty record", err);
      }
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen relative">
      <h1 className="text-2xl font-bold mb-6 text-blue-900">Customer Loyalty Records</h1>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by any detail..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full md:w-1/2 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
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
            {filteredCustomers.map((cust, index) => (
              <tr key={cust._id} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                <td className="py-3 px-4">{cust.customerId}</td>
                <td className="py-3 px-4">{cust.name}</td>
                <td className="py-3 px-4">{cust.interaction}</td>
                <td className="py-3 px-4">{cust.date ? new Date(cust.date).toLocaleDateString() : ""}</td>
                <td className="py-3 px-4 font-semibold text-blue-700">{cust.points}</td>
                <td className="py-3 px-4">
                  <div className="flex gap-2">
                    <button
                      className="bg-yellow-500 text-white px-4 py-1 rounded hover:bg-yellow-600 transition"
                      onClick={() => handleUpdateClick(cust)}
                    >
                      Update
                    </button>
                    <button
                      className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600 transition"
                      onClick={() => handleDelete(cust._id)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold mb-4 text-blue-900">Add Loyalty Record</h2>
        <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleAdd}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Customer ID</label>
            <input
              name="customerId"
              value={formData.customerId}
              onChange={handleFormChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Customer Name</label>
            <input
              name="name"
              value={formData.name}
              onChange={handleFormChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Interaction</label>
            <input
              name="interaction"
              value={formData.interaction}
              onChange={handleFormChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Interaction Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleFormChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Loyalty Points</label>
            <input
              type="number"
              name="points"
              min="0"
              value={formData.points}
              onChange={handleFormChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          <div className="md:col-span-2 flex justify-end">
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
              Add Record
            </button>
          </div>
        </form>
      </div>

      {/* Modal Overlay */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn"
          onClick={closeModal}
        >
          {/* Modal Content */}
          <div className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-md mx-4 animate-slideIn">
            <h2 className="text-xl font-bold mb-4 text-blue-900">Update Loyalty Record</h2>

            {selectedCustomer && editForm && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Customer ID</label>
                  <input
                    name="customerId"
                    value={editForm.customerId}
                    onChange={handleEditChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Customer Name</label>
                  <input
                    name="name"
                    value={editForm.name}
                    onChange={handleEditChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Interaction</label>
                  <input
                    name="interaction"
                    value={editForm.interaction}
                    onChange={handleEditChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Interaction Date</label>
                  <input
                    type="date"
                    name="date"
                    value={editForm.date}
                    onChange={handleEditChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Loyalty Points</label>
                  <input
                    type="number"
                    name="points"
                    min="0"
                    value={editForm.points}
                    onChange={handleEditChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
