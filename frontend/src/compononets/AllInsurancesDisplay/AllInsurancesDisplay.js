
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import React, {useState} from 'react';
import InsuranceDocument from "../InsuranceDocument/InsuranceDocument";


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
    const deleteHandler = async () =>{
      await axios.delete(`http://localhost:5000/insurances/${_id}`)
      .then(res => res.data)
      .then(() =>("/"))
      .then(() => history("/InsurancesAll"));
      alert("Insurance Deleted!");

    }

  return (
  <div className="flex items-center justify-center min-h-screen bg-gray-100">
  <div className="bg-white p-10 rounded-xl shadow-md hover:shadow-lg transition max-w-xl mx-auto w-full">
  {/* Header */}
   <div className="flex items-start justify-between mb-4">
    <h2 className="text-xl font-bold text-blue-900">Full Name :{fullname}</h2>
    <span className="inline-block bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold border border-blue-200">
      ID: {_id}
    </span>
  </div>

  {/* Details Grid */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
    <div className="bg-gray-50 p-3 rounded-xl border">
      <p className="text-xs text-gray-500">Contact No</p>
      <p className="font-semibold text-gray-800">{ContactNo}</p>
    </div>
    <div className="bg-gray-50 p-3 rounded-xl border">
      <p className="text-xs text-gray-500">Address</p>
      <p className="font-semibold text-gray-800">{Address}</p>
    </div>
    <div className="bg-gray-50 p-3 rounded-xl border">
      <p className="text-xs text-gray-500">Vehicle No</p>
      <p className="font-semibold text-gray-800">{RegistrationNo}</p>
    </div>
    <div className="bg-gray-50 p-3 rounded-xl border">
      <p className="text-xs text-gray-500">Vehicle Type</p>
      <p className="font-semibold text-gray-800">{VehicleType}</p>
    </div>
    <div className="bg-gray-50 p-3 rounded-xl border">
      <p className="text-xs text-gray-500">Vehicle Model</p>
      <p className="font-semibold text-gray-800">{VehicleModel}</p>
    </div>
    <div className="bg-gray-50 p-3 rounded-xl border">
      <p className="text-xs text-gray-500">Engine No</p>
      <p className="font-semibold text-gray-800">{EngineNo}</p>
    </div>
    <div className="bg-gray-50 p-3 rounded-xl border">
      <p className="text-xs text-gray-500">Chassis No</p>
      <p className="font-semibold text-gray-800">{ChassisNo}</p>
    </div>
    <div className="bg-gray-50 p-3 rounded-xl border">
      <p className="text-xs text-gray-500">Start Date</p>
      <p className="font-semibold text-gray-800">{StartDate}</p>
    </div>
    <div className="bg-gray-50 p-3 rounded-xl border">
      <p className="text-xs text-gray-500">End Date</p>
      <p className="font-semibold text-gray-800">{EndDate}</p>
    </div>
  </div>

  {/* Actions */}
  <div className="flex flex-col md:flex-row gap-3">
    <Link to={`/UpdateInsurances/${_id}`} className="md:flex-1">
          <button className="w-full bg-green-600 text-white px-5 py-2.5 rounded-xl hover:bg-green-700 transition">Update Insurances</button>
        </Link>
    <button onClick = {deleteHandler}
    className="md:flex-1 w-full bg-red-600 text-white px-5 py-2.5 rounded-xl hover:bg-red-700 transition">
      Delete Insurance
    </button>
    <button onClick={() => setShowDocument(true)}className="md:flex-1 w-full bg-blue-700 text-white px-5 py-2.5 rounded-xl hover:bg-blue-800 transition">
      Print Details
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
  )
}

export default AllInsurancesDisplay
