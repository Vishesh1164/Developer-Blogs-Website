const express = require('express');
const { body, validationResult } = require('express-validator');
const Model = require('../models/contactModel');
const verifyToken = require('../middleware/verifyToken');
const router = express.Router();

// Middleware to check admin role
const authorizeRoles = (roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
  }
  next();
};

// Add new contact - Any logged-in user
router.post(
  '/add',
  verifyToken,
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('message').notEmpty().withMessage('Message is required'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const contact = new Model({
        ...req.body,
        userId: req.user._id,
        email: req.body.email.toLowerCase(),
      });

      const result = await contact.save();
      res.status(201).json(result);
    } catch (err) {
      console.error(err);
      if (err.code === 11000) {
        return res.status(409).json({ message: 'Email already exists' });
      }
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
);

// Get contacts by email - Admin or owner only
router.get('/getbyemail/:email', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin' && req.user.email.toLowerCase() !== req.params.email.toLowerCase()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const contacts = await Model.find({ email: req.params.email.toLowerCase() }).sort({ createdAt: -1 });
    res.status(200).json(contacts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Get contact by ID - Admin or owner only
router.get('/getbyid/:id', verifyToken, async (req, res) => {
  try {
    const contact = await Model.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    if (req.user.role !== 'admin' && contact.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    res.status(200).json(contact);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Get all contacts - Admin only
router.get('/getall', verifyToken, authorizeRoles(['admin']), async (req, res) => {
  try {
    const contacts = await Model.find().sort({ createdAt: -1 });
    res.status(200).json(contacts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Delete contact by ID - Admin or owner only
router.delete('/delete/:id', verifyToken, async (req, res) => {
  try {
    const contact = await Model.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    if (req.user.role !== 'admin' && contact.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    await Model.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Contact deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
