import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

function UpdateServiceCard() {
  const id = useParams().id;
  const [inputs, setInputs] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHandler = async () => {
      try {
        const res = await axios.get(`http://Localhost:5000/services/${id}`);
        setInputs(res.data.services || {});
      } catch (err) {
        console.error("Error fetching service:", err);
      }
    };
    fetchHandler();
  }, [id]);

  const sendRequest = async () => {
    await axios
      .put(`http://Localhost:5000/services/${id}`, {
        Name: String(inputs.Name),
        Phone: String(inputs.Phone), // send as string to keep leading zero and match 10-digit regex
        VehicleNumber: String(inputs.VehicleNumber),
        VehicleType: String(inputs.VehicleType),
        Model: String(inputs.Model),
        KiloMeters: Number(inputs.KiloMeters),
        LastServiceDate: inputs.LastServiceDate,
        Requests: String(inputs.Requests),
      })
      .then((res) => res.data);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendRequest()
      .then(() => {
        alert("Service Job updated!");
        navigate("/AllServiceJobs");
      })
      .catch((err) => {
        const errs = err?.response?.data?.errors;
        if (Array.isArray(errs)) {
          alert(errs.map((x) => `${x.param}: ${x.msg}`).join("\n"));
        } else {
          alert("Update failed. Please check inputs and try again.");
        }
        console.error("Update service error:", err?.response?.data || err);
      });
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Update Service Job
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="Name"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Customer Name
          </label>
          <input
            id="Name"
            type="text"
            name="Name"
            value={inputs.Name || ""}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label
            htmlFor="Phone"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Phone Number
          </label>
          <input
            id="Phone"
            type="tel"
            name="Phone"
            value={inputs.Phone || ""}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label
            htmlFor="VehicleNumber"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Vehicle Number
          </label>
          <input
            id="VehicleNumber"
            type="text"
            name="VehicleNumber"
            value={inputs.VehicleNumber || ""}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label
            htmlFor="VehicleType"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Vehicle Type
          </label>
          <select
            id="VehicleType"
            name="VehicleType"
            value={inputs.VehicleType || ""}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          >
            <option value="" disabled>
              Select vehicle type
            </option>
            <option value="Bike">Bike</option>
            <option value="Scooter">Scooter</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="Model"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Vehicle Model
          </label>
          <input
            id="Model"
            type="text"
            name="Model"
            value={inputs.Model || ""}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label
            htmlFor="KiloMeters"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Kilometers
          </label>
          <input
            id="KiloMeters"
            type="number"
            name="KiloMeters"
            value={inputs.KiloMeters || ""}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label
            htmlFor="LastServiceDate"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Last Service Date
          </label>
          <input
            id="LastServiceDate"
            type="date"
            name="LastServiceDate"
            value={
              inputs.LastServiceDate
                ? inputs.LastServiceDate.substring(0, 10)
                : ""
            }
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label
            htmlFor="Requests"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Requests / Notes
          </label>
          <textarea
            id="Requests"
            name="Requests"
            value={inputs.Requests || ""}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Update Service
        </button>
      </form>
    </div>
  );
}

export default UpdateServiceCard;
