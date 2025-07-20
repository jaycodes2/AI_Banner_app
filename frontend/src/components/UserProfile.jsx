import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useBanner as useNotificationBanner } from '../hooks/useBanner';
import API from '../services/api';
import Button from './ui/Button';
import Input from './ui/Input';
import {
  FiEdit3,
  FiSave,
  FiX,
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiGlobe,
  FiGithub,
  FiLinkedin,
  FiTwitter,
  FiCalendar,
  FiCamera,
  FiArrowLeft,
  FiLogOut,
  FiCheck,
  FiShare2,
  FiShield,
  FiClock
} from 'react-icons/fi';

const UserProfile = () => {
  const { user, refreshUser, logout } = useAuth();
  const navigate = useNavigate();
  const { showBanner } = useNotificationBanner();

  const [form, setForm] = useState({
    name: '', email: '', username: '', bio: '', address: '',
    phone: '', location: '', website: '', linkedin: '',
    github: '', twitter: '', profileImage: '', dob: '', skills: ''
  });

  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const fileInputRef = React.useRef(null);

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || '', email: user.email || '', username: user.username || '',
        bio: user.bio || '', address: user.address || '', phone: user.phone || '',
        location: user.location || '', website: user.website || '', linkedin: user.linkedin || '',
        github: user.github || '', twitter: user.twitter || '', profileImage: user.profileImage || '',
        dob: user.dob || '', skills: user.skills || ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePhotoClick = () => {
    if (editing && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
  
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      showBanner('Please upload a valid image (JPG, PNG, GIF, WEBP)', 'error');
      return;
    }
  
    setUploadingPhoto(true);
  
    try {
      const formData = new FormData();
      formData.append('profileImage', file);
  
      const token = localStorage.getItem('token');
      const res = await API.post('/api/upload-profile-image', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
  
      if (res.data.success && res.data.imageUrl) {
        setForm(prev => ({
          ...prev,
          profileImage: `${res.data.imageUrl}?t=${Date.now()}`
        }));
  
        showBanner('Profile photo updated successfully!', 'success');
  
      } else {
        showBanner(res.data.message || 'Failed to upload photo', 'error');
      }
    } catch (err) {
      console.error('Upload error:', err);
      showBanner('Server error during upload.', 'error');
    } finally {
      setUploadingPhoto(false);
    }
  };
  

  const handleSave = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await API.post('/api/update-profile', form, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        await refreshUser?.();
        setEditing(false);
        showBanner('Profile updated successfully!', 'success');
      } else {
        showBanner(res.data.message || 'Failed to update profile', 'error');
      }
    } catch (err) {
      showBanner('Server error. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Header Navigation */}
      <div className="bg-black border-b border-gray-800/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => navigate(-1)}
              className="bg-gray-800/60 border-gray-700/50 text-gray-300 hover:bg-gray-700/80 backdrop-blur-sm shadow-lg"
            >
              <FiArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>

            <div className="flex items-center gap-3">
              <Button
                variant="secondary"
                size="sm"
                className="bg-gray-800/60 border-gray-700/50 text-gray-300 hover:bg-gray-700/80 backdrop-blur-sm shadow-lg"
              >
                <FiShare2 className="w-4 h-4" />
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={logout}
                className="bg-red-600/80 hover:bg-red-600 border-red-500/50 backdrop-blur-sm shadow-lg"
              >
                <FiLogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Header */}
      <div className="bg-black border-b border-gray-800/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
            {/* Profile Picture */}
            <div className="relative w-32 h-32">
              <div
                onClick={handlePhotoClick}
                className="relative w-full h-full rounded-full overflow-hidden border-4 border-gray-600 shadow-xl cursor-pointer hover:opacity-80 transition"
              >
                {uploadingPhoto ? (
                  <div className="flex items-center justify-center bg-gray-800 w-full h-full">
                    <div className="w-8 h-8 border-4 border-t-cyan-400 rounded-full animate-spin"></div>
                  </div>
                ) : (
                  <img
                    src={form.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(form.name || 'User')}&size=200&background=374151&color=ffffff`}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                )}
                {editing && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white">
                    <FiCamera className="w-6 h-6" />
                  </div>
                )}
              </div>

              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                className="hidden"
                onChange={handlePhotoChange}
              />
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-white">{form.name || 'Your Name'}</h1>
                <div className="flex items-center gap-2">
                  <FiShield className="w-5 h-5 text-gray-400" />
                  <span className="text-sm bg-gray-800 text-gray-300 px-2 py-1 rounded-full border border-gray-700">
                    Verified
                  </span>
                </div>
              </div>
              <p className="text-xl text-gray-300 mb-3">@{form.username || 'username'}</p>
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                <div className="flex items-center gap-1">
                  <FiMapPin className="w-4 h-4" />
                  {form.location || 'Location not set'}
                </div>
                <div className="flex items-center gap-1">
                  <FiCalendar className="w-4 h-4" />
                  Joined March 2023
                </div>
                <div className="flex items-center gap-1">
                  <FiClock className="w-4 h-4" />
                  Last active 2 hours ago
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <AnimatePresence mode="wait">
                {editing ? (
                  <motion.div
                    key="editing"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="flex items-center gap-2"
                  >
                    <Button
                      variant="success"
                      onClick={handleSave}
                      loading={loading}
                    >
                      <FiSave className="w-4 h-4 mr-2" />
                      Save Changes
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => setEditing(false)}
                      className="bg-gray-700 border-gray-600 text-gray-200 hover:bg-gray-600"
                    >
                      <FiX className="w-4 h-4" />
                    </Button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="viewing"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                  >
                    <Button
                      variant="primary"
                      onClick={() => setEditing(true)}
                    >
                      <FiEdit3 className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 gap-8">
          {/* Main Content Area */}
          <div className="space-y-6">
            {/* Profile Content */}
            <div className="bg-black border border-gray-800/40 rounded-xl">
              <div className="flex border-b border-gray-700">
                <button
                  className="flex items-center gap-2 px-6 py-4 font-medium transition-colors text-white border-b-2 border-white bg-gray-900"
                >
                  <FiUser className="w-4 h-4" />
                  Profile
                </button>
              </div>

              <div className="p-6">
                <div className="space-y-6">
                  {/* Bio Section */}
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-3">About</h4>
                    {editing ? (
                      <textarea
                        name="bio"
                        value={form.bio}
                        onChange={handleChange}
                        placeholder="Tell us about yourself..."
                        rows={4}
                        className="w-full p-4 border border-gray-600 rounded-xl bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-500 focus:border-transparent resize-none"
                      />
                    ) : (
                      <p className="text-gray-300 leading-relaxed bg-gray-900 p-4 rounded-lg border border-gray-800">
                        {form.bio || 'No bio added yet. Click edit to add one!'}
                      </p>
                    )}
                  </div>

                  {/* Contact Information */}
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-3">Contact Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        { label: 'Email', name: 'email', icon: FiMail, type: 'email' },
                        { label: 'Phone', name: 'phone', icon: FiPhone, type: 'tel' },
                        { label: 'Website', name: 'website', icon: FiGlobe, type: 'url' },
                        { label: 'Location', name: 'location', icon: FiMapPin, type: 'text' }
                      ].map((field) => (
                        <div key={field.name} className="flex items-center gap-3 p-4 bg-gray-700/50 border border-gray-600 rounded-xl">
                          <field.icon className="w-5 h-5 text-gray-400" />
                          <div className="flex-1">
                            <div className="text-sm text-gray-400 mb-1">{field.label}</div>
                            {editing ? (
                              <Input
                                name={field.name}
                                type={field.type}
                                value={form[field.name]}
                                onChange={handleChange}
                                className="text-sm bg-gray-800 border-gray-600"
                              />
                            ) : (
                              <div className="text-white">
                                {form[field.name] || <span className="text-gray-500 italic">Not provided</span>}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Social Links */}
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-3">Social Links</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {[
                        { label: 'GitHub', name: 'github', icon: FiGithub, color: 'text-gray-300' },
                        { label: 'LinkedIn', name: 'linkedin', icon: FiLinkedin, color: 'text-blue-400' },
                        { label: 'Twitter', name: 'twitter', icon: FiTwitter, color: 'text-cyan-400' }
                      ].map((social) => (
                        <div key={social.name} className="flex items-center gap-3 p-4 bg-gray-700/50 border border-gray-600 rounded-xl">
                          <social.icon className={`w-5 h-5 ${social.color}`} />
                          <div className="flex-1">
                            <div className="text-sm text-gray-400 mb-1">{social.label}</div>
                            {editing ? (
                              <Input
                                name={social.name}
                                type="url"
                                value={form[social.name]}
                                onChange={handleChange}
                                className="text-sm bg-gray-800 border-gray-600"
                              />
                            ) : (
                              <div className="text-white text-sm">
                                {form[social.name] ? (
                                  <a href={form[social.name]} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">
                                    View Profile
                                  </a>
                                ) : (
                                  <span className="text-gray-500 italic">Not connected</span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;