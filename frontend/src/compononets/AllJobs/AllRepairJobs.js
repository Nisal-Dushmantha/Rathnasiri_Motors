import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { 
  Search, 
  RefreshCw,
  PlusCircle,
  ClipboardList,
  AlertCircle,
  CheckCircle2
} from "lucide-react";
import AllRepairJobsDisplay from "../AllRepairJobsDisplay/AllRepairJobsDisplay";

const URL = "http://localhost:5000/repairs"; // backend endpoint

function AllRepairJobs() {
  const [repairs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeCount, setActiveCount] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await fetch(URL);
      if (res.ok) {
        const data = await res.json();
        const jobsList = data.repairs || [];
        console.log("All repairs fetched:", jobsList);
        
        setJobs(jobsList);
        
        // Calculate counts
        const completed = jobsList.filter(job => job.status === "completed").length;
        setCompletedCount(completed);
        setActiveCount(jobsList.length - completed);
      }
    } catch (err) {
      console.error("Error fetching jobs:", err);
    } finally {
      setLoading(false);
    }
  };

  // Remove job from state after delete
  const handleDelete = (id) => {
    setJobs((prev) => prev.filter((job) => job._id !== id));
  };

  // UI Components
  const Pill = ({ children }) => (
    <span className="inline-flex items-center gap-2 rounded-full bg-white/60 text-slate-700 px-3 py-1 text-xs font-medium border border-slate-200">
      {children}
    </span>
  );

  const filteredRepairs = repairs.filter(job => {
    const term = search.toLowerCase();
    return (
      job.VehicleNumber?.toLowerCase().includes(term) ||
      job.Name?.toLowerCase().includes(term) ||
      job.Model?.toLowerCase().includes(term) ||
      job.Details?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header Band */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-blue-700 via-indigo-700 to-sky-600" />
        <div className="absolute inset-0 -z-10 opacity-15 mix-blend-soft-light bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent" />
        <div className="max-w-7xl mx-auto px-6 py-8 text-white">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl text-blue-900 font-extrabold tracking-tight">
                Repair Jobs Management
              </h1>
              <p className="mt-1 text-blue-900">
                View, Update, and Manage All Repair Requests
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Pill>
                  <ClipboardList className="h-3.5 w-3.5" />
                  {repairs.length} Total Jobs
                </Pill>
                <Pill>
                  <AlertCircle className="h-3.5 w-3.5" />
                  {activeCount} Active
                </Pill>
                <Pill>
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  {completedCount} Completed
                </Pill>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <button
                onClick={() => fetchJobs()}
                className="inline-flex items-center gap-2 justify-center rounded-xl border border-white bg-white/10 backdrop-blur-sm text-white font-semibold py-2 px-4 hover:bg-white/20 transition"
              >
                <RefreshCw className="h-4 w-4" />
                Refresh
              </button>
              <Link to="/AddRepairCard">
                <button className="inline-flex items-center gap-2 justify-center rounded-xl border border-white bg-white/10 backdrop-blur-sm text-white font-semibold py-2 px-4 hover:bg-white/20 transition">
                  <PlusCircle className="h-4 w-4" />
                  Add New Job
                </button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Search Bar */}
        <div className="relative mb-6">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            placeholder="Search by vehicle number, customer name, model or repair details..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-12 pr-4 py-3 rounded-xl border border-slate-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
          />
        </div>

        {/* Results Section */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
            <p className="text-slate-500">Loading repair jobs...</p>
          </div>
        ) : filteredRepairs.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
            <div className="mx-auto w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
              <ClipboardList className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-700 mb-2">No Jobs Found</h3>
            <p className="text-slate-500 mb-6">
              {search ? "Try using different search terms." : "There are currently no repair jobs in the system."}
            </p>
            <Link to="/AddRepairCard">
              <button className="inline-flex items-center gap-2 justify-center rounded-xl border border-blue-600 bg-blue-50 text-blue-700 font-semibold py-2 px-4 hover:bg-blue-100 transition">
                <PlusCircle className="h-4 w-4" />
                Create New Repair Job
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredRepairs.map((job) => (
              <AllRepairJobsDisplay 
                key={job._id} 
                user={job} 
                setRepairs={setJobs}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AllRepairJobs;
