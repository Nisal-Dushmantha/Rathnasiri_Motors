import React, { useEffect, useState } from "react";
import axios from "axios";

function VerticalBar({ value, max, label, onClick }) {
  const pct = max === 0 ? 0 : (value / max) * 100;
  const [animPct, setAnimPct] = useState(0);

  useEffect(() => {
    let raf = null;
    // start from 0 then animate to target on next frame for CSS transition
    setAnimPct(0);
    raf = requestAnimationFrame(() => setAnimPct(Math.max(6, pct)));
    return () => {
      if (raf) cancelAnimationFrame(raf);
    };
  }, [pct]);

  return (
    <div className="flex flex-col items-center" style={{ width: 72 }}>
      <div className="text-sm font-semibold text-slate-800 mb-1">{value}</div>
      <button onClick={onClick} className="w-full flex flex-col items-center" aria-label={`Month ${label} value ${value}`}>
        <div className="h-44 w-full flex items-end">
          <div
            className="w-full rounded-t-md shadow transition-all duration-700 ease-out"
            style={{ height: `${animPct}%`, background: value ? "linear-gradient(180deg,#06b6d4,#0891b2)" : "#f1f5f9" }}
            title={`${label}: ${value}`}
          />
        </div>
        <div className="text-xs text-slate-600 mt-2 text-center truncate w-full">{label}</div>
      </button>
    </div>
  );
}

function CustomerAnalytics() {
  const [loading, setLoading] = useState(true);
  const [months, setMonths] = useState([]); // { label, start, end }
  const [counts, setCounts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [selectedMonthIndex, setSelectedMonthIndex] = useState(null);
  const [year, setYear] = useState(new Date().getFullYear());
  const [errorMessage] = useState(null);

  useEffect(() => {
    // build 12 calendar months for the selected year (Jan..Dec)
    const m = [];
    for (let month = 0; month < 12; month++) {
      const start = new Date(year, month, 1);
      const end = new Date(year, month + 1, 1);
      m.push({ label: start.toLocaleString(undefined, { month: "short" }), start, end });
    }
    setMonths(m);
  }, [year]);

  useEffect(() => {
    let mounted = true;
    const fetchAll = async () => {
      setLoading(true);
      try {
        const res = await axios.get("http://localhost:5000/customers");
        const list = Array.isArray(res.data) ? res.data : [];
        if (!mounted) return;
        setCustomers(list);

        // compute counts per month window
        const c = months.map(({ start, end }) => {
          return list.reduce((acc, cust) => {
            let created = null;
            if (cust.createdAt) created = new Date(cust.createdAt);
            else if (cust._id && typeof cust._id === "string" && cust._id.length >= 8) {
              const ts = parseInt(cust._id.substring(0, 8), 16) * 1000;
              created = new Date(ts);
            }
            if (!created) return acc;
            return created >= start && created < end ? acc + 1 : acc;
          }, 0);
        });
        setCounts(c);
      } catch (err) {
        console.error(err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchAll();
    const interval = setInterval(fetchAll, 10000); // refresh every 10s
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [months]);

  const total = counts.reduce((a, b) => a + b, 0);
  const max = Math.max(...counts, 1);
  const highestIndex = counts.indexOf(Math.max(...counts));

  const customersForMonth = (idx) => {
    if (idx == null) return [];
    const { start, end } = months[idx];
    return customers.filter((cust) => {
      let created = null;
      if (cust.createdAt) created = new Date(cust.createdAt);
      else if (cust._id && typeof cust._id === "string") {
        const ts = parseInt(cust._id.substring(0, 8), 16) * 1000;
        created = new Date(ts);
      }
      return created && created >= start && created < end;
    });
  };

  return (
    <div className="min-h-screen p-8 bg-slate-50">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Revenue Analysis</h1>
            <p className="text-sm text-slate-600">Monthly Registrations for {year}</p>
          </div>
          <div>
            <select value={year} onChange={(e) => setYear(Number(e.target.value))} className="border rounded p-2">
              {Array.from({ length: 5 }).map((_, i) => {
                const y = new Date().getFullYear() - i;
                return <option key={y} value={y}>{y}</option>;
              })}
            </select>
          </div>
        </div>

        <div className="bg-white rounded-lg border p-6 flex gap-6">
          <div className="flex-1">
            <div className="text-center text-lg font-semibold mb-4">Monthly Registrations for {year}</div>
            <div className="p-4">
              {loading ? (
                <div className="h-48 flex items-center justify-center">Loading...</div>
              ) : (
                <>
                  <div className="flex items-end gap-4 h-64">
                    {months.map((m, idx) => (
                      <VerticalBar
                        key={m.label}
                        value={counts[idx] || 0}
                        max={max}
                        label={m.label}
                        onClick={() => setSelectedMonthIndex(idx)}
                      />
                    ))}
                  </div>
                  {/* show numbers below bars */}
                  <div className="mt-3 grid grid-cols-12 gap-2 text-xs text-slate-700">
                    {months.map((m, idx) => (
                      <div key={m.label} className="col-span-1 text-center truncate">{counts[idx] || 0}</div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          <aside className="w-80">
            <div className="bg-slate-50 p-4 rounded border">
              {errorMessage && <div className="text-red-600 mb-2">{errorMessage}</div>}
              <h3 className="text-lg font-semibold mb-3">Annual Summary for {year}</h3>
              <div className="text-sm text-slate-600 mb-2">Total Registrations:</div>
              <div className="text-2xl font-bold text-slate-900 mb-4">{total}</div>

              <div className="text-sm text-slate-600">Highest Registration Month:</div>
              <div className="mt-2 p-3 bg-white rounded shadow-sm">
                <div className="flex justify-between items-center">
                  <div>{months[highestIndex]?.label || "—"}</div>
                  <div className="text-green-600 font-semibold">{counts[highestIndex] || 0}</div>
                </div>
              </div>
              <div className="mt-4 text-sm">
                <div className="font-semibold mb-2">Counts by month</div>
                <div className="text-xs text-slate-600">
                  {months.map((m, idx) => (
                    <div key={m.label} className="flex justify-between">
                      <span>{m.label}</span>
                      <span>{counts[idx] || 0}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        </div>

        {/* Modal - list customers for selected month */}
        {selectedMonthIndex != null && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-3/4 max-w-3xl p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Customers in {months[selectedMonthIndex].label} {year}</h2>
                <button onClick={() => setSelectedMonthIndex(null)} className="text-sm text-slate-500">Close</button>
              </div>
              <div className="max-h-96 overflow-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="text-sm text-slate-600">
                      <th className="py-2">Customer ID</th>
                      <th>Name</th>
                      <th>Contact</th>
                      <th>Email</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customersForMonth(selectedMonthIndex).map((c) => (
                      <tr key={c._id} className="border-t">
                        <td className="py-2">{c.customerId}</td>
                        <td>{c.customerName}</td>
                        <td>{c.contactNumber}</td>
                        <td>{c.email}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CustomerAnalytics;
