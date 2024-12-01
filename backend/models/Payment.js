// models/Payment.js
const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
    userId: { type: String, ref: 'User', required: true }, // Reference to the User
    name: { type: String, required: true }, // User's name
    date: { type: Date, required: true }, // Payment date
    time: { type: String, required: false },
    plan: { type: String, required: true }, // Selected plan
    amount: { type: Number, required: true }, // Payment amount
    modeOfPayment: { type: String, required: true }, // Mode of payment (e.g., Cash, Credit Card)
    
});

module.exports = mongoose.model('Payment', PaymentSchema);
