import React, { useEffect, useState } from "react";
import axios from "axios";

function TopMembersList({ members }) {
  const max = Math.max(...members.map((m) => m.points || 0), 1);
  const totalPoints = members.reduce((a, b) => a + (b.points || 0), 0);
  const avgPoints = members.length ? Math.round(totalPoints / members.length) : 0;
  return (
    <div className="bg-white p-4 rounded shadow">
      {/* KPI row inside the same white card */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
        <div className="p-3 bg-slate-50 rounded">
          <div className="text-sm text-slate-500">Total Points (top members)</div>
          <div className="text-xl font-bold text-slate-900">{totalPoints.toLocaleString()}</div>
        </div>
        <div className="p-3 bg-slate-50 rounded">
          <div className="text-sm text-slate-500">Top Members Shown</div>
          <div className="text-xl font-bold text-slate-900">{members.length}</div>
        </div>
        <div className="p-3 bg-slate-50 rounded">
          <div className="text-sm text-slate-500">Avg Points (shown)</div>
          <div className="text-xl font-bold text-slate-900">{avgPoints.toLocaleString()}</div>
        </div>
      </div>

      <h3 className="text-lg font-semibold mb-3">Top 10 Members by Points</h3>
      <div className="space-y-3">
        {members.map((m, i) => (
          <div key={m.customerId || m._id || i} className="flex items-center gap-4">
            <div className="w-48 text-sm text-gray-700 truncate">{m.name || m.customerId || "Unknown"}</div>
            <TopMemberBar points={m.points || 0} max={max} />
            <div className="w-20 text-right text-sm text-gray-800">{(m.points || 0).toLocaleString()}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TopMemberBar({ points, max }) {
  const pct = max === 0 ? 0 : (points / max) * 100;
  const [animPct, setAnimPct] = useState(0);

  useEffect(() => {
    let raf = null;
    setAnimPct(0);
    raf = requestAnimationFrame(() => setAnimPct(Math.max(3, pct)));
    return () => {
      if (raf) cancelAnimationFrame(raf);
    };
  }, [pct]);

  return (
    <div className="flex-1 bg-gray-100 rounded overflow-hidden h-8">
      <div
        className="h-8 bg-gradient-to-r from-sky-500 to-indigo-600 text-white flex items-center justify-end pr-3 text-sm transition-all duration-700 ease-out"
        style={{ width: `${animPct}%`, minWidth: "6px" }}
      >
        {points.toLocaleString()}
      </div>
    </div>
  );
}

export default function LoyalityAnalytics() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    const fetchTop = async () => {
      try {
        setLoading(true);
        // use absolute backend URL to avoid depending on dev-server proxy
        const res = await axios.get("http://localhost:5000/loyalty/top-members?limit=10");
        if (!mounted) return;
        const data = res.data && (res.data.members || res.data);
        setMembers(Array.isArray(data) ? data : []);
        setError(null);
      } catch (err) {
        console.error("Failed to load top loyalty members", err);
        if (mounted) {
          const msg = err?.response?.data?.message || err.message || "Failed to load data";
          setError(`Failed to load data: ${msg}`);
          setMembers([]);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchTop();
    const id = setInterval(fetchTop, 15000);
    return () => {
      mounted = false;
      clearInterval(id);
    };
  }, []);

  return (
    <div className="min-h-screen p-6 bg-slate-50">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Loyalty Analytics</h2>
        </div>

        {/* The KPI cards have been moved inside the main white card with the list */}

        {loading && <div className="p-4 bg-white rounded shadow">Loading top members…</div>}
        {error && (
          <div className="p-4 bg-red-50 text-red-700 rounded">
            <div>{error}</div>
            <div className="mt-3">
              <button
                onClick={() => {
                  setError(null);
                  setLoading(true);
                  // trigger immediate fetch by calling the effect's fetch via a tiny hack: setLoading then rely on interval
                  axios
                    .get("http://localhost:5000/loyalty/top-members?limit=10")
                    .then((res) => setMembers(res.data.members || res.data || []))
                    .catch((e) => setError(e?.response?.data?.message || e.message || "Failed to load data"))
                    .finally(() => setLoading(false));
                }}
                className="mt-2 inline-flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {!loading && !error && (
          <>
            {members.length === 0 ? (
              <div className="p-4 bg-white rounded shadow">No loyalty data available yet.</div>
            ) : (
              <TopMembersList members={members} />
            )}
          </>
        )}
      </div>
    </div>
  );
}
