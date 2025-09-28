import React, { useEffect, useState, useMemo } from "react";

function ServiceRepairBillsList() {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState({});
  
  // Month names for display
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  useEffect(() => {
    let isMounted = true;
    const fetchBills = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch("http://localhost:5000/service-repair-bills");
        if (!res.ok) throw new Error("Failed to load bills");
        const data = await res.json();
        if (isMounted) setBills(Array.isArray(data) ? data : []);
      } catch (e) {
        if (isMounted) setError(e.message || "Failed to load bills");
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchBills();
    return () => { isMounted = false; };
  }, []);

  const toggleExpand = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const formatMoney = (n) => Number(n || 0).toFixed(2);
  const getId = (b, idx) => b._id || `${b.bill_no || 'LEG'}-${idx}`;
  
  // Group bills by month and year
  const groupedBillsByMonth = useMemo(() => {
    const groups = {};
    
    bills.forEach(bill => {
      if (!bill.date) return;
      
      const date = new Date(bill.date);
      const month = date.getMonth();
      const year = date.getFullYear();
      const key = `${year}-${month}`;
      
      if (!groups[key]) {
        groups[key] = {
          monthName: monthNames[month],
          year,
          bills: []
        };
      }
      
      groups[key].bills.push(bill);
    });
    
    // Convert to array and sort by date (most recent first)
    return Object.values(groups).sort((a, b) => {
      return (b.year - a.year) || (b.month - a.month);
    });
  }, [bills, monthNames]);

  // Function to render a single bill
  const renderBill = (b, i) => {
    const id = getId(b, i);
    const isNew = Array.isArray(b.services) && b.services.length > 0;
    const total = isNew 
      ? (b.total ?? b.services.reduce((s, r) => s + (Number(r.price || 0)), 0)) 
      : (Number(b.price || 0));
    const date = b.date ? new Date(b.date).toISOString().slice(0, 10) : "-";
    const title = isNew ? `${b.bill_no || "-"} — ${b.customerName || "Unknown"}` : `${b.bill_no || "-"} — ${b.name || "-"}`;
    
    return (
      <div key={id} className="border border-slate-200 rounded-xl overflow-hidden">
        <button
          onClick={() => toggleExpand(id)}
          className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 hover:bg-slate-100"
          aria-expanded={!!expanded[id]}
        >
          <div className="text-left">
            <div className="text-sm text-slate-500">{date}</div>
            <div className="text-base font-semibold text-slate-900">{title}</div>
            {isNew && b.type && (
              <div className="text-xs mt-1 inline-block px-2 py-1 rounded bg-blue-100 text-blue-800">
                {b.type === 'repair' ? 'Repair' : 'Service'}
              </div>
            )}
          </div>
          <div className="text-right">
            <div className="text-xs text-slate-500">Total</div>
            <div className="font-semibold">{formatMoney(total)}</div>
          </div>
        </button>

        {expanded[id] && (
          <div className="px-4 py-3">
            {isNew ? (
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="text-sm text-slate-600">
                      <th className="text-left py-2">{b.type === 'repair' ? 'Repair' : 'Service'} Description</th>
                      <th className="text-right py-2">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {b.services.map((r, idx2) => (
                      <tr key={idx2} className="odd:bg-white even:bg-slate-50">
                        <td className="py-2 pr-2">{r.detail || "-"}</td>
                        <td className="py-2 pr-2 text-right">{formatMoney(r.price)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-slate-700">
                <div>Bill No: {b.bill_no || "-"}</div>
                <div>Customer: {b.customerName || "-"}</div>
                <div>Type: {b.type === 'repair' ? 'Repair' : 'Service'}</div>
                <div>Date: {date}</div>
                <div>Total: {formatMoney(total)}</div>
                {b.notes && <div>Notes: {b.notes}</div>}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white p-6">
      <div className="max-w-6xl mx-auto bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-slate-900">Service & Repair Bills</h1>
          <div className="flex gap-2">
            <div className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-800">
              Service
            </div>
            <div className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-800">
              Repair
            </div>
          </div>
        </div>

        {loading && <div className="text-slate-600">Loading...</div>}
        {error && (
          <div className="p-4 mb-4 rounded-lg bg-red-50 text-red-700 border border-red-200" role="alert">
            {error}
          </div>
        )}

        {!loading && !error && bills.length === 0 && (
          <div className="text-slate-600">No bills found.</div>
        )}

        {!loading && !error && bills.length > 0 && (
          <div className="space-y-8">
            {groupedBillsByMonth.map((monthGroup, idx) => (
              <div key={`${monthGroup.year}-${monthGroup.monthName}`} className="mb-6">
                <h2 className="text-xl font-semibold text-blue-800 mb-3 pb-2 border-b">
                  {monthGroup.monthName} {monthGroup.year}
                </h2>
                <div className="space-y-3">
                  {monthGroup.bills.map((b, i) => renderBill(b, i))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ServiceRepairBillsList;