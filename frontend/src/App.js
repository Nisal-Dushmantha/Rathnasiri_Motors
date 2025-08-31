// App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Common components
import SidePanel from "./compononets/SidePanel/SidePanel";
import Header from "./compononets/Header/Header";
import Footer from "./compononets/Footer/Footer";

// Dashboards
import Homepage from "./compononets/Homepage/Homepage";
import Dashboard from "./compononets/ServiceAndRepairDashboard/ServiceAndRepairDashboard";
import UserDashboard from "./compononets/UserDashboard/UserDashboard";
import ProductsDashboard from "./compononets/ProductsDashboard/ProductsDashboard";
import InventoryDashboard from "./compononets/InventoryDashboard/InventoryDashboard";
import FinanceDashboard from "./compononets/FinanceDashboard/FinanceDashboard";
import InsuranceDashboard from "./compononets/InsuranceAndRegistrationDashboard/InsuranceAndRegistrationDashboard";

// Job cards
import ServiceJobCard from "./compononets/ServiceJobCard/ServiceJobCard";
import RepairJobCard from "./compononets/RepairJobCard/RepairJobCard";

// All jobs
import AllServiceJobs from "./compononets/AllJobs/AllServiceJobs";
import AllRepairJobs from "./compononets/AllJobs/AllRepairJobs";

// Update job cards
import UpdateServiceCard from "./compononets/UpdateServiceCard/UpdateServiceCard";
import UpdateRepairCard from "./compononets/UpdateRepairCard/UpdateRepairCard";

// PDF/Document page
import RepairDocument from "./compononets/RepairDocument/RepairDocument";
import ServiceDocument from "./compononets/ServiceDocument/ServiceDocument";
// BrandNew bikes form
import NewBikesForm from "./compononets/NewBikesForm/NewBikesForm"; 
import NewBikes from "./compononets/NewBikes/NewBikes";
import UpdateNewBike from "./compononets/UpdateNewBike/UpdateNewBike";

import UsedBikesForm from "./compononets/UsedBikesForm/UsedBikesForm";
import UsedBikes from "./compononets/UsedBikes/UsedBikes";
import UpdateUsedBike from "./compononets/UpdateUsedBike/UpdateUsedBike";


function App() {
  return (
    <Router>
      {/* Sidebar stays persistent */}
      <SidePanel />
      
      <div className="ml-80">
        <Header />

        <Routes>
          {/* Dashboards */}
          <Route path="/homepage" element={<Homepage />} />
          <Route path="/service" element={<Dashboard />} />
          <Route path="/user" element={<UserDashboard />} />
          <Route path="/products" element={<ProductsDashboard />} />
          <Route path="/inventory" element={<InventoryDashboard />} />
          <Route path="/finance" element={<FinanceDashboard />} />
          <Route path="/insurance" element={<InsuranceDashboard />} />

          {/* Job cards */}
          <Route path="/ServiceJobCard" element={<ServiceJobCard />} />
          <Route path="/RepairJobCard" element={<RepairJobCard />} />

          {/* All jobs */}
          <Route path="/AllServiceJobs" element={<AllServiceJobs />} />
          <Route path="/AllRepairJobs" element={<AllRepairJobs />} />

          {/* Update jobs */}
          <Route path="/AllServiceJobs/:id" element={<UpdateServiceCard />} />
          <Route path="/AllRepairJobs/:id" element={<UpdateRepairCard />} />

          {/* Repair job PDF document */}
          <Route path="/RepairDocument/:id" element={<RepairDocument />} />
          {/* Service job PDF document */}
          <Route path="/ServiceDocument/:id" element={<ServiceDocument />} />
          {/* new bikes form */}
          <Route path="/NewBikesForm" element={<NewBikesForm />} />
          <Route path="/NewBikes" element={<NewBikes />} />
          <Route path="/UpdateNewBike/:id" element={<UpdateNewBike />} />

          <Route path="/UsedBikesForm" element={<UsedBikesForm />} />
          <Route path="/UsedBikes" element={< UsedBikes />}/>
          <Route path="/UpdateUsedBike/:id" element={<UpdateUsedBike />} />
        </Routes>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
