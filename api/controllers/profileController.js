import { supabaseAdmin } from '../config/supabase.js';

export const getProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;

    let { data: profile, error } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      return res.status(400).json({ success: false, message: error.message });
    }

    // Fallback if profile row not created yet by trigger
    if (!profile) {
      profile = {
        id: req.user.id,
        email: req.user.email,
        full_name: req.user.user_metadata?.full_name || '',
        created_at: req.user.created_at || new Date().toISOString(),
      };
    }

    return res.status(200).json({
      success: true,
      data: profile,
    });
  } catch (err) {
    next(err);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { full_name } = req.body;

    if (full_name === undefined || typeof full_name !== 'string' || !full_name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Full name is required and cannot be empty.',
      });
    }

    const { data, error } = await supabaseAdmin
      .from('profiles')
      .upsert(
        {
          id: userId,
          email: req.user.email,
          full_name: full_name.trim(),
        },
        { onConflict: 'id' }
      )
      .select()
      .single();

    if (error) {
      return res.status(400).json({ success: false, message: error.message });
    }

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully.',
      data,
    });
  } catch (err) {
    next(err);
  }
};
