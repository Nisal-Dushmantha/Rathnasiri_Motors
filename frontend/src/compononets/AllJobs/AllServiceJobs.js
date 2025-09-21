import React, { useEffect, useState } from "react";
import axios from "axios";
import AllServiceJobsDisplay from "../AllServiceJobsDisplay/AllServiceJobsDisplay";

const URL = "http://localhost:5000/services"; // backend endpoint

function AllServiceJobs() {
  const [services, setServices] = useState([]);
  const [search, setSearch] = useState("");

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
      <input
        type="text"
        placeholder="Search jobs..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="mb-6 px-4 py-2 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 w-full max-w-md"
      />
      {services.length === 0 ? (
        <p className="text-gray-600">No jobs found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.filter(job => {
            const term = search.toLowerCase();
            return (
              job.VehicleNumber?.toLowerCase().includes(term) ||
              job.Name?.toLowerCase().includes(term) ||
              job.Model?.toLowerCase().includes(term) ||
              job.Requests?.toLowerCase().includes(term)
            );
          }).map((job) => (
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
