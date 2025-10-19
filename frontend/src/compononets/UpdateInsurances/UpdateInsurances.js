// File: UpdateInsurances.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router";

function UpdateInsurances() {
  const [updateinsurance, setupdateinsurance] = useState({});
  const history = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchHandler = async () => {
      const { data } = await axios.get(`http://localhost:5000/insurances/${id}`);
      setupdateinsurance(data.insurances);
    };
    fetchHandler();
  }, [id]);

  const sendRequest = async () => {
    await axios.put(`http://localhost:5000/insurances/${id}`, {
      fullname: String(updateinsurance.fullname),
      Address: String(updateinsurance.Address),
      ContactNo: String(updateinsurance.ContactNo),
      Email: String(updateinsurance.Email),
      RegistrationNo: String(updateinsurance.RegistrationNo),
      VehicleType: String(updateinsurance.VehicleType),
      VehicleModel: String(updateinsurance.VehicleModel),
      EngineNo: String(updateinsurance.EngineNo),
      ChassisNo: String(updateinsurance.ChassisNo),
      StartDate: updateinsurance.StartDate,
      EndDate: updateinsurance.EndDate,
    });
  };

  const handleChange = (e) => {
    setupdateinsurance((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const formatDate = (date) => date.toISOString().split("T")[0];
  const today = formatDate(new Date());

  const handleSubmit = (e) => {
    e.preventDefault();

    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(updateinsurance.ContactNo)) {
      alert("Contact Number must be exactly 10 digits.");
      return;
    }
    // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(updateinsurance.Email)) {
    alert("Invalid Email address.");
    return;
  }

    // --- FIXED DATE VALIDATION ---
    const startDate = new Date(updateinsurance.StartDate);
    const endDate = new Date(updateinsurance.EndDate);
    const currentDate = new Date();
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);
    currentDate.setHours(0, 0, 0, 0);

    // Start Date must not be in the future
    if (startDate > currentDate) {
      alert("Start Date cannot be in the future.");
      return;
    }

    // End Date must be after Start Date
    if (!updateinsurance.EndDate || endDate <= startDate) {
      alert("End Date must be after the Start Date.");
      return;
    }

    sendRequest().then(() => history("/InsurancesAll"));
    alert("Details Updated!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-white flex items-center justify-center p-6">
      <div className="max-w-4xl w-full bg-white rounded-3xl shadow-xl p-10">
        <h1 className="text-4xl font-extrabold text-blue-900 text-center mb-10">
          Update Insurance
        </h1>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Full Name */}
          <div className="flex flex-col">
            <label className="text-gray-700 font-semibold mb-2">Full Name</label>
            <input
              type="text"
              name="fullname"
              value={updateinsurance.fullname || ""}
              onChange={handleChange}
              className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
              required
            />
          </div>

          {/* Contact Number */}
          <div className="flex flex-col">
            <label className="text-gray-700 font-semibold mb-2">Contact Number</label>
            <input
              type="text"
              name="ContactNo"
              value={updateinsurance.ContactNo || ""}
              onChange={handleChange}
              placeholder="10-digit number"
              className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
              required
            />
          </div>
          {/*Email */}
          <div className="flex flex-col">
            <label className="text-gray-700 font-semibold mb-2">Email</label>
            <input
              type="text"
              name="Email"
              value={updateinsurance.Email || ""}
              onChange={handleChange}
              placeholder="Email"
              className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
              required
            />
          </div>
          {/* Address */}
          <div className="flex flex-col md:col-span-2">
            <label className="text-gray-700 font-semibold mb-2">Address</label>
            <input
              type="text"
              name="Address"
              value={updateinsurance.Address || ""}
              onChange={handleChange}
              className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
              required
            />
          </div>

          {/* Vehicle Number */}
          <div className="flex flex-col">
            <label className="text-gray-700 font-semibold mb-2">Vehicle Number</label>
            <input
              type="text"
              name="RegistrationNo"
              value={updateinsurance.RegistrationNo || ""}
              onChange={handleChange}
              className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
              required
            />
          </div>

          {/* Vehicle Type */}
          <div className="flex flex-col">
            <label className="text-gray-700 font-semibold mb-2">Vehicle Type</label>
            <select
              name="VehicleType"
              value={updateinsurance.VehicleType || ""}
              onChange={handleChange}
              className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
              required
            >
              <option value="">Select Vehicle Type</option>
              <option value="Bike">Bike</option>
              <option value="Car">Car</option>
              <option value="Truck">Truck</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Vehicle Model */}
          <div className="flex flex-col">
            <label className="text-gray-700 font-semibold mb-2">Vehicle Model</label>
            <input
              type="text"
              name="VehicleModel"
              value={updateinsurance.VehicleModel || ""}
              onChange={handleChange}
              className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
              required
            />
          </div>

          {/* Engine No */}
          <div className="flex flex-col">
            <label className="text-gray-700 font-semibold mb-2">Engine No</label>
            <input
              type="text"
              name="EngineNo"
              value={updateinsurance.EngineNo || ""}
              onChange={handleChange}
              className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
              required
            />
          </div>

          {/* Chassis No */}
          <div className="flex flex-col">
            <label className="text-gray-700 font-semibold mb-2">Chassis No</label>
            <input
              type="text"
              name="ChassisNo"
              value={updateinsurance.ChassisNo || ""}
              onChange={handleChange}
              className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
              required
            />
          </div>

          {/* Start Date */}
          <div className="flex flex-col">
            <label className="text-gray-700 font-semibold mb-2">Start Date</label>
            <input
              type="date"
              name="StartDate"
              value={updateinsurance.StartDate ? updateinsurance.StartDate.substring(0, 10) : ""}
              onChange={handleChange}
              className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
              max={today}
              required
            />
          </div>

          {/* End Date */}
          <div className="flex flex-col">
            <label className="text-gray-700 font-semibold mb-2">End Date</label>
            <input
              type="date"
              name="EndDate"
              value={updateinsurance.EndDate ? updateinsurance.EndDate.substring(0, 10) : ""}
              onChange={handleChange}
              className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
              min={
                updateinsurance.StartDate
                  ? new Date(
                      new Date(updateinsurance.StartDate).getTime() + 24 * 60 * 60 * 1000
                    )
                      .toISOString()
                      .split("T")[0]
                  : today
              }
              required
            />
          </div>

          {/* Submit Button */}
          <div className="md:col-span-2">
            <button
              type="submit"
              className="w-full bg-blue-700 text-white py-3 rounded-xl font-semibold text-lg hover:bg-blue-800 transition"
            >
              Update Insurance
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UpdateInsurances;
