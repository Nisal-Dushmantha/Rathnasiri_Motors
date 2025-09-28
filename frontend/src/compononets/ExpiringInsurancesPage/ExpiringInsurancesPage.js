import React, { useEffect, useState } from "react";
import axios from "axios";

function ExpiringInsurancesPage() {
  const [insurances, setInsurances] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:5000/insurances");
        setInsurances(res.data.insurances || []);
      } catch (err) {
        console.error("Error fetching insurances:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const normalizeDate = (d) => {
    const date = new Date(d);
    date.setHours(0, 0, 0, 0);
    return date;
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const expiringSoon = insurances.filter((item) => {
    const end = normalizeDate(item.EndDate);
    const diffDays = (end - today) / (1000 * 60 * 60 * 24);
    return diffDays > 0 && diffDays <= 30;
  });

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6">
      <div className="max-w-6xl mx-auto bg-white shadow-md rounded-xl p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Expiring Insurances (Next 30 Days)
        </h1>

        {loading ? (
          <p className="text-gray-600">Loading...</p>
        ) : expiringSoon.length === 0 ? (
          <p className="text-gray-600">No expiring insurances found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200 rounded-xl">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-3 px-4 border-b text-left">Full Name</th>
                  <th className="py-3 px-4 border-b text-left">Vehicle</th>
                  <th className="py-3 px-4 border-b text-left">Contact No</th>
                  <th className="py-3 px-4 border-b text-left">End Date</th>
                  <th className="py-3 px-4 border-b text-left">Days Left</th>
                </tr>
              </thead>
              <tbody>
                {expiringSoon.map((item) => {
                  const end = normalizeDate(item.EndDate);
                  const diffDays = (end - today) / (1000 * 60 * 60 * 24);

                  return (
                    <tr
                      key={item._id}
                      className="hover:bg-gray-50 transition duration-200"
                    >
                      <td className="py-3 px-4 border-b">{item.fullname}</td>
                      <td className="py-3 px-4 border-b">
                        {item.VehicleType} - {item.VehicleModel}
                      </td>
                      <td className="py-3 px-4 border-b">{item.ContactNo}</td>
                      <td className="py-3 px-4 border-b">
                        {new Date(item.EndDate).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 border-b text-red-600 font-semibold">
                        {Math.round(diffDays)} days
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default ExpiringInsurancesPage;
