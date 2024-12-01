const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Define admin user schema
const adminUserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  }
});

// Hash password before saving admin user
adminUserSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Compare password method for signin
adminUserSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

// Create AdminUser model
const AdminUser = mongoose.model('AdminUser', adminUserSchema);

module.exports = AdminUser;
