// AllRepairJobsDisplay.js
import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function AllRepairJobsDisplay({ user, setRepairs }) {
  if (!user) return null;

  const { _id, Name, Phone, VehicleNumber, VehicleType, Model, Details } = user;

  const deleteHandler = async () => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete the repair job for ${Name}?`
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:5000/repairs/${_id}`);
      alert("Repair Job deleted successfully!");

      // ✅ Update state immediately (remove deleted job)
      setRepairs((prevJobs) => prevJobs.filter((job) => job._id !== _id));
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
      <p><strong>Details:</strong> {Details}</p>

      <Link to={`/AllRepairJobs/${_id}`}>
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
    </div>
  );
}

export default AllRepairJobsDisplay;
