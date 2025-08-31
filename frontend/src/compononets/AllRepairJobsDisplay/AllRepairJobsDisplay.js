// AllRepairJobsDisplay.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import RepairDocument from "../RepairDocument/RepairDocument";

function AllRepairJobsDisplay({ user, setRepairs }) {
  const [showDoc, setShowDoc] = useState(false);
  const navigate = useNavigate();

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
      setRepairs((prevJobs) => prevJobs.filter((job) => job._id !== _id));
    } catch (err) {
      console.error("Error deleting job:", err);
      alert("Failed to delete the job. Please try again.");
    }
  };

  const updateHandler = () => {
    navigate(`/AllRepairJobs/${_id}`);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition">
      <h2 className="text-xl font-bold text-blue-700 mb-2">{Name}</h2>
      <p>
        <strong>Job ID:</strong> {_id}
      </p>
      <p>
        <strong>Phone:</strong> {Phone}
      </p>
      <p>
        <strong>Vehicle:</strong> {VehicleType} ({Model})
      </p>
      <p>
        <strong>Vehicle No:</strong> {VehicleNumber}
      </p>
      <p>
        <strong>Details:</strong> {Details}
      </p>

      {/* Update & Delete */}
      <div className="mt-4 flex gap-2">
        <button
          onClick={updateHandler}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Update Job
        </button>
        <button
          onClick={deleteHandler}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
        >
          Delete Job
        </button>
      </div>

      {/* Print Job Card */}
      <button
        onClick={() => setShowDoc(true)}
        className="mt-3 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition"
      >
        Print Job Card
      </button>

      {/* Popup */}
      {showDoc && <RepairDocument id={_id} onClose={() => setShowDoc(false)} />}
    </div>
  );
}

export default AllRepairJobsDisplay;
