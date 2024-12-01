const cron = require('node-cron');
const mongoose = require('mongoose');
const User = require('./models/User'); // Ensure path matches your file structure
const calculateTotalAmountToPay = require('./routes/userRoutes'); // Assuming this is a separate function

// This function will set up a cron job for each user based on their joining date
async function scheduleUserCronJobs() {
  try {
    const users = await User.find(); // Fetch all users from the database

    users.forEach((user) => {
      if (!user.joiningDate) return; // Skip if user has no joining date

      // Parse the joining date to set monthly cron timing
      const joiningDate = new Date(user.joiningDate);
      const day = joiningDate.getDate(); // Get day of joining date for monthly schedule
      const duration = 21; // Duration in months per the plan requirements

      for (let i = 0; i < duration; i++) {
        const scheduledMonth = new Date(joiningDate);
        scheduledMonth.setMonth(joiningDate.getMonth() + i);

        // Create a cron job based on the scheduled month date
        cron.schedule(`0 0 ${day} * *`, async () => {
          console.log(`Running cron job for user ${user.customId} on ${scheduledMonth.toISOString()}`);
          
          // Update user's totalAmountToPay and remainingAmount
          const totalAmountToPay = await calculateTotalAmountToPay(user);
          user.totalAmountToPay = totalAmountToPay;
          user.remainingAmount = totalAmountToPay; // Reset remaining amount for the month
          
          await user.save();
          console.log(`Updated payment fields for user ${user.customId}`);
        });
      }
    });
  } catch (error) {
    console.error('Error scheduling cron jobs:', error);
  }
}

// Call function to initialize scheduling
scheduleUserCronJobs();


