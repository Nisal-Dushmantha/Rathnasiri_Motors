import React from 'react'
import { Link } from "react-router-dom";
import background1 from "../uploads/background1.mp4"; // import video

function Index() {
  return (
    <div className="relative min-h-screen flex flex-col">
      
      {/* Background video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover -z-10"
      >
        <source src={background1} type="video/mp4" />
      </video>

      {/* Top-right login button */}
      <div className="absolute top-6 right-6 z-20">
        <Link to="/Login">
          <button className="bg-white text-blue-800 font-bold py-2 px-6 rounded-xl 
                             hover:bg-blue-700 hover:text-white transition">
            Login as Admin
          </button>
        </Link>
      </div>

      {/* Center card */}
      <div className="flex flex-1 items-center justify-center z-10">
        <div className="bg-white bg-opacity-90 shadow-2xl rounded-2xl p-8 text-center max-w-md w-full">
          <h1 className="text-4xl font-bold text-blue-900 mb-6">
            Welcome to <br />Rathnasiri Motors
          </h1>
          <Link to="/CustomerHomepage">
            <button className="bg-blue-800 text-white font-semibold py-2 px-8 rounded-xl 
                               hover:bg-blue-700 transition">
              Get Started
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Index
