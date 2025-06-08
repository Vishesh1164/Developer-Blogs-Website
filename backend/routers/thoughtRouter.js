const express = require('express');
const { body, validationResult } = require('express-validator');
const Model = require('../models/thoughtModel');
const verifyToken = require('../middleware/verifyToken');
const authorizeRoles = require('../middleware/authorizeRoles');

const router = express.Router();

// Add Thought - Private (any logged-in user)
router.post('/add',
    verifyToken,
    [
        body('name').notEmpty().withMessage('Name is required'),
           body('email')
              .optional()
              .isEmail()
              .withMessage('Must be a valid email'),
        body('thought').notEmpty().withMessage('Content is required'),
    ],
    async (req, res) => {
      
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
       

        try {
            const { name, email, thought } = req.body;
            const thoughts = new Model({
               name,
                email,
                thought
            });

            const result = await thoughts.save();
            res.status(201).json(result);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
);

// Get Thoughts by Email - Admin or user themselves
router.get('/getbyemail/:email', verifyToken, async (req, res) => {
    try {
        if (req.user.role !== 'admin' && req.user.email !== req.params.email) {
            return res.status(403).json({ message: 'Access denied' });
        }

        const result = await Model.find({ email: req.params.email }).sort({ createdAt: -1 });
        res.status(200).json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Get Thought by ID - Admin or owner
router.get('/getbyid/:id', verifyToken, async (req, res) => {
    try {
        const thought = await Model.findById(req.params.id);
        if (!thought) return res.status(404).json({ message: 'Thought not found' });

        if (req.user.role !== 'admin' && thought.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Access denied' });
        }

        res.status(200).json(thought);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Get All Thoughts - Admin only
router.get('/getall', verifyToken, authorizeRoles('admin'), async (req, res) => {
    try {
        const result = await Model.find().sort({ createdAt: -1 });
        res.status(200).json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Delete Thought - Admin or owner only
router.delete('/delete/:id', verifyToken, async (req, res) => {
    try {
        const thought = await Model.findById(req.params.id);
        if (!thought) return res.status(404).json({ message: 'Thought not found' });

        if (req.user.role !== 'admin' && thought.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        await Model.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

module.exports = router;
