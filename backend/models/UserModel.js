const { Schema, model } = require('../connection');

const mySchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true, lowercase: true },
  password: { type: String, required: true },
  profileImage: { type: String, default: 'https://via.placeholder.com/150' },
  bio: { type: String, default: 'unknown' },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = model('users', mySchema);
