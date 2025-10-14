const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
  AppointmentDate: { 
    type: Date, 
    required: true 
  },
  Status: { 
    type: String, 
    enum: ['pending', 'confirmed', 'cancelled'], 
    default: 'pending'
  }
});

module.exports = mongoose.model('Appointment', AppointmentSchema);