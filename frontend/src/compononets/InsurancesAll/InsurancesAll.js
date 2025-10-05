import React, { useState, useEffect } from "react";
import axios from "axios";
import { Search } from "lucide-react";
import AllInsurancesDisplay from "../AllInsurancesDisplay/AllInsurancesDisplay";

const URL = "http://localhost:5000/insurances";

const fetchHandler = async () => {
  return await axios.get(URL).then((res) => res.data.insurances);
};

function InsurancesAll() {
  const [insurances, setInsurances] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedInsurance, setSelectedInsurance] = useState(null);

  useEffect(() => {
    fetchHandler().then((data) => setInsurances(data));
  }, []);

  const filteredInsurances = insurances.filter(
    (insurance) =>
      insurance.fullname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      insurance.RegistrationNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      insurance.VehicleModel?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      insurance.VehicleType?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-6">
      <h1 className="text-4xl font-bold text-blue-900 mb-6">All Insurances</h1>

      {/* Search Bar */}
      <div className="max-w-4xl mx-auto mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search by Name, Vehicle No..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
      </div>

      {/* Insurance Table */}
      <div className="overflow-x-auto max-w-6xl mx-auto shadow-xl rounded-2xl border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200 rounded-2xl overflow-hidden">
          <thead className="bg-gradient-to-r from-blue-50 to-blue-100 sticky top-0 z-10">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-bold text-blue-900 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-4 text-left text-sm font-bold text-blue-900 uppercase tracking-wider">
                Vehicle No
              </th>
              <th className="px-6 py-4 text-left text-sm font-bold text-blue-900 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-left text-sm font-bold text-blue-900 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {filteredInsurances.length > 0 ? (
              filteredInsurances.map((insurance, idx) => {
                const isActive =
                  new Date(insurance.StartDate) <= new Date() &&
                  new Date(insurance.EndDate) >= new Date();

                return (
                  <tr
                    key={insurance._id}
                    className={`transition-all ${
                      idx % 2 === 0 ? "bg-gray-50" : "bg-white"
                    } hover:bg-blue-50`}
                  >
                    <td className="px-6 py-4 text-sm font-medium text-gray-800">
                      {insurance.fullname}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700 font-mono">
                      {insurance.RegistrationNo}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold shadow-sm ${
                          isActive
                            ? "bg-green-100 text-green-700 border border-green-300"
                            : "bg-red-100 text-red-700 border border-red-300"
                        }`}
                      >
                        <span
                          className={`w-2 h-2 rounded-full ${
                            isActive ? "bg-green-500" : "bg-red-500"
                          }`}
                        ></span>
                        {isActive ? "Active" : "Expired"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <button
                        onClick={() => setSelectedInsurance(insurance)}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition shadow-md"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={4} className="text-center py-8 text-gray-500 text-sm">
                  No insurances found for{" "}
                  <span className="font-semibold">{searchTerm}</span>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Insurance Detail Modal */}
      {selectedInsurance && (
        <AllInsurancesDisplay
          user={selectedInsurance}
          onClose={() => setSelectedInsurance(null)}
          refresh={() => fetchHandler().then((data) => setInsurances(data))}
        />
      )}
    </div>
  );
}

export default InsurancesAll;
