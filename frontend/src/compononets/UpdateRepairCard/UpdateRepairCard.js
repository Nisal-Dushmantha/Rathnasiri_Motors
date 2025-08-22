import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

function UpdateRepairCard() {
  const id = useParams().id;
  const [inputs, setInputs] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHandler = async () => {
      try {
        const res = await axios.get(`http://Localhost:5000/repairs/${id}`);
        setInputs(res.data.repairs || {});
      } catch (err) {
        console.error("Error fetching repair:", err);
      }
    };
    fetchHandler();
  }, [id]);

  const sendRequest = async () => {
    await axios
      .put(`http://Localhost:5000/repairs/${id}`, {
        Name: String(inputs.Name),
        Phone: Number(inputs.Phone),
        VehicleNumber: String(inputs.VehicleNumber),
        VehicleType: String(inputs.VehicleType),
        Model: String(inputs.Model),
        Details: String(inputs.Details),
      })
      .then((res) => res.data);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendRequest().then(() => {
      alert("Repair Job updated!");
      navigate("/AllRepairJobs");
    });
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Update Repaire Job
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="Name"
          value={inputs.Name}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="number"
          name="Phone"
          value={inputs.Phone || ""}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          name="VehicleNumber"
          value={inputs.VehicleNumber || ""}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          name="VehicleType"
          value={inputs.VehicleType || ""}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          name="Model"
          value={inputs.Model || ""}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <textarea
          name="Details"
          value={inputs.Details || ""}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Update Repair
        </button>
      </form>
    </div>
  );
}

export default UpdateRepairCard;
