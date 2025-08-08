const express = require('express');
const ActivityLog = require('../models/ActivityLog');
const { requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Get all logs with pagination (Admin only)
router.get('/', requireAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    
    const skip = (page - 1) * limit;
    
    const logs = await ActivityLog.find()
      .populate('user', 'username email')
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await ActivityLog.countDocuments();
    
    res.json({
      logs,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page)
    });
  } catch (error) {
    console.error('Error fetching logs:', error);
    res.status(500).json({ error: 'Failed to fetch logs' });
  }
});

module.exports = router;
