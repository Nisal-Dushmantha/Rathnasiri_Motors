import React from 'react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

function Homepage() {
  const [loading, setLoading] = useState(true)
  const [svcCount, setSvcCount] = useState(0)
  const [repCount, setRepCount] = useState(0)
  const [catalogTotal, setCatalogTotal] = useState(0)
  const [storeUnits, setStoreUnits] = useState(0)
  const [invItemCount, setInvItemCount] = useState(0)
  const [invTotalUnits, setInvTotalUnits] = useState(0)
  const [insActive, setInsActive] = useState(0)

  // Helpers to robustly extract numbers from various API response shapes
  const get = (obj, path) => {
    try {
      return path.split('.').reduce((o, k) => (o && o[k] !== undefined ? o[k] : undefined), obj)
    } catch {
      return undefined
    }
  }
  const toNum = (v) => {
    const n = Number(v)
    return Number.isFinite(n) ? n : 0
  }

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true)
        const urls = [
          'http://localhost:5000/services/count',
          'http://localhost:5000/repairs/count',
          'http://localhost:5000/newBs/count',
          'http://localhost:5000/usedBs/count',
          'http://localhost:5000/newBs/quantity-sum',
          'http://localhost:5000/sp',
          'http://localhost:5000/insurances/total/count',
        ]

        const responses = await Promise.allSettled(urls.map((u) => fetch(u)))

        const parse = async (entry, label) => {
          if (entry.status !== 'fulfilled') {
            console.error(`[Homepage] Fetch failed for ${label}:`, entry.reason)
            return null
          }
          const res = entry.value
          if (!res.ok) {
            console.error(`[Homepage] Non-OK response for ${label}:`, res.status, res.statusText)
            return null
          }
          try {
            const j = await res.json()
            console.log(`[Homepage] ${label} ->`, j)
            return j
          } catch (e) {
            console.error(`[Homepage] JSON parse failed for ${label}:`, e)
            return null
          }
        }

        const [svcJson, repJson, newCountJson, usedCountJson, newQtyJson, spJson, insJson] = await Promise.all([
          parse(responses[0], 'services/count'),
          parse(responses[1], 'repairs/count'),
          parse(responses[2], 'newBs/count'),
          parse(responses[3], 'usedBs/count'),
          parse(responses[4], 'newBs/quantity-sum'),
          parse(responses[5], 'sp'),
          parse(responses[6], 'insurances/total/count'),
        ])

        setSvcCount(toNum(get(svcJson, 'count')) || toNum(get(svcJson, 'total')))
        setRepCount(toNum(get(repJson, 'count')) || toNum(get(repJson, 'total')))

        const catTotal = toNum(get(newCountJson, 'count')) + toNum(get(usedCountJson, 'count'))
        setCatalogTotal(catTotal)

        const units = toNum(get(newQtyJson, 'totalQuantity')) + toNum(get(usedCountJson, 'count'))
        setStoreUnits(units)

        const spItems = Array.isArray(spJson?.sp) ? spJson.sp : (Array.isArray(spJson?.items) ? spJson.items : [])
        setInvItemCount(spItems.length)
        const sumUnits = spItems.reduce((acc, it) => acc + (Number(it.Quentity) || 0), 0)
        setInvTotalUnits(sumUnits)

        setInsActive(toNum(get(insJson, 'total')) || toNum(get(insJson, 'count')))
      } catch (e) {
        // keep defaults on error
        console.error('[Homepage] Unexpected error during fetchAll:', e)
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [])

  return (
    <div className="flex-1 bg-white p-10 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-bold text-blue-900">Overview</h1>
        <div className="flex gap-3">
          <Link to="/products">
            <button className="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white text-blue-700 font-semibold py-2 px-6 hover:bg-blue-50 transition shadow-sm">Products</button>
          </Link>
          <Link to="/inventory">
            <button className="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white text-blue-700 font-semibold py-2 px-6 hover:bg-blue-50 transition shadow-sm">Inventory</button>
          </Link>
          <Link to="/service">
            <button className="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white text-blue-700 font-semibold py-2 px-6 hover:bg-blue-50 transition shadow-sm">Service & Repair</button>
          </Link>
          <Link to="/insurance">
            <button className="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white text-blue-700 font-semibold py-2 px-6 hover:bg-blue-50 transition shadow-sm">Insurance</button>
          </Link>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="mb-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Total Jobs (Service + Repair) */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-blue-600">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-blue-900 mb-1">Total Jobs</h2>
              <p className="text-gray-600">Service + Repair (completed and ongoing)</p>
            </div>
            <div className="text-right">
              {loading ? (
                <div className="text-3xl font-bold text-blue-900 animate-pulse">Loading...</div>
              ) : (
                <div className="text-4xl font-bold text-blue-900">{(svcCount || 0) + (repCount || 0)}</div>
              )}
              <p className="text-sm text-gray-500 mt-1">Jobs</p>
            </div>
          </div>
        </div>

        {/* Catalog Bikes */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-blue-600">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-blue-900 mb-1">Bikes in Catalog</h2>
              <p className="text-gray-600">New + used models</p>
            </div>
            <div className="text-right">
              {loading ? (
                <div className="text-3xl font-bold text-blue-900 animate-pulse">Loading...</div>
              ) : (
                <div className="text-4xl font-bold text-blue-900">{catalogTotal}</div>
              )}
              <p className="text-sm text-gray-500 mt-1">Models</p>
            </div>
          </div>
        </div>

        {/* Store Units */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-blue-600">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-blue-900 mb-1">Bikes in Store</h2>
              <p className="text-gray-600">Total stock units</p>
            </div>
            <div className="text-right">
              {loading ? (
                <div className="text-3xl font-bold text-blue-900 animate-pulse">Loading...</div>
              ) : (
                <div className="text-4xl font-bold text-blue-900">{storeUnits}</div>
              )}
              <p className="text-sm text-gray-500 mt-1">Units</p>
            </div>
          </div>
        </div>

        {/* Inventory Items */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-blue-600">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-blue-900 mb-1">Inventory Items</h2>
              <p className="text-gray-600">Spare parts categories</p>
            </div>
            <div className="text-right">
              {loading ? (
                <div className="text-3xl font-bold text-blue-900 animate-pulse">Loading...</div>
              ) : (
                <div className="text-4xl font-bold text-blue-900">{invItemCount}</div>
              )}
              <p className="text-sm text-gray-500 mt-1">Items</p>
            </div>
          </div>
        </div>

        {/* Inventory Units */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-blue-600">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-blue-900 mb-1">Inventory Units</h2>
              <p className="text-gray-600">Total quantity</p>
            </div>
            <div className="text-right">
              {loading ? (
                <div className="text-3xl font-bold text-blue-900 animate-pulse">Loading...</div>
              ) : (
                <div className="text-4xl font-bold text-blue-900">{invTotalUnits}</div>
              )}
              <p className="text-sm text-gray-500 mt-1">Units</p>
            </div>
          </div>
        </div>

        {/* Active Insurances */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-blue-600">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-blue-900 mb-1">Active Insurances</h2>
              <p className="text-gray-600">Policies & registrations</p>
            </div>
            <div className="text-right">
              {loading ? (
                <div className="text-3xl font-bold text-blue-900 animate-pulse">Loading...</div>
              ) : (
                <div className="text-4xl font-bold text-blue-900">{insActive}</div>
              )}
              <p className="text-sm text-gray-500 mt-1">Records</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link to="/NewBikesForm" className="block">
          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm hover:shadow-md hover:bg-blue-50 hover:border-blue-200 transition-all">
            <div className="text-blue-900 font-semibold mb-1">Add New Bike</div>
            <div className="text-gray-600 text-sm">Create a brand new bike entry</div>
          </div>
        </Link>
        <Link to="/SparePartsForm" className="block">
          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm hover:shadow-md hover:bg-blue-50 hover:border-blue-200 transition-all">
            <div className="text-blue-900 font-semibold mb-1">Add Spare Part</div>
            <div className="text-gray-600 text-sm">Update inventory with a new part</div>
          </div>
        </Link>
        <Link to="/ServiceJobCard" className="block">
          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm hover:shadow-md hover:bg-blue-50 hover:border-blue-200 transition-all">
            <div className="text-blue-900 font-semibold mb-1">New Service Job</div>
            <div className="text-gray-600 text-sm">Create a service job card</div>
          </div>
        </Link>
        <Link to="/NewInsurances" className="block">
          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm hover:shadow-md hover:bg-blue-50 hover:border-blue-200 transition-all">
            <div className="text-blue-900 font-semibold mb-1">New Insurance</div>
            <div className="text-gray-600 text-sm">Add a policy/registration</div>
          </div>
        </Link>
      </div>
    </div>
  )
}

export default Homepage
