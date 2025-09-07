import express from 'express';
import { supabase } from '../index.js';
import { authenticateToken, requireStaff } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/users
// @desc    Get all users (for admin purposes)
// @access  Private (Doctor and Receptionist)
router.get('/', authenticateToken, requireStaff, async (req, res) => {
  try {
    const { data: users, error } = await supabase
      .from('users')
      .select('id, username, role, full_name, email, created_at, last_login')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Get users error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch users'
      });
    }

    res.json({
      success: true,
      data: { users }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/users/profile
// @desc    Get current user profile (same as /api/auth/me)
// @access  Private
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        user: {
          id: req.user.id,
          username: req.user.username,
          role: req.user.role,
          full_name: req.user.full_name,
          email: req.user.email,
          created_at: req.user.created_at,
          last_login: req.user.last_login
        }
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/users/profile
// @desc    Update current user profile
// @access  Private
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { full_name, email } = req.body;
    
    const updateData = {
      updated_at: new Date().toISOString()
    };

    if (full_name) updateData.full_name = full_name;
    if (email) updateData.email = email;

    const { data: user, error } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', req.user.id)
      .select('id, username, role, full_name, email, created_at, last_login')
      .single();

    if (error) {
      console.error('Update profile error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to update profile'
      });
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: { user }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

export default router;
