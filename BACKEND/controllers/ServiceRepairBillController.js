const ServiceRepairBill = require("../Model/ServiceRepairBillModel");

// Get all service and repair bills
const getAllServiceRepairBills = async (req, res, next) => {
  let bills;
  
  try {
    bills = await ServiceRepairBill.find().sort({ date: -1 });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Error fetching bills" });
  }
  
  if (!bills || bills.length === 0) {
    return res.status(200).json([]);
  }
  
  return res.status(200).json(bills);
};

// Create a new service and repair bill
const addServiceRepairBill = async (req, res, next) => {
  const { bill_no, customerName, type, date, services, total, notes } = req.body;

  if (!bill_no || !customerName || !services || services.length === 0) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  let bill;

  try {
    // Process services array to ensure all entries have required fields
    const normalizedServices = services.map(service => ({
      detail: String(service.detail || service.name || "").trim(),
      price: Number(service.price || 0),
    }));

    // Compute total if not provided or verify it
    const computedTotal = normalizedServices.reduce((acc, service) => acc + service.price, 0);
    const billTotal = typeof total === 'number' ? total : computedTotal;
    const billDate = date ? new Date(date) : new Date();

    bill = new ServiceRepairBill({
      bill_no,
      customerName,
      type: type || 'service', // Default to 'service' if not specified
      date: billDate,
      services: normalizedServices,
      total: billTotal,
      notes: notes || "",
    });

    await bill.save();
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Error creating bill" });
  }

  if (!bill) {
    return res.status(500).json({ message: "Unable to add service/repair bill" });
  }
  
  return res.status(201).json(bill);
};

// Get bill by ID
const getBillById = async (req, res, next) => {
  const id = req.params.id;

  let bill;
  try {
    bill = await ServiceRepairBill.findById(id);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Error fetching bill" });
  }

  if (!bill) {
    return res.status(404).json({ message: "Bill not found" });
  }

  return res.status(200).json(bill);
};

// Update bill
const updateBill = async (req, res, next) => {
  const id = req.params.id;
  const { customerName, type, date, services, total, notes } = req.body;

  let bill;
  try {
    bill = await ServiceRepairBill.findById(id);
    
    if (!bill) {
      return res.status(404).json({ message: "Bill not found" });
    }

    if (customerName) bill.customerName = customerName;
    if (type && ['service', 'repair'].includes(type)) bill.type = type;
    if (date) bill.date = new Date(date);
    
    if (services && services.length > 0) {
      const normalizedServices = services.map(service => ({
        detail: String(service.detail || service.name || "").trim(),
        price: Number(service.price || 0),
      }));
      bill.services = normalizedServices;

      // Recompute total
      const computedTotal = normalizedServices.reduce((acc, service) => acc + service.price, 0);
      bill.total = typeof total === 'number' ? total : computedTotal;
    } else if (typeof total === 'number') {
      bill.total = total;
    }

    if (notes !== undefined) bill.notes = notes || "";
    
    await bill.save();
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Error updating bill" });
  }

  return res.status(200).json(bill);
};

// Delete bill
const deleteBill = async (req, res, next) => {
  const id = req.params.id;

  let bill;
  try {
    bill = await ServiceRepairBill.findByIdAndDelete(id);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Error deleting bill" });
  }

  if (!bill) {
    return res.status(404).json({ message: "Bill not found" });
  }

  return res.status(200).json({ message: "Bill deleted successfully" });
};

module.exports = {
  getAllServiceRepairBills,
  addServiceRepairBill,
  getBillById,
  updateBill,
  deleteBill
};
