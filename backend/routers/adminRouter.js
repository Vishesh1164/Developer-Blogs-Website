const express = require('express');
const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator');
const Model = require('../models/UserModel');
const jwt = require('jsonwebtoken');
const verifyToken = require('../middleware/verifyToken');
const authorizeRoles = require('../middleware/authorizeRoles');
require('dotenv').config();

const router = express.Router();
const SALT_ROUNDS = 10;

router.post('/login',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { email, password } = req.body;

      const user = await Model.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch && user.role==='admin' ) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      const payload = {
        _id: user._id,
        email: user.email,
        role: user.role,
      };

      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: '6h' },
        (err, token) => {
          if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Token generation failed' });
          }
          res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 6 * 60 * 60 * 1000, // 6 hours
          });
          console.log('logged in')
          res.status(200).json({ user: { name: user.name, email: user.email, profileImage: user.profileImage, role: user.role } });
        }
      );
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
);

// Logout (clear cookie)
router.post('/logout', (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });
  res.status(200).json({ message: 'Logged out successfully' });
});

// Admin can update role of user
router.put('/updateRole/:id', verifyToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const { role } = req.body;
    if (!role || !['user', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    const updatedUser = await Model.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(updatedUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.delete('/delete/:id', verifyToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const result = await Model.findByIdAndDelete(req.params.id);
    if (!result) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.get('/getall', verifyToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const users = await Model.find().select('-password');
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
});



module.exports = router;