import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import Card from "../ui/Card";
import Input from "../ui/Input";
import Button from "../ui/Button";
import PageHeader from "../ui/PageHeader";

function NewInsurances() {
  const history = useNavigate();
  const [FormData, setformData] = useState({
    fullname: "",
    Address: "",
    ContactNo: "",
    Email: "",
    RegistrationNo: "",
    VehicleType: "",
    VehicleModel: "",
    EngineNo: "",
    ChassisNo: "",
    StartDate: "",
    EndDate: "",
  });

  // Format date as yyyy-mm-dd
  const formatDate = (date) => date.toISOString().split("T")[0];

  // Calculate minEndDate = StartDate + 1 day
  const getMinEndDate = () => {
    if (FormData.StartDate) {
      const start = new Date(FormData.StartDate);
      start.setDate(start.getDate() + 1);
      return formatDate(start);
    }
    return ""; // no restriction if StartDate not chosen
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Reset EndDate if StartDate updated and EndDate <= new StartDate
    if (name === "StartDate" && FormData.EndDate && value >= FormData.EndDate) {
      setformData((prevState) => ({
        ...prevState,
        [name]: value,
        EndDate: "", // reset invalid end date
      }));
    } else {
      setformData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(FormData.ContactNo)) {
      alert("Invalid Contact Number. It must be 10 digits.");
      return;
    }

    // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(FormData.Email)) {
    alert("Invalid Email address.");
    return;
  }

    console.log("New Insurance Added:", FormData);
    alert("New Insurance added to system!");
    sendRequest().then(() => history("/InsurancesAll"));
  };

  const sendRequest = async () => {
    await axios
      .post("http://localhost:5000/insurances", {
        fullname: String(FormData.fullname),
        Address: String(FormData.Address),
        ContactNo: String(FormData.ContactNo),
        Email: String(FormData.Email),
        RegistrationNo: String(FormData.RegistrationNo),
        VehicleType: String(FormData.VehicleType),
        VehicleModel: String(FormData.VehicleModel),
        EngineNo: String(FormData.EngineNo),
        ChassisNo: String(FormData.ChassisNo),
        StartDate: FormData.StartDate,
        EndDate: FormData.EndDate,
      })
      .then((res) => res.data);
  };

  return (
    <div className="flex-1 bg-white min-h-screen p-10">
      <PageHeader
        title="Add New Insurance"
        subtitle="Create a new insurance record"
        icon={
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 2l7 4v6c0 5-3.5 9.5-7 10-3.5-.5-7-5-7-10V6l7-4z"
            />
          </svg>
        }
      />
      <Card className="max-w-3xl mx-auto p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Customer Name & Contact */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Full Name"
              type="text"
              name="fullname"
              value={FormData.fullname}
              onChange={handleChange}
              placeholder="Enter Full name"
              required
            />
            <Input
              label="Address"
              type="text"
              name="Address"
              value={FormData.Address}
              onChange={handleChange}
              placeholder="Enter Address"
              required
            />
            <Input
              label="Contact Number"
              type="text"
              name="ContactNo"
              value={FormData.ContactNo}
              onChange={handleChange}
              placeholder="Enter Contact number"
              required
            />
             <Input
              label="Email"
              type="text"
              name="Email"
              value={FormData.Email}
              onChange={handleChange}
              placeholder="Enter Email"
              required
            />
          </div>

          {/* Vehicle Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Input
              label="Vehicle Number"
              type="text"
              name="RegistrationNo"
              value={FormData.RegistrationNo}
              onChange={handleChange}
              placeholder="Vehicle number"
              required
            />

            <div className="flex flex-col">
              <label className="mb-1 text-gray-700 font-medium">
                Vehicle Type
              </label>
              <select
                name="VehicleType"
                value={FormData.VehicleType}
                onChange={handleChange}
                className="px-3 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400"
                required
              >
                <option value="">Select Vehicle Type</option>
                <option value="Bike">Bike</option>
                <option value="Car">Car</option>
                <option value="Truck">Truck</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <Input
              label="Vehicle Model"
              type="text"
              name="VehicleModel"
              value={FormData.VehicleModel}
              onChange={handleChange}
              placeholder="Vehicle model"
              required
            />
          </div>

          <Input
            label="Engine Number"
            type="text"
            name="EngineNo"
            value={FormData.EngineNo}
            onChange={handleChange}
            placeholder="Engine Number"
            required
          />

          <Input
            label="Chassis Number"
            type="text"
            name="ChassisNo"
            value={FormData.ChassisNo}
            onChange={handleChange}
            placeholder="Chassis Number"
            required
          />

          {/* Insurance Dates */}
          <Input
            label="Insurance Start Date"
            type="date"
            name="StartDate"
            value={FormData.StartDate}
            onChange={handleChange}
            max={new Date().toISOString().split("T")[0]} // cannot select future dates
            required
          />

          <Input
            label="Insurance End Date"
            type="date"
            name="EndDate"
            value={FormData.EndDate}
            onChange={handleChange}
            min={getMinEndDate()} // must be at least 1 day after StartDate
            required
          />

          {/* Submit Button */}
          <div className="text-center">
            <Button type="submit" className="px-6 py-3 rounded-xl">
              Add to System
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

export default NewInsurances;
