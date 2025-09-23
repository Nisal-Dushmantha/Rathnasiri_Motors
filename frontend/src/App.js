// App.js
import React, { useEffect, useRef, useState } from "react";
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

// Sales Bike Form
import SalesBikeForm from "./compononets/SalesBikeForm/SalesBikeForm";
import BikeSalesReport from "./compononets/BikeSalesReport/BikeSalesReport";
import BikeReportView from "./compononets/BikeReportView/BikeReportView";

// Bike Summary
import BikeSummary from "./compononets/BikeSummary/BikeSummary";

// Other pages
import Index from "./compononets/Index/Index";
import CustomerDetails from "./compononets/CustomeDetails/CustomerDetails";
import CustomerLoyalty from "./compononets/CustomerLoyality/CustomerLoyality";

// Inventory insert form
import SparePartsForm from "./compononets/SparePartsForm/SparePartsForm";
import SparePartsDisplay from "./compononets/SpareParts/SparePartsDisplay";
import SparePartsUpdate from "./compononets/SparePartsUpdate/SparePartsUpdate";
import SparePartsViewForm from "./compononets/SparePartsView/SparePartsViewForm";
import SparePartBill from "./compononets/SparePartBill/SparePartBill";

// Customer & Auth
import CustomerHomepage from "./compononets/CustomerHomepage/CustomerHomepage";
import Login from "./compononets/Login/Login";
import Register from "./compononets/Register/Register";
import CustomerBrandNewBikes from "./compononets/CustomerBikes/CustomerBrandNewBikes";
import CustomerUsedBikes from "./compononets/CustomerBikes/CustomerUsedBikes";
import CustomerSpareParts from "./compononets/CustomerSpareParts/CustomerSpareParts";
import CustomerServiceDates from "./compononets/CustomerServiceDates/CustomerServiceDates";
import CustomerAboutUs from "./compononets/CustomerAboutUs/CustomerAboutUs";

// Insurances
import NewInsurances from "./compononets/NewInsurances/NewInsurances";
import InsurancesAll from "./compononets/InsurancesAll/InsurancesAll";
import UpdateInsurances from "./compononets/UpdateInsurances/UpdateInsurances";
import InsuranceDocument from "./compononets/InsuranceDocument/InsuranceDocument";

import CustomerReports from "./compononets/CustomerReports/CustomerReports";

import CustomerOffers from "./compononets/CustomerOffers/CustomerOffers";

// Static pages
import Privacy from "./compononets/Static/Privacy";
import Terms from "./compononets/Static/Terms";
import Support from "./compononets/Static/Support";

function Layout() {
  const location = useLocation();
  const [routeLoading, setRouteLoading] = useState(false);
  const sidebarNavRef = useRef(false);

  // Show a short watermark overlay on each route change
  useEffect(() => {
    if (sidebarNavRef.current) {
      setRouteLoading(true);
      const timeout = setTimeout(() => setRouteLoading(false), 500); // adjust duration as desired
      sidebarNavRef.current = false; // reset flag after applying
      return () => clearTimeout(timeout);
    }
  }, [location.pathname]);

  const isIndexPage = [
    "/", "/Login", "/Register", "/CustomerHomepage", "/Index",
     "/CustomerBrandNewBikes", "/CustomerUsedBikes", 
    "/CustomerSpareParts",
    "/CustomerServiceDates", "/CustomerAboutUs"
  ].includes(location.pathname);

  return (
    <>
      {routeLoading && (
        <div className="route-loading-overlay">
          <div className="app-watermark">Rathnasiri Motors</div>
        </div>
      )}
      {!isIndexPage && <Header />}

      <div className={!isIndexPage ? "flex" : ""}>
        {!isIndexPage && (
          <SidePanel
            onNavigate={() => {
              // mark that the next navigation was initiated via the sidebar
              sidebarNavRef.current = true;
            }}
          />
        )}

        <div className={!isIndexPage ? "flex-1" : ""}>
          <Routes>
          {/* Public pages */}
          <Route path="/" element={<Index />} />
          <Route path="/Index" element={<Index />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Register" element={<Register />} />
          <Route path="/CustomerHomepage" element={<CustomerHomepage />} />
          <Route path="/CustomerBrandNewBikes" element={<CustomerBrandNewBikes />} />
          <Route path="/CustomerUsedBikes" element={<CustomerUsedBikes />} /> 
          <Route path="/CustomerSpareParts" element={<CustomerSpareParts />} />
          <Route path="/CustomerServiceDates" element={<CustomerServiceDates />} />
          <Route path="/CustomerAboutUs" element={<CustomerAboutUs />} />

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
          <Route path="/SalesBikeForm" element={<SalesBikeForm />} />
          <Route path="/BikeSalesReport" element={<BikeSalesReport />} />
          <Route path="/BikeReportView/:id" element={<BikeReportView />} />
          <Route path="/bikesummery" element={<BikeSummary />} />

          {/* Customers */}
          <Route path="/CustomerDetails" element={<CustomerDetails />} />
          <Route path="/CustomerLoyalty" element={<CustomerLoyalty />} />

          <Route path="/CustomerHomepage" element={<CustomerHomepage />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Register" element={<Register />} />

          <Route path="/Reports" element={<CustomerReports/>}/>
          
          <Route path="/CustomerOffers" element={<CustomerOffers/>}/>
          {/*<Route path="/CustomerDetails" element={<CustomerDetails />} /> 
          <Route path="/CustomerLoyalty" element={<CustomerLoyalty />} />  */}

          {/* Insurances */}
          <Route path="/NewInsurances" element={<NewInsurances />} />
          <Route path="/InsurancesAll" element={<InsurancesAll />} />
          <Route path="/UpdateInsurances/:id" element={<UpdateInsurances />} />
          <Route path="/InsuranceDocument/:id" element={<InsuranceDocument />} />

          {/* Inventory */}
          <Route path="/SparePartsForm" element={<SparePartsForm />} />
          <Route path="/SparePartsDisplay" element={<SparePartsDisplay />} />
          <Route path="/SparePartsUpdate/:id" element={<SparePartsUpdate />} />
          <Route path="/SparePartsViewForm/:id" element={<SparePartsViewForm />} />
          <Route path="/SparePartBill" element={<SparePartBill />} />
          {/* Static pages */}
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/support" element={<Support />} />
          </Routes>
        </div>
      </div>

      {!isIndexPage && <Footer />}
    </>
  );
}

function AppContent() {
  return <Layout />;
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
