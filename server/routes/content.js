const express = require('express');
const { body, validationResult } = require('express-validator');
const Content = require('../models/Content');
const ActivityLog = require('../models/ActivityLog');
const { requireEditor, requireViewer } = require('../middleware/auth');

const router = express.Router();

// Helper function to create activity log
const createActivityLog = async (userId, action, resource, details = {}) => {
  try {
    await ActivityLog.create({
      user: userId,
      action,
      resource,
      details
    });
  } catch (error) {
    console.error('Error creating activity log:', error);
  }
};

// Get all content (All authenticated users - viewers get read-only access)
router.get('/', requireViewer, async (req, res) => {
  try {
    // Only show published content to viewers
    const filter = req.user.role === 'viewer' ? { status: 'published' } : {};
    
    const content = await Content.find(filter)
      .populate('author', 'username email')
      .populate('parentContent', 'title')
      .sort({ createdAt: -1 });
    
    res.json({
      content,
      total: content.length,
      userRole: req.user.role
    });
  } catch (error) {
    console.error('Error fetching content:', error);
    res.status(500).json({ error: 'Failed to fetch content' });
  }
});

// Get content by ID (All authenticated users - viewers get read-only access)
router.get('/:id', requireViewer, async (req, res) => {
  try {
    const content = await Content.findById(req.params.id)
      .populate('author', 'username email')
      .populate('parentContent', 'title');
    
    if (!content) {
      return res.status(404).json({ error: 'Content not found' });
    }
    
    // Viewers can only see published content
    if (req.user.role === 'viewer' && content.status !== 'published') {
      return res.status(403).json({ error: 'Access denied. Content not published.' });
    }
    
    res.json({ 
      content,
      userRole: req.user.role
    });
  } catch (error) {
    console.error('Error fetching content:', error);
    res.status(500).json({ error: 'Failed to fetch content' });
  }
});

// Create new content (Editor only)
router.post('/', requireEditor, [
  body('title').isLength({ min: 1, max: 200 }).trim().escape(),
  body('content').isLength({ min: 1 }),
  body('type').isIn(['post', 'comment']),
  body('tags').optional().isArray()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const { title, content, type, tags = [] } = req.body;
    
    const newContent = new Content({
      title,
      content,
      type,
      status: 'published', // Always published
      tags,
      author: req.user._id
    });
    
    await newContent.save();

    // Create activity log
    await createActivityLog(req.user._id, 'create_content', 'content', {
      contentId: newContent._id,
      title: newContent.title,
      type: newContent.type
    });

    const populatedContent = await Content.findById(newContent._id)
      .populate('author', 'username email')
      .populate('parentContent', 'title');
    
    res.status(201).json({
      message: 'Content created successfully',
      content: populatedContent
    });
  } catch (error) {
    console.error('Error creating content:', error);
    res.status(500).json({ error: 'Failed to create content' });
  }
});

// Update content (Editor only)
router.put('/:id', requireEditor, [
  body('title').optional().isLength({ min: 1, max: 200 }).trim().escape(),
  body('content').optional().isLength({ min: 1 }),
  body('tags').optional().isArray()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const content = await Content.findById(req.params.id);
    if (!content) {
      return res.status(404).json({ error: 'Content not found' });
    }
    
    // Only author can edit content
    if (content.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'You can only edit your own content' });
    }
    
    const { title, content: newContent, tags } = req.body;
    
    if (title) content.title = title;
    if (newContent) content.content = newContent;
    if (tags) content.tags = tags;
    
    content.updatedAt = new Date();
    await content.save();

    // Create activity log
    await createActivityLog(req.user._id, 'update_content', 'content', {
      contentId: content._id,
      title: content.title,
      type: content.type
    });

    const updatedContent = await Content.findById(content._id)
      .populate('author', 'username email')
      .populate('parentContent', 'title');
    
    res.json({
      message: 'Content updated successfully',
      content: updatedContent
    });
  } catch (error) {
    console.error('Error updating content:', error);
    res.status(500).json({ error: 'Failed to update content' });
  }
});

// Get content statistics (All authenticated users)
router.get('/stats', requireViewer, async (req, res) => {
  try {
    const filter = req.user.role === 'viewer' ? { status: 'published' } : {};
    
    const totalContent = await Content.countDocuments(filter);
    const posts = await Content.countDocuments({ ...filter, type: 'post' });
    const comments = await Content.countDocuments({ ...filter, type: 'comment' });
    
    // Recent content (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentContent = await Content.countDocuments({
      ...filter,
      createdAt: { $gte: sevenDaysAgo }
    });
    
    res.json({
      totalContent,
      posts,
      comments,
      recentContent,
      userRole: req.user.role
    });
  } catch (error) {
    console.error('Error fetching content stats:', error);
    res.status(500).json({ error: 'Failed to fetch content statistics' });
  }
});

// Delete content (Editor only)
router.delete('/:id', requireEditor, async (req, res) => {
  try {
    const content = await Content.findById(req.params.id);
    if (!content) {
      return res.status(404).json({ error: 'Content not found' });
    }
    
    // Only author can delete content
    if (content.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'You can only delete your own content' });
    }
    
    await Content.findByIdAndDelete(req.params.id);
    
    // Create activity log
    await createActivityLog(req.user._id, 'delete_content', 'content', {
      contentId: content._id,
      title: content.title,
      type: content.type
    });
    
    res.json({ message: 'Content deleted successfully' });
  } catch (error) {
    console.error('Error deleting content:', error);
    res.status(500).json({ error: 'Failed to delete content' });
  }
});

module.exports = router;

