import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import InsuranceDocument from "../InsuranceDocument/InsuranceDocument";
import {
  Phone,
  MapPin,
  Car,
  Calendar,
  Hash,
  Trash2,
  Edit,
  Printer,
  User,
} from "lucide-react";

function AllInsurancesDisplay({ user }) {
  const {
    _id,
    fullname,
    Address,
    ContactNo,
    RegistrationNo,
    VehicleType,
    VehicleModel,
    EngineNo,
    ChassisNo,
    StartDate,
    EndDate,
  } = user;

  const navigate = useNavigate();
  const [showDocument, setShowDocument] = useState(false);

  const deleteHandler = async () => {
    if (!window.confirm("Are you sure you want to delete this insurance?")) return;
    await axios.delete(`http://localhost:5000/insurances/${_id}`);
    alert("Insurance Deleted!");
    navigate("/InsurancesAll");
  };

  const isActive =
    new Date(StartDate) <= new Date() && new Date(EndDate) >= new Date();

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 md:px-12">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">{fullname || "Unknown"}</h1>
            <p className="text-gray-500 mt-1 text-sm">Insurance ID: {_id}</p>
          </div>
          <span
            className={`px-4 py-2 rounded-full text-sm font-semibold ${
              isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
            }`}
          >
            {isActive ? "Active" : "Expired"}
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Personal Info */}
        <div className="bg-white shadow-lg rounded-2xl p-6 flex flex-col gap-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Owner Info</h2>
          <InfoRow icon={<User />} label="Full Name" value={fullname} />
          <InfoRow icon={<Phone />} label="Contact Number" value={ContactNo} />
          <InfoRow icon={<MapPin />} label="Address" value={Address} />
        </div>

        {/* Middle Column - Vehicle Info */}
        <div className="bg-white shadow-lg rounded-2xl p-6 flex flex-col gap-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Vehicle Info</h2>
          <InfoRow icon={<Car />} label="Vehicle No" value={RegistrationNo} />
          <InfoRow icon={<Car />} label="Vehicle Type" value={VehicleType} />
          <InfoRow icon={<Car />} label="Vehicle Model" value={VehicleModel} />
          <InfoRow icon={<Hash />} label="Engine No" value={EngineNo} />
          <InfoRow icon={<Hash />} label="Chassis No" value={ChassisNo} />
        </div>

        {/* Right Column - Policy Info + Actions */}
        <div className="bg-white shadow-lg rounded-2xl p-6 flex flex-col justify-between gap-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Policy Info</h2>
            <InfoRow icon={<Calendar />} label="Start Date" value={StartDate} />
            <InfoRow icon={<Calendar />} label="End Date" value={EndDate} />
            <div className="mt-4">
              <span
                className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                  isActive ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"
                }`}
              >
                {isActive ? "Active" : "Expired"}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 mt-6">
            <Link to={`/UpdateInsurances/${_id}`}>
              <button className="w-full flex items-center justify-center gap-2 bg-blue-500 text-white py-3 rounded-xl font-semibold shadow hover:bg-blue-700 transition">
                <Edit size={18} />
                Update Policy
              </button>
            </Link>
            <button
              onClick={deleteHandler}
              className="w-full flex items-center justify-center gap-2 bg-red-500 text-white py-3 rounded-xl font-semibold shadow hover:bg-red-700 transition"
            >
              <Trash2 size={18} />
              Delete Policy
            </button>
            <button
              onClick={() => setShowDocument(true)}
              className="w-full flex items-center justify-center gap-2 bg-green-500 text-white py-3 rounded-xl font-semibold shadow hover:bg-green-700 transition"
            >
              <Printer size={18} />
              Print Document
            </button>
          </div>
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
  );
}

// Info Row Component
const InfoRow = ({ icon, label, value }) => (
  <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl border border-gray-200 hover:shadow-sm transition">
    <div className="text-blue-600">{icon}</div>
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="font-semibold text-gray-800">{value || "N/A"}</p>
    </div>
  </div>
);

export default AllInsurancesDisplay;
