import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import RepairDocument from "../RepairDocument/RepairDocument";

function AllRepairJobsDisplay({ user, setRepairs, onDelete }) {
  const [showDoc, setShowDoc] = React.useState(false);
  
  if (!user) return null;

  const { _id, Name, Phone, VehicleNumber, VehicleType, Model, Details, JobCreatedDate } = user;

  const deleteHandler = async () => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete the repair job for ${Name}?`
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:5000/repairs/${_id}`);
      alert("Repair Job deleted successfully!");
      if (onDelete) {
        onDelete(_id); // Use the provided onDelete callback
      } else if (setRepairs) {
        setRepairs((prevJobs) => prevJobs.filter((job) => job._id !== _id)); // Fallback to legacy method
      }
    } catch (err) {
      console.error("Error deleting job:", err);
      alert("Failed to delete the job. Please try again.");
    }
  };

  return (
    <div className="bg-white p-7 rounded-2xl shadow-md hover:shadow-lg transition">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold text-blue-900">{Name}</h2>
          <p className="text-sm text-gray-600">Phone: {Phone}</p>
        </div>
        <span className="inline-block bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold border border-blue-200">ID: {_id}</span>
      </div>

      {/* Details grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="bg-gray-50 p-3 rounded-xl border">
          <p className="text-xs text-gray-500">Vehicle</p>
          <p className="font-semibold text-gray-800">{VehicleType} ({Model})</p>
        </div>
        <div className="bg-gray-50 p-3 rounded-xl border">
          <p className="text-xs text-gray-500">Vehicle No</p>
          <p className="font-semibold text-gray-800">{VehicleNumber}</p>
        </div>
        <div className="bg-gray-50 p-3 rounded-xl border">
          <p className="text-xs text-gray-500">Job Created On</p>
          <p className="font-semibold text-gray-800">{JobCreatedDate ? new Date(JobCreatedDate).toLocaleDateString() : "Not Available"}</p>
        </div>
      </div>

      {/* Details */}
      <div className="mb-4">
        <p className="text-xs text-gray-500 mb-1">Repair Details</p>
        <div className="bg-white border rounded-xl p-4">
          <p className="text-gray-700">{Details}</p>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-4 flex flex-col md:flex-row gap-3">
        <Link to={`/AllRepairJobs/${_id}`} className="md:flex-1">
          <button className="w-full bg-green-600 text-white px-5 py-2.5 rounded-xl hover:bg-green-700 transition">
            Update Job
          </button>
        </Link>
        <button
          onClick={deleteHandler}
          className="md:flex-1 w-full bg-red-600 text-white px-5 py-2.5 rounded-xl hover:bg-red-700 transition"
        >
          Delete Job
        </button>
        <button
          onClick={() => setShowDoc(true)}
          className="md:flex-1 w-full bg-blue-700 text-white px-5 py-2.5 rounded-xl hover:bg-blue-800 transition"
        >
          Print Job Card
        </button>
      </div>

      {/* Popup */}
      {showDoc && <RepairDocument id={_id} onClose={() => setShowDoc(false)} />}
    </div>
  );
}

export default AllRepairJobsDisplay;
