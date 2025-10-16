import React, { useEffect, useState } from "react";

function ServiceDateBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [deleteLoadingId, setDeleteLoadingId] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    const load = async () => {
      try {
        setLoading(true);
        const res = await fetch("http://localhost:5000/api/serviceDates", { signal: controller.signal });
        if (!res.ok) throw new Error(`Failed to load bookings (${res.status})`);
        const data = await res.json();
        setBookings(Array.isArray(data) ? data : []);
      } catch (e) {
        if (e.name !== "AbortError") setError(e.message || "Failed to load");
      } finally {
        setLoading(false);
      }
    };
    load();
    return () => controller.abort();
  }, []);

  const acceptBooking = async (id) => {
    try {
      setActionLoadingId(id);
      setError("");
      const res = await fetch(`http://localhost:5000/api/serviceDates/${id}/accept`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Failed to accept booking (${res.status})`);
      }
      // Update UI to reflect accepted state
      setBookings(prev => prev.map(b => b._id === id ? { ...b, accepted: true, acceptedAt: new Date().toISOString() } : b));
    } catch (e) {
      setError(e.message || 'Failed to accept booking');
    } finally {
      setActionLoadingId(null);
    }
  };

  const removeBooking = async (id) => {
    if (!window.confirm('Remove this booking?')) return;
    try {
      setDeleteLoadingId(id);
      setError("");
      const res = await fetch(`http://localhost:5000/api/serviceDates/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Failed to remove booking (${res.status})`);
      }
      setBookings(prev => prev.filter(b => b._id !== id));
    } catch (e) {
      setError(e.message || 'Failed to remove booking');
    } finally {
      setDeleteLoadingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">Service Date Bookings</h1>
          <p className="text-slate-600">Verified bookings from customers</p>
        </div>

        {loading && (
          <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm">Loading...</div>
        )}
        {error && (
          <div className="p-4 bg-red-50 border border-red-400 text-red-700 rounded-xl mb-4">{error}</div>
        )}

        {!loading && !error && (
          <div className="overflow-x-auto bg-white border border-slate-200 rounded-xl shadow-sm">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="text-left px-4 py-3 border-b">Customer</th>
                  <th className="text-left px-4 py-3 border-b">Phone</th>
                  <th className="text-left px-4 py-3 border-b">Vehicle</th>
                  <th className="text-left px-4 py-3 border-b">Vehicle Type</th>
                  <th className="text-left px-4 py-3 border-b">Model</th>
                  <th className="text-left px-4 py-3 border-b">Preferred Date</th>
                  <th className="text-left px-4 py-3 border-b">Preferred Time</th>
                  <th className="text-left px-4 py-3 border-b">Created</th>
                  <th className="text-left px-4 py-3 border-b">Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.length === 0 && (
                  <tr>
                    <td colSpan="9" className="px-4 py-6 text-center text-slate-500">No bookings found</td>
                  </tr>
                )}
                {bookings.map((b) => (
                  <tr key={b._id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 border-b">{b.name || "-"}</td>
                    <td className="px-4 py-3 border-b">{b.phoneNumber || "-"}</td>
                    <td className="px-4 py-3 border-b">{b.plateNumber || "-"}</td>
                    <td className="px-4 py-3 border-b">{b.vehicleType || "-"}</td>
                    <td className="px-4 py-3 border-b">{b.vehicleModel || b.model || "-"}</td>
                    <td className="px-4 py-3 border-b">{b.serviceDate ? new Date(b.serviceDate).toLocaleDateString() : "-"}</td>
                    <td className="px-4 py-3 border-b">{b.serviceTime || "-"}</td>
                    <td className="px-4 py-3 border-b">{b.createdAt ? new Date(b.createdAt).toLocaleString() : "-"}</td>
                    <td className="px-4 py-3 border-b space-x-2">
                      <button
                        onClick={() => acceptBooking(b._id)}
                        disabled={b.accepted || actionLoadingId === b._id}
                        className={`px-3 py-1.5 rounded-md text-white text-xs font-medium ${b.accepted ? 'bg-green-500 cursor-default' : 'bg-blue-600 hover:bg-blue-700 disabled:opacity-60'}`}
                        title={b.accepted ? `Accepted on ${b.acceptedAt ? new Date(b.acceptedAt).toLocaleString() : ''}` : 'Accept booking'}
                      >
                        {actionLoadingId === b._id ? 'Accepting...' : (b.accepted ? 'Accepted' : 'Accept')}
                      </button>
                      <button
                        onClick={() => removeBooking(b._id)}
                        disabled={deleteLoadingId === b._id}
                        className="px-3 py-1.5 rounded-md bg-red-600 hover:bg-red-700 text-white text-xs font-medium disabled:opacity-60"
                        title="Remove booking"
                      >
                        {deleteLoadingId === b._id ? 'Removing...' : 'Remove'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default ServiceDateBookings;
