const express = require('express');
const router = express.Router();
const AdminUser = require('../models/AdminUser'); // Import AdminUser model

// Allowed admin emails
const allowedEmails = [
  'athilakshmi1312@gmail.com',
  'vijayakannan0312@gmail.com',
  'murugang101067@gmail.com',
  'murugankalyani64@gmail.com'
];

// Signup Route for Admin Users
router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;

  // Check if the email is allowed
  if (!allowedEmails.includes(email)) {
    return res.status(403).json({ message: 'This site is not for you. Only for admins.' });
  }

  try {
    // Check if the admin user already exists
    let existingAdminUser = await AdminUser.findOne({ email });
    if (existingAdminUser) {
      return res.status(400).json({ message: 'User already exists.' });
    }

    // Create a new admin user
    const newAdminUser = new AdminUser({ name, email, password });
    await newAdminUser.save();

    res.status(201).json({ message: 'Signup successful.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});
// Signin Route for Admin Users
router.post('/signin', async (req, res) => {
  const { email, password } = req.body;

  // Check if the email is allowed
  if (!allowedEmails.includes(email)) {
    return res.status(403).json({ message: 'This site is not for you. Only for admins.' });
  }

  try {
    // Check if the admin user exists
    let adminUser = await AdminUser.findOne({ email });
    if (!adminUser) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    // Check password
    const isMatch = await adminUser.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    res.status(200).json({ message: 'Signin successful.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

module.exports = router;
