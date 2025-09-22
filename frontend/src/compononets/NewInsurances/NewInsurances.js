import React, { useState } from "react";
//import React from 'react'
import axios from "axios";
import { useNavigate } from "react-router";
import Card from "../ui/Card";
import Input from "../ui/Input";
import Button from "../ui/Button";
import PageHeader from "../ui/PageHeader";


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

const handleSubmit = (e)=>{
  e.preventDefault();
  console.log("New Insurancee Added:", FormData);
  alert("New Insurance addes to system!");
  sendRequest().then(()=>history('/InsurancesAll'))
}

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
    <div className="flex-1 bg-white min-h-screen p-10">
      <PageHeader
        title="Add New Insurance"
        subtitle="Create a new insurance record"
        icon={
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2l7 4v6c0 5-3.5 9.5-7 10-3.5-.5-7-5-7-10V6l7-4z" />
          </svg>
        }
      />
      <Card className="max-w-3xl mx-auto p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
        {/* Customer Name & Phone */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input label="Full Name" type="text" name="fullname" value={FormData.fullname} onChange={handleChange} placeholder="Enter Full name" required />
          <Input label="Address" type="text" name="Address" value={FormData.Address} onChange={handleChange} placeholder="Enter Address" required />
          <Input label="Contact Number" type="text" name="ContactNo" value={FormData.ContactNo} onChange={handleChange} placeholder="Enter Contact number" required />
        </div>

        {/* Vehicle Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Input label="Vehicle Number" type="text" name="RegistrationNo" value={FormData.RegistrationNo} onChange={handleChange} placeholder="Vehicle number" required />
          <Input label="Vehicle Type" type="text" name="VehicleType" value={FormData.VehicleType} onChange={handleChange} placeholder="Car / Bike / Truck" required />
          <Input label="Vehicle Model" type="text" name="VehicleModel" value={FormData.VehicleModel} onChange={handleChange} placeholder="Vehicle model" required />
        </div>

        <Input label="Engine Number" type="text" name="EngineNo" value={FormData.EngineNo} onChange={handleChange} placeholder="Engine Number" required />

        <Input label="Chassis Number" type="text" name="ChassisNo" value={FormData.ChassisNo} onChange={handleChange} placeholder="Chassis Number" required />

        <Input label="Insurance Start Date" type="date" name="StartDate" value={FormData.StartDate} onChange={handleChange} required />

        <Input label="Insurance End Date" type="date" name="EndDate" value={FormData.EndDate} onChange={handleChange} required />
        

        {/* Submit Button */}
        <div className="text-center">
          <Button type="submit" className="px-6 py-3 rounded-xl">Add to System</Button>
        </div>
        </form>
      </Card>
    </div>
  )
}

export default NewInsurances;
