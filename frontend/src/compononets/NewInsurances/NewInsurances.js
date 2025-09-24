import React, { useState } from "react";
//import React from 'react'
import axios from "axios";
import { useNavigate } from "react-router";


function NewInsurances() {
const history = useNavigate();
const [FormData, setformData] = useState({
     fullname:"",
     Address:"",
     ContactNo:"",
     RegistrationNo:"",
     VehicleType:"",
     VehicleModel:"",
     EngineNo:"",
     ChassisNo:"",
     StartDate:"",
     EndDate:"",
});

const handleChange = (e) =>{
  setformData((prevState) =>({
    ...prevState,
    [e.target.name]:e.target.value,
  }));
};

{/*const handleSubmit = (e)=>{
  e.preventDefault();
  console.log("New Insurancee Added:", FormData);
  alert("New Insurance addes to system!");
  sendRequest().then(()=>history('/InsurancesAll'))
}*/}
   const handleSubmit = (e) => {
  e.preventDefault();

  // Frontend validation for Contact Number
  const phoneRegex = /^[0-9]{10}$/; // Example: 10 digits
  if (!phoneRegex.test(FormData.ContactNo)) {
    alert("Invalid Contact Number. It must be 10 digits.");
    return;
  }

  console.log("New Insurance Added:", FormData);
  alert("New Insurance added to system!");
  sendRequest().then(() => history('/InsurancesAll'));
};


const sendRequest = async() =>{
  await axios.post("http://localhost:5000/insurances",{
    fullname: String(FormData.fullname),
    Address: String(FormData.Address),
    ContactNo: String(FormData.ContactNo),
    RegistrationNo: String(FormData.RegistrationNo),
    VehicleType: String(FormData.VehicleType),
    VehicleModel: String(FormData.VehicleModel),
    EngineNo: String(FormData.EngineNo),
    ChassisNo: String(FormData.ChassisNo),
    StartDate:FormData.StartDate,
    EndDate:FormData.EndDate,
  }).then(res => res.data);
}

  return (
    <div className="flex-1 bg-gradient-to-b from-blue-100 to-blue-50 min-h-screen p-10">
      <h1 className="text-3xl font-bold mb-8 text-blue-900 text-center">
        Add New Insurances
      </h1>
      <form
        onSubmit={handleSubmit}
        className="max-w-3xl mx-auto bg-white rounded-3xl shadow-xl p-8 space-y-6"
      >
        {/* Customer Name & Phone */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Full Name
            </label>
            <input
              type="text"
              name="fullname"
              value={FormData.fullname}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter Full name"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Address
            </label>
            <input
              type="text"
              name="Address"
              value={FormData.Address}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter Address"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Contact Number
            </label>
            <input
              type="text"
              name="ContactNo"
              value={FormData.ContactNo}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter Contact number"
              required
            />
          </div>
        </div>

        {/* Vehicle Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Vehicle Number
            </label>
            <input
              type="text"
              name="RegistrationNo"
              value={FormData.RegistrationNo}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Vehicle number"
              required
            />
          </div>

          {/*<div>
            <label className="block text-gray-700 font-semibold mb-2">
              Vehicle Type
            </label>
            <input
              type="text"
              name="VehicleType"
              value={FormData.VehicleType}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Car / Bike / Truck"
              required
            />
          </div>*/}
          <div>
  <label className="block text-gray-700 font-semibold mb-2">
    Vehicle Type
  </label>
  <select
    name="VehicleType"
    value={FormData.VehicleType}
    onChange={handleChange}
    className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
    required
  >
    <option value="" disabled>Select Vehicle Type</option>
    <option value="Car">Car</option>
    <option value="Bike">Bike</option>
    <option value="Truck">Truck</option>
    <option value="Van">Van</option>
    <option value="Bus">Bus</option>
  </select>
</div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Vehicle Model
            </label>
            <input
              type="text"
              name="VehicleModel"
              value={FormData.VehicleModel}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Vehicle model"
              required
            />
          </div>
        </div>

        <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Engine Number
            </label>
            <input
              type="text"
              name="EngineNo"
              value={FormData.EngineNo}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Engine Number"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Chassis Number
            </label>
            <input
              type="text"
              name="ChassisNo"
              value={FormData.ChassisNo}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Chassis Number"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Insurance Start Date
            </label>
            <input
              type="date"
              name="StartDate"
              value={FormData.StartDate}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Insurance End Date
            </label>
            <input
              type="date"
              name="EndDate"
              value={FormData.EndDate}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
        

        {/* Submit Button */}
        <div className="text-center">
          <button
            type="submit"
            className="bg-blue-800 text-white py-3 px-6 rounded-2xl font-semibold hover:bg-blue-700 transition"
          >
            Add to System
          </button>
        </div>
      </form>
      
    </div>
  )
}

export default NewInsurances;
