// AllRepairJobs.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import AllRepairJobsDisplay from "../AllRepairJobsDisplay/AllRepairJobsDisplay";

const URL = "http://localhost:5000/repairs"; // ✅ lowercase "localhost"

function AllRepairJobs() {
  const [repairs, setJobs] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await axios.get(URL);
        setJobs(res.data.repairs || []);
      } catch (err) {
        console.error("Error fetching jobs:", err);
      }
    };
    fetchJobs();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-blue-800 mb-6">All Repair Jobs</h1>
      <input
        type="text"
        placeholder="Search jobs..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="mb-6 px-4 py-2 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 w-full max-w-md"
      />
      {repairs.length === 0 ? (
        <p className="text-gray-600">No jobs found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {repairs.filter(job => {
            const term = search.toLowerCase();
            return (
              job.VehicleNumber?.toLowerCase().includes(term) ||
              job.Name?.toLowerCase().includes(term) ||
              job.Model?.toLowerCase().includes(term) ||
              job.Details?.toLowerCase().includes(term)
            );
          }).map((job) => (
            <AllRepairJobsDisplay
              key={job._id}
              user={job}
              setRepairs={setJobs} // ✅ pass down updater
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default AllRepairJobs;
