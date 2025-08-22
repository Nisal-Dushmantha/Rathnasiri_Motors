// AllRepairJobs.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import AllRepairJobsDisplay from "../AllRepairJobsDisplay/AllRepairJobsDisplay";

const URL = "http://localhost:5000/repairs"; // ✅ lowercase "localhost"

function AllRepairJobs() {
  const [repairs, setJobs] = useState([]);

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

      {repairs.length === 0 ? (
        <p className="text-gray-600">No jobs found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {repairs.map((job) => (
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
