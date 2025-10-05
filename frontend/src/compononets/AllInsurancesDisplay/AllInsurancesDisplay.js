import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import InsuranceDocument from "../InsuranceDocument/InsuranceDocument";
import { Edit, Trash2, Printer } from "lucide-react";

function InsuranceDetailModal({ user, onClose, refresh }) {
  const [showDocument, setShowDocument] = useState(false);

  const deleteHandler = async () => {
    if (!window.confirm("Are you sure you want to delete this insurance?")) return;
    await axios.delete(`http://localhost:5000/insurances/${user._id}`);
    alert("Insurance Deleted!");
    refresh();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white shadow-2xl rounded-2xl p-6 w-full max-w-5xl max-h-[90vh] overflow-auto relative flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 font-bold text-2xl"
        >
          ✕
        </button>

        {/* Insurance Full Details */}
        <div className="flex flex-col gap-6">
          <h2 className="text-2xl font-bold text-gray-800">{user.fullname}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DetailRow label="Contact No" value={user.ContactNo} />
            <DetailRow label="Address" value={user.Address} />
            <DetailRow label="Vehicle No" value={user.RegistrationNo} />
            <DetailRow label="Vehicle Type" value={user.VehicleType} />
            <DetailRow label="Vehicle Model" value={user.VehicleModel} />
            <DetailRow label="Engine No" value={user.EngineNo} />
            <DetailRow label="Chassis No" value={user.ChassisNo} />
            <DetailRow label="Start Date" value={user.StartDate} />
            <DetailRow label="End Date" value={user.EndDate} />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 mt-4">
            <Link to={`/UpdateInsurances/${user._id}`}>
              <button className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                <Edit size={16} /> Update
              </button>
            </Link>
            <button
              onClick={deleteHandler}
              className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
            >
              <Trash2 size={16} /> Delete
            </button>
            <button
              onClick={() => setShowDocument(true)}
              className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
            >
              <Printer size={16} /> Print
            </button>
          </div>
        </div>

        {/* PDF Preview Modal */}
        {showDocument && (
          <InsuranceDocument
            user={user}
            onClose={() => setShowDocument(false)}
          />
        )}
      </div>
    </div>
  );
}

const DetailRow = ({ label, value }) => (
  <div className="flex justify-between bg-gray-50 p-3 rounded-lg border border-gray-200">
    <span className="font-semibold text-gray-700">{label}</span>
    <span className="text-gray-800">{value || "N/A"}</span>
  </div>
);

export default InsuranceDetailModal;
