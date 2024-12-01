const express = require('express');
const Payment = require('../models/Payment');
const router = express.Router();
const User = require('../models/User');  // Ensure the correct path to the User model

// Helper to update the remaining amount and total amount to pay
const updateRemainingAmount = async (userId, amountPaid) => {
    try {
        const user = await User.findOne({ customId: userId });

        if (!user) {
            throw new Error('User not found');
        }

        const currentMonthTotal = user.totalAmountToPay || 0;
        const remainingAmount = user.remainingAmount || currentMonthTotal;
        let newRemainingAmount = remainingAmount - amountPaid;

        // Handle full payment for the current month
        if (newRemainingAmount <= 0) {
            newRemainingAmount = 0;
            user.totalAmountToPay = 0;
        }

        user.remainingAmount = newRemainingAmount;
        await user.save();

        return user;
    } catch (error) {
        console.error('Error updating remaining amount:', error);
        throw error;
    }
};

// Add payment route
router.post('/add', async (req, res) => {
    try {
        const { userId, amount } = req.body;

        // Fetch the user based on their ID
        const user = await User.findOne({ customId: userId });
        if (!user) {
            return res.status(404).send('User not found');
        }

        // Create a new payment
        const payment = new Payment({
            ...req.body,
            amount: parseFloat(amount), // Ensure the amount is a float
        });
        await payment.save();

        // Update the remaining amount and totalAmountToPay in the User model
        const updatedUser = await updateRemainingAmount(userId, parseFloat(amount));

        res.status(201).send({ payment, updatedUser });
    } catch (error) {
        console.error('Error adding payment:', error);
        res.status(400).send(error);
    }
});


// Get all payments
router.get('/', async (req, res) => {
    try {
        const payments = await Payment.find();
        res.send(payments);
    } catch (error) {
        console.error('Error fetching payments:', error);
        res.status(500).send('Server error');
    }
});

module.exports = router;

