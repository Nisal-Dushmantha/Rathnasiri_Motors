import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SidePanel from "./compononets/SidePanel/SidePanel";
import Dashboard from "./compononets/ServiceAndRepairDashboard/ServiceAndRepairDashboard";
import ServiceJobCard from "./compononets/ServiceJobCard/ServiceJobCard";
import RepairJobCard from "./compononets/RepairJobCard/RepairJobCard";
import AllServiceJobs from "./compononets/AllJobs/AllServiceJobs";
import AllRepairJobs from "./compononets/AllJobs/AllRepairJobs";
import Header from "./compononets/Header/Header";
import Footer from "./compononets/Footer/Footer";
import UpdateServiceCard from "./compononets/UpdateServiceCard/UpdateServiceCard";
import UpdateRepairCard from "./compononets/UpdateRepairCard/UpdateRepairCard";
import Homepage from "./compononets/Homepage/Homepage";
import UserDashboard from "./compononets/UserDashboard/UserDashboard";
import ProductsDashboard from "./compononets/ProductsDashboard/ProductsDashboard";
import InventoryDashboard from "./compononets/InventoryDashboard/InventoryDashboard";
import FinanceDashboard from "./compononets/FinanceDashboard/FinanceDashboard";
import CustomerLoyality from "./compononets/CustomerLoyality/CustomerLoyality";
import UpdateLoyalityPoints from "./compononets/UpdateLoyalityPoints/UpdateLoyalityPoints";
import CustomerDetails from "./compononets/CustomeDetails/CustomerDetails";

function App() {
  return (
    <Router>
      <SidePanel />
      <div className="ml-80">
        <Header />
        <Routes>
          <Route path="/service" element={<Dashboard />} />
          <Route path="/homepage" element={<Homepage />} />
          <Route path="/user" element={<UserDashboard />} />
          <Route path="/products" element={<ProductsDashboard />} />
          <Route path="/inventory" element={<InventoryDashboard />} />
          <Route path="/ServiceJobCard" element={<ServiceJobCard />} />
          <Route path="/finance" element={<FinanceDashboard />} />
          <Route path="/RepairJobCard" element={<RepairJobCard />} />
          <Route path="/AllServiceJobs" element={<AllServiceJobs />} />
          <Route path="/AllRepairJobs" element={<AllRepairJobs />} />
          <Route path="/AllServiceJobs/:id" element={<UpdateServiceCard />} />
          <Route path="/AllRepairJobs/:id" element={<UpdateRepairCard />} />
          <Route path="/CustomerLoyality" element={<CustomerLoyality />} />
          <Route path="/UpdateLoyalityPoints" element={<UpdateLoyalityPoints />} />
          <Route path="/CustomerDetails" element={<CustomerDetails />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
