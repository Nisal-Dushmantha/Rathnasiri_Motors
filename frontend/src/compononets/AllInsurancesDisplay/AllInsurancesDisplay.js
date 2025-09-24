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
  FileText,
  Trash2,
  Edit,
  Printer,
} from "lucide-react";

function AllInsurancesDisplay(props) {
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
  } = props.user;

  const history = useNavigate();
  const [showDocument, setShowDocument] = useState(false);

  const deleteHandler = async () => {
    await axios
      .delete(`http://localhost:5000/insurances/${_id}`)
      .then(() => history("/InsurancesAll"));
    alert("Insurance Deleted!");
  };

  const isActive =
    new Date(StartDate) <= new Date() && new Date(EndDate) >= new Date();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 p-6">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">
              {fullname || "Unknown"}
            </h2>
            <p className="text-blue-100 text-sm mt-1">ID: {_id}</p>
          </div>
          <span
            className={`px-3 py-1 text-sm font-semibold rounded-full ${
              isActive
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {isActive ? "Active" : "Expired"}
          </span>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
          <DetailCard icon={<Phone size={18} />} label="Contact No" value={ContactNo} />
          <DetailCard icon={<MapPin size={18} />} label="Address" value={Address} />
          <DetailCard icon={<Car size={18} />} label="Vehicle No" value={RegistrationNo} />
          <DetailCard icon={<Car size={18} />} label="Vehicle Type" value={VehicleType} />
          <DetailCard icon={<Car size={18} />} label="Vehicle Model" value={VehicleModel} />
          <DetailCard icon={<Hash size={18} />} label="Engine No" value={EngineNo} />
          <DetailCard icon={<Hash size={18} />} label="Chassis No" value={ChassisNo} />
          <DetailCard icon={<Calendar size={18} />} label="Start Date" value={StartDate} />
          <DetailCard icon={<Calendar size={18} />} label="End Date" value={EndDate} />
        </div>

        {/* Actions */}
        <div className="bg-gray-50 px-6 py-4 flex flex-col md:flex-row gap-3 border-t">
          <Link to={`/UpdateInsurances/${_id}`} className="flex-1">
            <button className="w-full flex items-center justify-center gap-2 bg-green-600 text-white px-5 py-2.5 rounded-xl font-semibold shadow hover:bg-green-700 transition">
              <Edit size={18} />
              Update
            </button>
          </Link>
          <button
            onClick={deleteHandler}
            className="flex-1 w-full flex items-center justify-center gap-2 bg-red-600 text-white px-5 py-2.5 rounded-xl font-semibold shadow hover:bg-red-700 transition"
          >
            <Trash2 size={18} />
            Delete
          </button>
          <button
            onClick={() => setShowDocument(true)}
            className="flex-1 w-full flex items-center justify-center gap-2 bg-blue-700 text-white px-5 py-2.5 rounded-xl font-semibold shadow hover:bg-blue-800 transition"
          >
            <Printer size={18} />
            Print
          </button>
        </div>
      </div>

      {/* Show PDF Preview Modal */}
      {showDocument && (
        <InsuranceDocument
          user={{
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
          }}
          onClose={() => setShowDocument(false)}
        />
      )}
    </div>
  );
}

const DetailCard = ({ icon, label, value }) => (
  <div className="bg-white shadow-sm border rounded-xl p-4 flex items-start gap-3 hover:shadow-md transition">
    <div className="text-blue-600">{icon}</div>
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="font-semibold text-gray-800">{value || "N/A"}</p>
    </div>
  </div>
);

export default AllInsurancesDisplay;
