import React, { useEffect, useState } from "react";
import axios from "axios";
import AllServiceJobsDisplay from "../AllServiceJobsDisplay/AllServiceJobsDisplay";

const URL = "http://localhost:5000/services"; // backend endpoint

function AllServiceJobs() {
  const [services, setServices] = useState([]);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await axios.get(URL);
      console.log("All services fetched:", res.data);
      setServices(res.data.services || []);
    } catch (err) {
      console.error("Error fetching jobs:", err);
    }
  };

  // ✅ remove job from state after delete
  const handleDelete = (id) => {
    setServices((prev) => prev.filter((job) => job._id !== id));
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-blue-800 mb-6">All Service Jobs</h1>
      {services.length === 0 ? (
        <p className="text-gray-600">No jobs found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((job) => (
            <AllServiceJobsDisplay 
              key={job._id} 
              user={job} 
              onDelete={handleDelete} // pass callback ✅
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default AllServiceJobs;
