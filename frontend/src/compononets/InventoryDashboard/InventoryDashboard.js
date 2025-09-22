import React, { useEffect, useState } from 'react'
import { Link } from "react-router-dom"; 
import axios from 'axios';

function  InventoryDashboard() {
  const [totalUnits, setTotalUnits] = useState(null);
  const [loadingTotal, setLoadingTotal] = useState(true);
  const [itemCount, setItemCount] = useState(null);
  const [lowStockCount, setLowStockCount] = useState(0);
  const [lowStockItems, setLowStockItems] = useState([]);
  const [showLowStock, setShowLowStock] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchTotals = async () => {
      try {
        const res = await axios.get('http://localhost:5000/sp');
        const items = res?.data?.sp || [];
        const sum = items.reduce((acc, item) => acc + (Number(item.Quentity) || 0), 0);
        if (isMounted) {
          setTotalUnits(sum);
          setItemCount(items.length);
        }
      } catch (e) {
        if (isMounted) {
          setTotalUnits(null);
          setItemCount(null);
        }
      } finally {
        if (isMounted) setLoadingTotal(false);
      }
    };
    const fetchLowStock = async () => {
      try {
        const res = await axios.get('http://localhost:5000/sp/low-stock?threshold=5');
        if (isMounted) {
          setLowStockCount(res?.data?.count || 0);
          setLowStockItems(res?.data?.items || []);
        }
      } catch (e) {
        if (isMounted) {
          setLowStockCount(0);
          setLowStockItems([]);
        }
      }
    };
    fetchTotals();
    fetchLowStock();
    return () => { isMounted = false; };
  }, []);
  return (
    <div className="flex-1 bg-white p-10 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-12">
        <div className="relative">
          <h1 className="text-4xl font-bold text-blue-900">Inventory Dashboard</h1>
        </div>
        <div className="flex gap-3 items-center">
          {/* Low-stock notification control placed near the Add New button */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowLowStock((v) => !v)}
              className="w-10 h-10 rounded-full bg-white shadow border border-gray-200 flex items-center justify-center hover:bg-gray-50"
              aria-label="Low stock notifications"
            >
              {/* Bell emoji as requested */}
              <span className="text-2xl" aria-hidden="true">🔔</span>
              {lowStockCount > 0 && (
                <span className="absolute -top-1 -right-1 inline-flex items-center justify-center w-5 h-5 text-[10px] font-bold text-white bg-red-600 rounded-full">
                  {lowStockCount}
                </span>
              )}
            </button>
            {showLowStock && (
              <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-xl shadow-lg z-20">
                <div className="p-3 border-b border-gray-100 flex items-center justify-between">
                  <span className="font-semibold text-gray-800">Low Stock</span>
                  <span className="text-xs text-gray-500">Below 5</span>
                </div>
                <div className="max-h-64 overflow-auto">
                  {lowStockItems.length === 0 ? (
                    <div className="p-4 text-sm text-gray-500">No low stock items</div>
                  ) : (
                    lowStockItems.map((item) => (
                      <div key={item._id} className="px-4 py-3 flex items-center justify-between hover:bg-gray-50">
                        <div className="min-w-0">
                          <div className="text-sm font-medium text-gray-900 truncate">{item.name}</div>
                          <div className="text-xs text-gray-500 truncate">Brand: {item.brand} • Rack: {item.rack}</div>
                        </div>
                        <span className="ml-3 inline-flex items-center justify-center px-2 py-1 text-xs font-semibold text-red-700 bg-red-100 rounded-full">
                          Qty: {item.Quentity}
                        </span>
                      </div>
                    ))
                  )}  
                </div>
              </div>
            )}
          </div>
          <Link to="/SparePartsForm">
            <button className="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white text-blue-700 font-semibold py-2 px-6 hover:bg-blue-50 transition shadow-sm">+ Add New</button>
          </Link>
          <Link to="">
            <button className="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white text-blue-700 font-semibold py-2 px-6 hover:bg-blue-50 transition shadow-sm">Summary</button>
          </Link>
        </div>
      </div>

      {/* Metric Panel */}
      <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Spare Parts Count Card (left) */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-blue-600 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-blue-900 mb-2">Spare Parts Category</h2>
            <p className="text-gray-600">Number of distinct items</p>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold text-blue-900">{loadingTotal ? '—' : (itemCount ?? '—')}</div>
            <p className="text-sm text-gray-500 mt-1">Items</p>
          </div>
        </div>

        {/* Total Units Card (right) */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-blue-600 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-blue-900 mb-2">Total Items in Inventory</h2>
            <p className="text-gray-600">Sum of all quantities</p>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold text-blue-900">{loadingTotal ? '—' : (totalUnits ?? '—')}</div>
            <p className="text-sm text-gray-500 mt-1">Total Units</p>
          </div>
        </div>
      </div>

      {/* Top Card Layer */}
      <div className="grid grid-cols-1 md:grid-cols-1 gap-8 mb-8">
        <div className="flex flex-col justify-between bg-white rounded-3xl shadow-lg border border-gray-100 p-8 transition-all min-h-[350px]">
          <h2 className="text-2xl font-bold mb-4 text-blue-800">Inventory</h2>
          <p className="text-gray-700 text-lg mb-6">Add and manage Spare Parts inventory</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col justify-between bg-white text-blue-800 p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:bg-blue-50 hover:border-blue-200 transition-all cursor-pointer min-h-[140px]">
              <h3 className="font-semibold text-lg text-blue-900">Spare Parts</h3>
              <p className="text-sm mt-1 text-gray-600">Add Spare Parts</p>
              <Link to="/SparePartsForm">
                <button className="mt-4 inline-flex items-center justify-center bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition shadow-sm">Add</button>
              </Link>
            </div>
            <div className="flex flex-col justify-between bg-white text-blue-800 p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:bg-blue-50 hover:border-blue-200 transition-all cursor-pointer min-h-[140px]">
              <h3 className="font-semibold text-lg text-blue-900">Update Details</h3>
              <p className="text-sm mt-1 text-gray-600">Add Any Changes</p>
              <Link to="/SparePartsUpdate">
                <button className="mt-4 inline-flex items-center justify-center bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition shadow-sm">Go</button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Card Layer */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="flex flex-col justify-between bg-white rounded-3xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-all min-h-[350px]">
          <h2 className="text-2xl font-bold mb-4 text-blue-800">Spare Parts Overview</h2>
          <p className="text-gray-700 text-lg">This page provides a detailed inventory of spare parts, including barcode, name, brand, quantity, and price.The clear layout ensures easy access for monitoring and updating spare parts information.</p>
          <div className="mt-auto flex gap-4">
            <Link to="/SparePartsDisplay" className="flex-1">
              <button className="w-full bg-blue-600 text-white py-3 px-6 rounded-xl hover:bg-blue-700 transition shadow-sm">View</button>
            </Link>
            <Link to="/SparePartBill" className="flex-1">
              <button className="w-full bg-blue-600 text-white py-3 px-6 rounded-xl hover:bg-blue-700 transition shadow-sm">Generate Bill</button>
            </Link>
          </div>
        </div>
      <div className="flex flex-col justify-between bg-white rounded-3xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-all min-h-[350px]">
         <h2 className="text-2xl font-bold mb-4 text-blue-800">Reports & Summary</h2>
         <p className="text-gray-700 text-lg">This section shows a monthly summary of spare parts, covering stock levels, usage, and pricing trends. A chart overview displays part quantities for quick comparison and smarter restocking decisions."."</p>
         <div className="mt-auto flex gap-4">
            
              <button className="w-full bg-blue-600 text-white py-3 px-6 rounded-xl hover:bg-blue-700 transition shadow-sm"> Monthly Summary</button>
            
            
              <button className="w-full bg-blue-600 text-white py-3 px-6 rounded-xl hover:bg-blue-700 transition shadow-sm">Summary Charts</button>
            
          </div>
      </div>
    </div>
  </div>
  );
}

export default InventoryDashboard
