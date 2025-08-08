const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const ActivityLog = require('../models/ActivityLog');
const { requireAdmin } = require('../middleware/auth');

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

// Get all users (Admin only)
router.get('/', requireAdmin, async (req, res) => {
  try {
    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 });
    
    res.json({ users });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Update user role (Admin only)
router.patch('/:id/role', requireAdmin, [
  body('role').isIn(['admin', 'editor', 'viewer'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const { role } = req.body;
    const userId = req.params.id;
    
    // Prevent admin from changing their own role
    if (userId === req.user._id.toString()) {
      return res.status(400).json({ error: 'Cannot change your own role' });
    }
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const oldRole = user.role;
    user.role = role;
    await user.save();

    // Create activity log
    await createActivityLog(req.user._id, 'change_role', 'users', {
      targetUser: user.username,
      oldRole,
      newRole: role
    });

    res.json({
      message: 'User role updated successfully',
      user: user.toJSON()
    });
  } catch (error) {
    console.error('Error updating user role:', error);
    res.status(500).json({ error: 'Failed to update user role' });
  }
});

// Delete user (Admin only)
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const userId = req.params.id;
    
    // Prevent admin from deleting themselves
    if (userId === req.user._id.toString()) {
      return res.status(400).json({ error: 'Cannot delete your own account' });
    }
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    await User.findByIdAndDelete(userId);

    // Create activity log
    await createActivityLog(req.user._id, 'delete_user', 'users', {
      deletedUser: user.username,
      deletedUserRole: user.role
    });

    res.json({
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

module.exports = router;

