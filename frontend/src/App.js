// App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";

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
import VehicleHistory from "./compononets/VehicleHistory/VehicleHistory";

// Update job cards
import UpdateServiceCard from "./compononets/UpdateServiceCard/UpdateServiceCard";
import UpdateRepairCard from "./compononets/UpdateRepairCard/UpdateRepairCard";

// PDF/Document page
import RepairDocument from "./compononets/RepairDocument/RepairDocument";
import ServiceDocument from "./compononets/ServiceDocument/ServiceDocument";

// BrandNew bikes
import NewBikesForm from "./compononets/NewBikesForm/NewBikesForm"; 
import NewBikes from "./compononets/NewBikes/NewBikes";
import UpdateNewBike from "./compononets/UpdateNewBike/UpdateNewBike";

// Used bikes
import UsedBikesForm from "./compononets/UsedBikesForm/UsedBikesForm";
import UsedBikes from "./compononets/UsedBikes/UsedBikes";
import UpdateUsedBike from "./compononets/UpdateUsedBike/UpdateUsedBike";

// New Bikes Sales
import BikesSalesHisForm from "./compononets/BikesSalesHisForm/BikesSalesHisForm"; 
import BikesSalesHistory from "./compononets/BikesSalesHistory/BikesSalesHistory";

// Other pages
import Index from "./compononets/Index/Index";
import CustomerDetails from "./compononets/CustomeDetails/CustomerDetails";
import CustomerLoyalty from "./compononets/CustomerLoyality/CustomerLoyality";

import CustomerHomepage from "./compononets/CustomerHomepage/CustomerHomepage";
import Login from "./compononets/Login/Login";
import Register from "./compononets/Register/Register";
import CustomerBrandNewBikes from "./compononets/CustomerBikes/CustomerBrandNewBikes";
import CustomerUsedBikes from "./compononets/CustomerBikes/CustomerUsedBikes";
import CustomerSpareParts from "./compononets/CustomerSpareParts/CustomerSpareParts";
import CustomerServiceDates from "./compononets/CustomerServiceDates/CustomerServiceDates";
import CustomerAboutUs from "./compononets/CustomerAboutUs/CustomerAboutUs";

function Layout() {
  const location = useLocation();

  // Hide sidebar, header, and footer only on "/"
  const isIndexPage = location.pathname === "/" || location.pathname === "/Login" 
  || location.pathname === "/Register" || location.pathname === "/CustomerHomepage" || location.pathname === "/Index" ||
  location.pathname === "/CustomerBrandNewBikes" || location.pathname === "/CustomerUsedBikes" || location.pathname === "/CustomerSpareParts"
  || location.pathname === "/CustomerServiceDates" || location.pathname === "/CustomerAboutUs";

  return (
    <>
      {!isIndexPage && <SidePanel />}
      <div className={!isIndexPage ? "ml-80" : ""}>
        {!isIndexPage && <Header />}

        <Routes>
          {/* Default index page */}
          <Route path="/" element={<Index />} />

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
          <Route path="/VehicleHistory" element={<VehicleHistory />} />

          {/* Update jobs */}
          <Route path="/AllServiceJobs/:id" element={<UpdateServiceCard />} />
          <Route path="/AllRepairJobs/:id" element={<UpdateRepairCard />} />

          {/* PDF Documents */}
          <Route path="/RepairDocument/:id" element={<RepairDocument />} />
          <Route path="/ServiceDocument/:id" element={<ServiceDocument />} />

          {/* New bikes */}
          <Route path="/NewBikesForm" element={<NewBikesForm />} />
          <Route path="/NewBikes" element={<NewBikes />} />
          <Route path="/UpdateNewBike/:id" element={<UpdateNewBike />} />

          {/* Used bikes */}
          <Route path="/UsedBikesForm" element={<UsedBikesForm />} />
          <Route path="/UsedBikes" element={<UsedBikes />} />
          <Route path="/UpdateUsedBike/:id" element={<UpdateUsedBike />} />

          {/* Sales */}
          <Route path="/BikesSalesHisForm/:id" element={<BikesSalesHisForm />} />
          <Route path="/BikesSalesHistory" element={<BikesSalesHistory />} />

          {/* Customers */}
          <Route path="/CustomerDetails" element={<CustomerDetails />} />
          <Route path="/CustomerLoyalty" element={<CustomerLoyalty />} />

          <Route path="/CustomerHomepage" element={<CustomerHomepage />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Register" element={<Register />} />
          <Route path="Index" element={<Index />} />

          {/*Customer Routes */}
          <Route path="/CustomerHomepage" element={<CustomerHomepage />} /> 
          <Route path="/CustomerBrandNewBikes" element={<CustomerBrandNewBikes />} />
          <Route path="/CustomerUsedBikes" element={<CustomerUsedBikes/>} />
          <Route path="/CustomerSpareParts" element={<CustomerSpareParts />} />
          <Route path="/CustomerServiceDates" element={<CustomerServiceDates />} />
          <Route path="/CustomerAboutUs" element={<CustomerAboutUs />} />

        </Routes>

        {!isIndexPage && <Footer />}
      </div>
    </>
  );
}

function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}

export default App;
