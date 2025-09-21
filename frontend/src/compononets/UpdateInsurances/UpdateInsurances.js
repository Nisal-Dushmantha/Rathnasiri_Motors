import React,{useState,useEffect} from 'react';
import axios from 'axios';
import { useParams } from 'react-router'
import { useNavigate } from 'react-router'

function UpdateInsurances() {

  const [updateinsurance, setupdateinsurance] = useState({});
  const history = useNavigate();
  const id = useParams().id;
  
  useEffect(() => {
    const fetchHandler = async () =>{
      await axios.get(`http://localhost:5000/insurances/${id}`)
      .then((res) => res.data)
      .then((data)=> setupdateinsurance(data.insurances));
    };
    fetchHandler();
  },[id]);

  const sendRequest = async() =>{
    await axios.put(`http://localhost:5000/insurances/${id}`,{
    fullname: String(updateinsurance.fullname),
    Address: String(updateinsurance.Address),
    ContactNo: String(updateinsurance.ContactNo),
    RegistrationNo: String(updateinsurance.RegistrationNo),
    VehicleType: String(updateinsurance.VehicleType),
    VehicleModel: String(updateinsurance.VehicleModel),
    EngineNo: String(updateinsurance.EngineNo),
    ChassisNo: String(updateinsurance.ChassisNo),
    StartDate:updateinsurance.StartDate,
    EndDate:updateinsurance.EndDate,
    })
    .then((res)=> res.data);
  };
const handleChange = (e) =>{
  setupdateinsurance((prevState) =>({
    ...prevState,
    [e.target.name]:e.target.value,
  }));
};

const handleSubmit = (e)=>{
  e.preventDefault();
  console.log(updateinsurance);
  sendRequest().then(()=>history('/InsurancesAll'));
  alert("Deatails Updated!");
 
}
  return ( 
     <div className="flex items-center justify-center min-h-screen bg-gray-100">
      
      <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-xl p-8 space-y-6 w-full">
      <h1 className="text-3xl font-bold mb-8 text-blue-900 text-center">
        Update Insurances
      </h1>
      <div className="p-6 max-w-3xl mx-auto">
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block text-gray-700 font-semibold mb-2">
              Full Name :
            </label>
        <input
          type="text"
          name="fullname"
          value={updateinsurance.fullname}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />

          <label className="block text-gray-700 font-semibold mb-2">
              Address :
            </label>
        <input
          type="text"
          name="Address"
          value={updateinsurance.Address || ""}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <label className="block text-gray-700 font-semibold mb-2">
              Contact No :
            </label>
        <input
          type="text"
          name="ContactNo"
          value={updateinsurance.ContactNo || ""}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <label className="block text-gray-700 font-semibold mb-2">
              Vehicle Number: 
            </label>
        <input
          type="text"
          name="RegistrationNo"
          value={updateinsurance.RegistrationNo || ""}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <label className="block text-gray-700 font-semibold mb-2">
              Vehicle Type: 
            </label>
        <input
          type="text"
          name="VehicleType"
          value={updateinsurance.VehicleType || ""}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <label className="block text-gray-700 font-semibold mb-2">
              Vehicle Model: 
            </label>
        <input
          type="text"
          name="VehicleModel"
          value={updateinsurance.VehicleModel || ""}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <label className="block text-gray-700 font-semibold mb-2">
              Engine No: 
            </label>
        <input
          type="text"
          name="EngineNo"
          value={updateinsurance.EngineNo || ""}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <label className="block text-gray-700 font-semibold mb-2">
              Chassis No: 
            </label>
         <input
          type="text"
          name="ChassisNo"
          value={updateinsurance.ChassisNo || ""}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <label className="block text-gray-700 font-semibold mb-2">
              Start Date : 
            </label>
      <input
          type="date"
          name="StartDate"
          value={
            updateinsurance.StartDate
              ? updateinsurance.StartDate.substring(0, 10)
              : ""
          }
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />

         <label className="block text-gray-700 font-semibold mb-2">
              End Date : 
            </label>
      <input
          type="date"
          name="EndDate"
          value={
            updateinsurance.EndDate
              ? updateinsurance.EndDate.substring(0, 10)
              : ""
          }
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        
        <button
          type="submit"
          className="md:flex-1 w-full bg-blue-700 text-white px-5 py-2.5 rounded-xl hover:bg-blue-800 transition"
        >
          Update Insurance
        </button>
      </form>
    </div>
    </div>
    </div>
  )
}

export default UpdateInsurances;
