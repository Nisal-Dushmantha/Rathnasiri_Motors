import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function SparePartsChart() {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    const fetchBills = async () => {
      try {
        setLoading(true);
        const res = await axios.get('http://localhost:5000/spb'); // spare parts bills endpoint
        if (mounted) setBills(Array.isArray(res.data) ? res.data : (res.data.spb || []));
      } catch (err) {
        console.error(err);
        if (mounted) setError(err.message || 'Failed to fetch spare parts bills');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchBills();
    return () => { mounted = false; };
  }, []);

  // Prepare data for last 12 months (whole year view)
  const grouped = useMemo(() => {
    const monthNamesShort = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

    // helper to get last 12 months keys and labels (oldest -> newest)
    const last12 = [];
    const now = new Date();
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;
      const label = `${monthNamesShort[d.getMonth()]} ${d.getFullYear()}`;
      last12.push({ key, label });
    }

    // initialize totals map with zero for each of the last 12 months
    const totals = new Map(last12.map(m => [m.key, 0]));

    bills.forEach(b => {
      if (!b.date) return;
      const d = new Date(b.date);
      const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;
      const amount = Number(b.price || b.total || 0) || 0;
      if (totals.has(key)) {
        totals.set(key, totals.get(key) + amount);
      }
    });

    const labels = [];
    const data = [];
    last12.forEach(m => {
      labels.push(m.label);
      data.push(Number((totals.get(m.key) || 0).toFixed(2)));
    });

    return { labels, data };
  }, [bills]);

  const chartData = useMemo(() => ({
    labels: grouped.labels,
    datasets: [{
      label: 'Monthly Revenue (Rs.)',
      data: grouped.data,
      backgroundColor: 'rgba(16,185,129,0.9)',
      borderColor: 'rgba(6,95,70,0.9)',
      borderWidth: 1
    }]
  }), [grouped]);

  const options = {
    responsive: true,
    animation: {
      duration: 1200,
      easing: 'easeOutQuart'
    },
    // Animate bars to grow from below the visible chart area and add a small stagger per bar
    animations: {
      y: {
        // start slightly below the y-axis minimum so bars appear to rise up from below
        from: (ctx) => {
          try {
            const scale = ctx.chart.scales.y;
            const min = (scale && typeof scale.min === 'number') ? scale.min : 0;
            const max = (scale && typeof scale.max === 'number') ? scale.max : 0;
            const range = Math.max(max - min, 1);
            return min - range * 0.25; // start 25% below the minimum
          } catch (e) {
            return 0;
          }
        },
        delay: (ctx) => ctx.dataIndex * 80
      }
    },
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Spare Parts Monthly Revenue (Last 12 months)' },
      tooltip: {
        callbacks: {
          label: (context) => {
            const val = context.parsed.y ?? context.parsed;
            return `Rs. ${Number(val).toLocaleString()}`;
          }
        }
      }
    },
    scales: {
      y: { beginAtZero: true, title: { display: true, text: 'Revenue (Rs.)' } },
      x: { title: { display: true, text: 'Month' } }
    }
  };

  if (loading) return <div className="p-4">Loading chart...</div>;
  if (error) return <div className="p-4 text-red-600">{error}</div>;

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <Bar options={options} data={chartData} />
    </div>
  );
}

export default SparePartsChart;
