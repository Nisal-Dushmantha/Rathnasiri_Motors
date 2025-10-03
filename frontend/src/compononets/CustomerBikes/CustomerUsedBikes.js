import React, { useEffect, useState } from "react";
import axios from "axios";
import CustomerNavBar from '../CustomerNavBar/CustomerNavBar';
import CustomerFooter from '../CustomerFooter/CustomerFooter';

function CustomerUsedBikes() {
  const [bikes, setBikes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBikes();
  }, []);

  const fetchBikes = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/usedBs");
      if (res.status === 200 && Array.isArray(res.data.usedBs)) {
        setBikes(res.data.usedBs);
        setError(null);
      } else if (res.status === 404) {
        setBikes([]);
        setError(null);
      } else {
        setError("Failed to load bikes");
      }
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setBikes([]);
        setError(null);
      } else {
        console.error("Error fetching bikes:", err);
        setError("Failed to load bikes");
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-100 to-blue-50 flex flex-col">
        <CustomerNavBar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-2xl font-semibold text-blue-900">
            Loading bikes...
          </div>
        </div>
        <CustomerFooter />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-100 to-blue-50 flex flex-col">
        <CustomerNavBar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-xl text-red-600">{error}</div>
        </div>
        <CustomerFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex flex-col">
      <CustomerNavBar />
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-700 to-blue-500 text-white py-16 shadow-md mb-10">
        <div className="max-w-5xl mx-auto px-6 flex flex-col items-center text-center">
          <h1 className="text-5xl font-extrabold tracking-tight mb-4 drop-shadow-lg">Find Your Perfect Used Bike</h1>
          <p className="text-lg font-medium mb-6 max-w-2xl">Browse our carefully inspected used bikes for unbeatable value and reliability. Every ride has a story—start your next chapter here!</p>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-6 bg-gradient-to-t from-white/80 to-transparent pointer-events-none" />
      </section>
      <main className="flex-grow px-4 pb-10">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-blue-900 mb-8 text-center tracking-wide underline decoration-blue-900 decoration-2 underline-offset-8">Used Bikes</h2>
          {bikes.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-2xl text-gray-400 mb-4">No bikes found</div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {bikes.map((bike) => (
                <div
                  key={bike._id}
                  className="bg-white/90 rounded-3xl shadow-xl hover:shadow-2xl transition-all hover:scale-[1.03] p-0 border border-blue-100 flex flex-col"
                >
                  <div className="mb-4 relative">
                    {bike.image ? (
                      <img
                        src={`http://localhost:5000${bike.image}`}
                        alt={bike.model}
                        className="w-full h-56 object-cover rounded-t-3xl border-b border-blue-100 shadow-sm"
                        onError={(e) => {
                          e.target.style.display = "none";
                          e.target.nextSibling.style.display = "flex";
                        }}
                      />
                    ) : null}
                    <div
                      className={`w-full h-56 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center rounded-t-3xl border-b border-blue-100 ${
                        bike.image ? "hidden" : ""
                      }`}
                    >
                      <span className="text-blue-400 text-lg font-semibold">No Image</span>
                    </div>
                    {bike.offers && bike.offers !== "-" && (
                      <span className="absolute top-2 right-2 bg-yellow-400 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md animate-pulse">{bike.offers}</span>
                    )}
                  </div>
                  {/* Model and Type in Gray Box */}
                  <div className="bg-gray-100 px-6 py-3 rounded-b-xl flex flex-col items-start mb-2 border-b border-gray-200">
                    <h3 className="text-xl font-bold text-gray-800 mb-1">{bike.model}</h3>
                    <div className="text-sm text-gray-600 font-semibold">Type: {bike.type}</div>
                  </div>
                  {/* Other details line by line */}
                  <div className="flex-1 flex flex-col justify-between px-6 py-4">
                    <div className="text-gray-700 text-sm space-y-1 mb-4">
                
                      <div><span className="font-semibold text-blue-400">Color:</span> {bike.color}</div>
                      <div><span className="font-semibold text-blue-400">Price:</span> <span className="text-blue-900 font-bold">Rs. {bike.price}</span></div>
                      <div><span className="font-semibold text-blue-400">Mileage:</span> <span className="text-blue-900 font-semibold">{bike.mileage} Km</span></div>
                      <div><span className="font-semibold text-blue-400">Year:</span> {bike.year}</div>
                      <div><span className="font-semibold text-blue-400">Previous Owners:</span> {bike.owner}</div>
                    </div>
                    <div className="flex items-center justify-between mt-auto">
                      <span
                        className={`inline-block px-4 py-1 rounded-full text-xs font-bold tracking-wide shadow-sm border ${
                          bike.status === "Available"
                            ? "bg-green-100 text-green-800 border-green-200"
                            : bike.status === "Sold"
                            ? "bg-red-100 text-red-800 border-red-200"
                            : "bg-yellow-100 text-yellow-800 border-yellow-200"
                        }`}
                      >
                        {bike.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <CustomerFooter />
    </div>
  );
}

export default CustomerUsedBikes;
