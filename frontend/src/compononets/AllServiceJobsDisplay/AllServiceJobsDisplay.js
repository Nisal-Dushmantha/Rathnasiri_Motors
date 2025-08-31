import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import ServiceDocument from "../ServiceDocument/ServiceDocument";

function AllServiceJobsDisplay({ user, onDelete }) {
  const [showDoc, setShowDoc] = React.useState(false);
  if (!user) return null;

  const {
    _id,
    Name,
    Phone,
    VehicleNumber,
    VehicleType,
    Model,
    KiloMeters,
    LastServiceDate,
    Requests,
  } = user;

  const deleteHandler = async () => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete the service job for ${Name}?`
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:5000/services/${_id}`);
      alert("Service Job deleted successfully!");
      onDelete(_id); // ✅ tell parent to update state
    } catch (err) {
      console.error("Error deleting job:", err);
      alert("Failed to delete the job. Please try again.");
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition">
      <h2 className="text-xl font-bold text-blue-700 mb-2">{Name}</h2>
      <p><strong>Job ID:</strong> {_id}</p>
      <p><strong>Phone:</strong> {Phone}</p>
      <p><strong>Vehicle:</strong> {VehicleType} ({Model})</p>
      <p><strong>Vehicle No:</strong> {VehicleNumber}</p>
      <p><strong>Kilometers:</strong> {KiloMeters}</p>
      <p><strong>Last Service Date:</strong> {LastServiceDate}</p>
      <p><strong>Requests:</strong> {Requests}</p>

      {/* Link to update page with ID */}
      <Link to={`/AllServiceJobs/${_id}`}>
        <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
          Update Job
        </button>
      </Link>

      <button
        onClick={deleteHandler}
        className="mt-2 ml-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
      >
        Delete Job
      </button>
      {/* Print Job Card */}
      <button
        onClick={() => setShowDoc(true)}
        className="mt-3 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition"
      >
        Print Job Card
      </button>

      {/* Popup */}
      {showDoc && <ServiceDocument id={_id} onClose={() => setShowDoc(false)} />}
    </div>
  );
}

export default AllServiceJobsDisplay;
