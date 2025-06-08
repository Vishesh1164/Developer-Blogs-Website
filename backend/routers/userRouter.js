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

// Utility to whitelist fields for update
const allowedUpdates = ['name', 'email', 'profileImage'];

// Sign Up - Add User (Default role: user)
router.post('/add',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { name, email, password, profileImage } = req.body;

      const existingUser = await Model.findOne({ email });
      if (existingUser) {
        return res.status(409).json({ message: 'Email already exists' });
      }

      const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

      const user = new Model({
        name,
        email,
        password: hashedPassword,
        profileImage,
        role: 'user'  // explicitly set default role
      });

      const savedUser = await user.save();

      const payload = {
        _id: savedUser._id,
        email: savedUser.email,
        name: savedUser.name,
        profileImage: savedUser.profileImage,
        role: savedUser.role,
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
          // Set JWT in HttpOnly, Secure cookie
          res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 6 * 60 * 60 * 1000, // 6 hours
          });
          // Do NOT send password or token in body, send user info only
          res.status(201).json({ user: { name: savedUser.name, email: savedUser.email, profileImage: savedUser.profileImage, role: savedUser.role } });
        }
      );

    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
);

// Login - Authenticate User
router.post('/authenticate',
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
      if (!passwordMatch) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      const payload = {
        _id: user._id,
        email: user.email,
        name: user.name,
        profileImage: user.profileImage,
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

// Get user by email - only admin or self
router.get('/getbyemail/:email', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin' && req.user.email !== req.params.email) {
      return res.status(403).json({ message: 'Access denied' });
    }
    const result = await Model.find({ email: req.params.email }).select('-password');
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Get user by ID - only admin or self
router.get('/getbyid/:id', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin' && req.user._id.toString() !== req.params.id) {
      return res.status(403).json({ message: 'Access denied' });
    }
    const result = await Model.findById(req.params.id).select('-password');
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Get logged-in user using token
router.get('/getuser', verifyToken, async (req, res) => {
  try {
    console.log(req.user)
    const user = await Model.findById(req.user._id).select('-password');
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Get all users - only admin

// Delete user - only admin




router.put(
  '/update',
  verifyToken,

  // ✅ Validation (only if field is present)
  [
    body('name')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('Name cannot be empty'),
    body('email')
      .optional()
      .isEmail()
      .withMessage('Must be a valid email'),
    body('bio')
      .optional()
      .isLength({ max: 500 })
      .withMessage('Bio must be less than 500 characters'),
    // You can add validation for profileImage if needed
  ],

  async (req, res) => {
    // ✅ Check for validation errors
    const allowedUpdates = ['name', 'email', 'bio', 'profileImage',];
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log("Validation Errors:", errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    // ✅ Prevent updating role manually
    if ('role' in req.body) {
      return res.status(403).json({ message: 'Role cannot be updated directly' });
    }

    // ✅ Check if all keys are allowed
    const updates = Object.keys(req.body);
    const isValidOperation = updates.every((update) =>
      allowedUpdates.includes(update)
    );

    if (!isValidOperation) {
      console.log(req.body)
      return res.status(400).json({ message: 'Invalid updates!' });
    }

    try {
      const updatedUser = await Model.findByIdAndUpdate(
        req.user._id,
        req.body,
        {
          new: true,          // return updated document
          runValidators: true // validate based on schema
        }
      ).select('-password'); // don't return password in response

      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
      }

      console.log("✅ User updated successfully");
      res.status(200).json(updatedUser);
    } catch (err) {
      console.error("Update error:", err);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
);




module.exports = router;
