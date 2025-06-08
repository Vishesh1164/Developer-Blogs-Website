const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const User = require('./models/UserModel');

dotenv.config();

async function createAdmin() {
  try {
    const url =process.env.MONGO_URL;
    await mongoose.connect(url);
    console.log('✅ Connected to MongoDB');

    const existingAdmin = await User.findOne({ email: 'srivastavavishesh662@gmail.com' });

    if (existingAdmin) {
      console.log('⚠️ Admin already exists:', existingAdmin.email);
      return;
    }

    const hashedPassword = await bcrypt.hash('Vishes@1164', 10);

    const admin = new User({
        name:'Vishesh',
      email: 'srivastavavishesh662@gmail.com',
      password: hashedPassword,
      role: 'admin',
    });

    await admin.save();
    console.log('✅ Admin created successfully:', admin.email);
  } catch (err) {
    console.error('❌ Error creating admin:', err.message);
  } finally {
    mongoose.connection.close();
  }
}

createAdmin();
