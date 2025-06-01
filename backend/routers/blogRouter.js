const express = require('express');
const { body, validationResult, param } = require('express-validator');
const Model = require('../models/blogModel');
const verifyToken = require('../middleware/verifyToken');

const router = express.Router();

// Allowed fields for create/update to avoid mass assignment
const allowedFields = ['title', 'content', 'category', 'tags'];

// Helper function to sanitize tags array (optional)
const sanitizeTags = (tags) => {
  if (!Array.isArray(tags)) return [];
  return tags.map(tag => tag.trim().toLowerCase());
};

// Create blog - protected (any logged-in user)
router.post(
  '/add',
  verifyToken,
  [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('content').trim().notEmpty().withMessage('Content is required'),
    body('category').optional().trim(),
    body('tags').optional().isArray().withMessage('Tags must be an array'),
  ],
  async (req, res) => {
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    try {
      // Pick allowed fields only
      const data = {};
      allowedFields.forEach((field) => {
        if (req.body[field] !== undefined) data[field] = req.body[field];
      });

      // Sanitize tags if present
      if (data.tags) data.tags = sanitizeTags(data.tags);

      // Add info about the publisher
      data.publishedBy = req.user.name || 'Unknown';
      data.userId = req.user._id;

      const blog = new Model(data);
      const result = await blog.save();

      res.status(201).json(result);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
);

// Update blog - protected, only owner or admin
router.put(
  '/update/:id',
  verifyToken,
  [
    param('id').isMongoId().withMessage('Invalid blog ID'),
    body('title').optional().trim().notEmpty().withMessage('Title cannot be empty'),
    body('content').optional().trim().notEmpty().withMessage('Content cannot be empty'),
    body('category').optional().trim(),
    body('tags').optional().isArray().withMessage('Tags must be an array'),
  ],
  async (req, res) => {
    // Validate params and body
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    try {
      const blog = await Model.findById(req.params.id);
      if (!blog) return res.status(404).json({ message: 'Blog not found' });

      // Authorization check: owner or admin only
      if (blog.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Unauthorized' });
      }

      // Pick allowed fields only for update
      const data = {};
      allowedFields.forEach((field) => {
        if (req.body[field] !== undefined) data[field] = req.body[field];
      });

      // Sanitize tags if present
      if (data.tags) data.tags = sanitizeTags(data.tags);

      const updatedBlog = await Model.findByIdAndUpdate(req.params.id, data, { new: true });
      res.status(200).json(updatedBlog);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
);

// Get blogs by category - public
router.get(
  '/getbycategory/:category',
  [
    param('category').trim().notEmpty().withMessage('Category is required'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    try {
      const blogs = await Model.find({ category: req.params.category }).sort({ createdAt: -1 });
      res.status(200).json(blogs);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
);

// Get blog by ID - public
router.get(
  '/getbyid/:id',
  [param('id').isMongoId().withMessage('Invalid blog ID')],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    try {
      const blog = await Model.findById(req.params.id);
      if (!blog) return res.status(404).json({ message: 'Blog not found' });
      res.status(200).json(blog);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
);

// Get all blogs - public
router.get('/getall', async (req, res) => {
  try {
    console.log("all blogs")
    const blogs = await Model.find().sort({ createdAt: -1 });
    res.status(200).json(blogs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Delete blog - protected, only owner or admin
router.delete(
  '/delete/:id',
  verifyToken,
  [param('id').isMongoId().withMessage('Invalid blog ID')],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    try {
      const blog = await Model.findById(req.params.id);
      if (!blog) return res.status(404).json({ message: 'Blog not found' });

      // Authorization check: owner or admin only
      if (blog.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Unauthorized' });
      }

      await Model.findByIdAndDelete(req.params.id);
      res.status(200).json({ message: 'Blog deleted successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
);

// Get blogs by author's email - public (if email is stored on blog docs)
// You may need to store email on blog creation if you want to use this
router.get(
  '/getbyemail/:email',
  [
    param('email')
      .trim()
      .isEmail()
      .withMessage('Valid email is required')
      .normalizeEmail(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    try {
      const blogs = await Model.find({ email: req.params.email });
      res.status(200).json(blogs);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
);

module.exports = router;
