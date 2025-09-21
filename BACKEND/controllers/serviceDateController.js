const ServiceDate = require('../Model/ServiceDate');

exports.createServiceDate = async (req, res) => {
  try {
    const newService = new ServiceDate(req.body);
    await newService.save();
    res.status(201).json({ message: 'Service date booked successfully' });
  } catch (err) {
    console.error('Error creating service date:', err);
    res.status(500).json({ error: 'Failed to book service date' });
  }
};

exports.getAllServiceDates = async (req, res) => {
  try {
    const serviceDates = await ServiceDate.find();
    res.status(200).json(serviceDates);
  } catch (err) {
    console.error('Error fetching service dates:', err);
    res.status(500).json({ error: 'Failed to fetch service dates' });
  }
};
