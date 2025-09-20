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

// Add New Insurances form
import NewInsurances from  "./compononets/NewInsurances/NewInsurances";
import InsurancesAll from "./compononets/InsurancesAll/InsurancesAll";
import UpdateInsurances from "./compononets/UpdateInsurances/UpdateInsurances";
import InsuranceDocument from "./compononets/InsuranceDocument/InsuranceDocument";

import CustomerDetails from "./compononets/CustomeDetails/CustomerDetails";
import CustomerLoyalty from "./compononets/CustomerLoyality/CustomerLoyality";

//Inventory insert form
import SparePartsForm from "./compononets/SparePartsForm/SparePartsForm";
import SparePartsDisplay from "./compononets/SpareParts/SparePartsDisplay";
import SparePartsUpdate from "./compononets/SparePartsUpdate/SparePartsUpdate";
import SparePartsViewForm from "./compononets/SparePartsView/SparePartsViewForm";
import SparePartBill from "./compononets/SparePartBill/SparePartBill";







function App() {
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

          {/* Add New Insurances form */}
          <Route path="/NewInsurances" element={<NewInsurances />} />
          <Route path="/InsurancesAll" element={<InsurancesAll />} />
          <Route path="/UpdateInsurances/:id" element={<UpdateInsurances/>} />
          <Route path="/InsuranceDocument/:id" element={<InsuranceDocument />} />


          {/*Inventory*/}
          <Route path="/SparePartsForm" element={<SparePartsForm />} />
          <Route path="/SparePartsDisplay" element={<SparePartsDisplay />} />
          <Route path="/SparePartsUpdate/:id" element={<SparePartsUpdate />} />
          <Route path="/SparePartsViewForm/:id" element={<SparePartsViewForm />} />
          <Route path="/SparePartBill" element={<SparePartBill />} />


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
