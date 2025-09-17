import React from 'react'
import { Link } from "react-router-dom";

function Index() {
  return (
    <div>
      <div className="flex items-center justify-center h-screen">
        <h1 className="text-5xl font-bold text-blue-900">Welcome to Rathnasiri Motors Dashboard</h1>
        <Link to="/CustomerHomepage"><button className="ml-6 bg-blue-800 text-white font-semibold py-2 px-6 rounded-xl hover:bg-blue-700 transition">Get Started</button></Link>
        <Link to="/Login"><button className="ml-6 bg-blue-800 text-white font-semibold py-2 px-6 rounded-xl hover:bg-blue-700 transition">Login as A Admin</button></Link>
     </div>
    </div>
  )
}

export default Index
