// models/User.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true }, // Name of the user
    plan: { type: String, required: true }, // Plan selected by the user
    mobileNum: { type: String, required: true }, // Mobile number of the user
    joiningDate: { type: Date, required: true }, // Joining date
    address: { type: String, required: false }, // Address of the user
    customId: { type: String, unique: true }  ,
    prized: { type: Boolean, default: false },
    prizeMonth: { type: Number, default: 0 },
    remainingAmount: { type: Number}, // Track how much is left to pay
    totalAmountToPay: { type: Number }, 
    
});
// Pre-save middleware to prevent resetting "prized" to false once it's true
UserSchema.pre('save', function (next) {
    if (this.isModified('prized') && this.prized === false) {
        return next(new Error('Cannot change prized status back to non-prized.'));
    }
    next();
});

module.exports = mongoose.model('User', UserSchema);
