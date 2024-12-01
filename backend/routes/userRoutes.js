 // routes/userRoutes.js
const express = require('express');
const User = require('../models/User');
const Payment = require('../models/Payment');
const router = express.Router();

const calculateTotalAmountToPay = async (user) => {
  if (!user || !user.plan || user.prizeMonth === undefined || !user.joiningDate) return 0;

  const { plan, prized, prizeMonth, joiningDate } = user;
  const planAmount = parseInt(plan.split('..')[1].replace('k', '000').replace('L', '00000'));
  const baseAmountPerMonth = planAmount / 20;
  const interestPerMonth = planAmount * 0.01;

  // Get the current date
  const currentDate = new Date();

  // Calculate the number of months since the user joined
  const joiningDateObj = new Date(joiningDate); 
  const monthsSinceJoining = (currentDate.getFullYear() - joiningDateObj.getFullYear()) * 12 +
                             (currentDate.getMonth() - joiningDateObj.getMonth()) + 1;

  let totalAmountToPay = baseAmountPerMonth;

  // If the user is prized in the same month as they joined, the total amount to pay should not change
  if (prized && monthsSinceJoining === prizeMonth) {
    return parseFloat(totalAmountToPay.toFixed(2));
  }

  // If the user is prized after the prize month, add interest
  if (prized && monthsSinceJoining > prizeMonth) {
    totalAmountToPay += interestPerMonth;
  }

  return parseFloat(totalAmountToPay.toFixed(2));
};

const updateRemainingAmount = async (user, amountPaid = 0) => {
  try {
    if (!user) {
      throw new Error('User not found');
    }
    const { joiningDate } = user;
    // Fetch payments only for the current month
    const currentDate = new Date();
    const payments = await Payment.find({
      userId: user.customId,
      paymentDate: {
        $gte: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),
        $lt: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1),
      },
    });

    const totalPaidAmount = payments.reduce((acc, payment) => acc + (payment.amount || 0), 0);
    const oldRemainingAmount = user.remainingAmount || 0;
    const currentMonthTotal = user.totalAmountToPay || 0;

    // Logging for debugging
    console.log('Current State Before Update:', {
      oldRemainingAmount,
      currentMonthTotal,
      totalPaidAmount,
      amountPaid,
    });

    let newRemainingAmount = oldRemainingAmount; // Start with the old remaining amount
    
    // If the user is prized and it's the prize month
    const joiningDateObj = new Date(joiningDate);
    const monthsSinceJoining = (currentDate.getFullYear() - joiningDateObj.getFullYear()) * 12 +
                             (currentDate.getMonth() - joiningDateObj.getMonth()) + 1;
    if (user.prized && monthsSinceJoining === user.prizeMonth) {
      // Adjust the remaining amount based on the current month total only
      newRemainingAmount = currentMonthTotal - totalPaidAmount; // Should be 2500 - 0 = 2500
      console.log('Prized Status Active:', {
        newRemainingAmount,
      });
    } else {
      // Normal calculation for remaining amount when not prized
      newRemainingAmount = oldRemainingAmount + (currentMonthTotal - totalPaidAmount - amountPaid); // Corrected line
      console.log('Normal Calculation:', {
        newRemainingAmount,
      });
    }

    // Ensure remaining amount doesn't go negative
    if (newRemainingAmount < 0) {
      newRemainingAmount = 0;
    }

    // Update the user's remaining amount
    user.remainingAmount = newRemainingAmount;

    // If fully paid or overpaid, reset total amount to pay
    if (newRemainingAmount <= 0) {
      user.totalAmountToPay = 0;
      user.remainingAmount = 0; // Ensure remaining amount is set to 0 if fully paid
      
    }

    await user.save();

    // Log final state after update
    console.log('After Update:', {
      remainingAmount: user.remainingAmount,
      totalAmountToPay: user.totalAmountToPay,
    });

    return user;
  } catch (error) {
    console.error('Error updating remaining amount:', error);
    throw error;
  }
};






// Add User Route
router.post('/add', async (req, res) => {
  try {
    const lastUser = await User.findOne().sort({ _id: -1 });
    let newIdNumber = 1;

    if (lastUser && lastUser.customId) {
      newIdNumber = parseInt(lastUser.customId.replace('KC', '')) + 1;
    }

    const customId = 'KC' + String(newIdNumber).padStart(3, '0');

    const user = new User({
      ...req.body,
      customId: customId,
    });

    // Calculate total amount to pay when adding a user
    const totalAmountToPay = await calculateTotalAmountToPay(user);
    user.totalAmountToPay = totalAmountToPay;
    user.remainingAmount = totalAmountToPay; // Initialize remaining amount as equal to total

    await user.save();
    res.status(200).json({ message: 'User added successfully!', user });
  } catch (err) {
    console.error('Error in /add route:', err.message);
    res.status(500).json({ message: 'Error adding user', error: err });
  }
});

// Get all users route with total paid amount from Payment
router.get('/', async (req, res) => {
  try {
    const users = await User.find();

    const usersWithPaidAmounts = await Promise.all(
      users.map(async (user) => {
        const payments = await Payment.aggregate([
          { $match: { userId: user.customId } },
          { $group: { _id: null, totalPaid: { $sum: '$amount' } } }
        ]);

        const paidAmount = payments.length > 0 ? payments[0].totalPaid : 0;

        return {
          ...user.toObject(),
          paidAmount,
        };
      })
    );

    res.status(200).json(usersWithPaidAmounts);
  } catch (err) {
    console.error('Error fetching users:', err.message);
    res.status(500).json({ message: 'Error fetching users', error: err });
  }
});

// Get User by customId
router.get('/:customId', async (req, res) => {
  const customId = req.params.customId;

  try {
    const user = await User.findOne({ customId });
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update User Prized Status Route
router.put('/:customId', async (req, res) => {
  const customId = req.params.customId;
  const { prized } = req.body;

  // Validate input
  if (typeof prized !== 'boolean') {
    return res.status(400).json({ message: 'Invalid input: prized should be a boolean' });
  }

  try {
    const user = await User.findOne({ customId });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const currentDate = new Date();
    const joiningDate = new Date(user.joiningDate);
    const monthsSinceJoining = (currentDate.getFullYear() - joiningDate.getFullYear()) * 12 +
                               (currentDate.getMonth() - joiningDate.getMonth()) + 1;

    // Update prized status and prize month conditionally
    if (prized !== user.prized) {
      user.prized = prized;
      user.prizeMonth = prized ? monthsSinceJoining : 0;
      
      // Recalculate total amount to pay based on prize status only if the status changed
      user.totalAmountToPay = await calculateTotalAmountToPay(user);
      await updateRemainingAmount(user, 0); // Update remaining amount considering payments and new prize status
    }

    await user.save();
    res.status(200).json({ message: `Prized status updated for user ${customId}`, user });
  } catch (error) {
    console.error('Error updating prized status:', error); // Log error details
    res.status(500).json({ message: 'Error updating prized status', error: error.message });
  }
});
// Endpoint to get users with payments due in the next 7 days
router.get('/due-next-week', async (req, res) => {
  try {
    const today = new Date();
    const lastWeek = new Date();
    lastWeek.setDate(today.getDate() - 7);

    // Fetch users who have already joined and still have a remaining amount
    const usersDueNextWeek = await User.find({
      joiningDate: { $lte: today },
      remainingAmount: { $gt: 0 },
    });

    // Filter the users based on the monthly due date plus a 7-day grace period
    const dueUsers = usersDueNextWeek.filter(user => {
      // Calculate the current monthly due date based on the user's joining date
      const paymentDueDate = new Date(user.joiningDate);
      const monthsSinceJoining = Math.floor((today - paymentDueDate) / (1000 * 60 * 60 * 24 * 30));
      paymentDueDate.setMonth(paymentDueDate.getMonth() + monthsSinceJoining);

      // Check if the due date falls within the last week up to today
      return paymentDueDate >= lastWeek && paymentDueDate <= today;
    });
    res.json({ message: 'Route is working' }); 
    res.json(dueUsers);
  } catch (error) {
    console.error('Error fetching users due next week:', error);
    res.status(500).json({ message: 'Error fetching due users', error });
  }
});



// Export the router and the functions
module.exports = {
  router,
  calculateTotalAmountToPay,
  updateRemainingAmount,
};


 

