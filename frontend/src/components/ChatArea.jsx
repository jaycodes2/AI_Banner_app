import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiImage, FiRefreshCw, FiChevronDown, FiSend } from 'react-icons/fi';
import { useBanner } from '../hooks/useBanner';
import { useToast } from '../hooks/useToast';
import { useBanner as useBannerContext } from '../context/BannerContext';
import Button from './ui/Button';
import Input from './ui/Input';
import ToastContainer from './ui/Toast';

function ChatArea() {
  const [imageUrl, setImageUrl] = useState(null);
  const [currentPrompt, setCurrentPrompt] = useState('');
  const bottomRef = useRef();
  const [showPrompt, setShowPrompt] = useState(false);

  const [formData, setFormData] = useState({
    theme: '',
    products: '',
    offer: '',
    colors: ''
  });

  const [errors, setErrors] = useState({});

  const { isGenerating, generateBanner } = useBanner();
  const { toasts, toast, removeToast } = useToast();
  const { saveBanner } = useBannerContext();

  const validateForm = () => {
    const newErrors = {};

    if (!formData.theme.trim()) {
      newErrors.theme = 'Theme is required';
    }
    if (!formData.products.trim()) {
      newErrors.products = 'Products are required';
    }
    if (!formData.offer.trim()) {
      newErrors.offer = 'Promotional offer is required';
    }
    if (!formData.colors.trim()) {
      newErrors.colors = 'Color palette is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleBannerSubmit = async () => {
    if (!validateForm()) {
      toast.error('Validation Error', 'Please fill in all required fields');
      return;
    }

    try {
      // First generate the banner
      const result = await generateBanner(formData);
      setImageUrl(result.image_url);
      setCurrentPrompt(result.prompt);

      // Then save it to the user's collection
      const bannerData = {
        name: `${formData.theme} Banner`,
        imageUrl: result.image_url,
        theme: formData.theme,
        isAiGenerated: true,
        createdAt: new Date().toISOString()
      };

      console.log('Saving banner with data:', bannerData);
      const savedBanner = await saveBanner(bannerData);
      console.log('Banner saved successfully:', savedBanner);

      toast.success('Success!', 'Banner generated and saved successfully');
    } catch (error) {
      console.error('Error in handleBannerSubmit:', error);
      toast.error('Generation Failed', error.message || 'An error occurred');
    }
  };

  const handleReset = () => {
    setFormData({
      theme: '',
      products: '',
      offer: '',
      colors: ''
    });
    setImageUrl(null);
    setCurrentPrompt('');
    setErrors({});
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [imageUrl]);

  // Handle smooth scrolling when content changes
  useEffect(() => {
    const handleScroll = () => {
      window.requestAnimationFrame(() => {
        clearTimeout(window.scrollTimeout);
        window.scrollTimeout = setTimeout(() => {
          // Scroll handling logic here if needed
        }, 100);
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(window.scrollTimeout);
    };
  }, []);

  return (
    <div className="relative flex-1 overflow-y-auto h-screen bg-[#0f1419] text-white font-geist scroll-smooth">
      {/* Professional header */}
      <header className="sticky top-0 z-20 flex items-center justify-between px-6 py-3 bg-[#0f1419] border-b border-[#2d3748]/40 backdrop-blur-sm bg-opacity-80">
        <div className="flex items-center">
          <div className="flex items-center justify-center w-9 h-9 mr-3 bg-gradient-to-br from-[#3b82f6] to-[#6366f1] rounded-lg shadow-lg">
            <FiImage className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-medium tracking-tight text-white">Banner Generator</h1>
        </div>
        <div className="flex items-center space-x-3">
          <button className="p-2 rounded-md hover:bg-[#2d3748]/40 transition-colors text-gray-300 hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="5"></circle>
              <line x1="12" y1="1" x2="12" y2="3"></line>
              <line x1="12" y1="21" x2="12" y2="23"></line>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
              <line x1="1" y1="12" x2="3" y2="12"></line>
              <line x1="21" y1="12" x2="23" y2="12"></line>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
            </svg>
          </button>
        </div>
      </header>

      {/* Main content area */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 py-8">
        {/* Form Section with professional styling */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-[#1a202c] rounded-xl border border-[#2d3748] overflow-hidden shadow-lg"
        >
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.05 }}
              >
                <Input
                  label="Theme"
                  placeholder="e.g., Diwali, Christmas, Black Friday"
                  value={formData.theme}
                  onChange={(e) => handleInputChange('theme', e.target.value)}
                  error={errors.theme}
                  className="bg-[#141a24] border-[#2d3748] focus:border-[#3b82f6] text-white rounded-lg"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <Input
                  label="Products"
                  placeholder="e.g., Electronics, Fashion, Home Decor"
                  value={formData.products}
                  onChange={(e) => handleInputChange('products', e.target.value)}
                  error={errors.products}
                  className="bg-[#141a24] border-[#2d3748] focus:border-[#3b82f6] text-white rounded-lg"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.15 }}
              >
                <Input
                  label="Promotional Offer"
                  placeholder="e.g., 50% OFF, Buy 2 Get 1 Free"
                  value={formData.offer}
                  onChange={(e) => handleInputChange('offer', e.target.value)}
                  error={errors.offer}
                  className="bg-[#141a24] border-[#2d3748] focus:border-[#3b82f6] text-white rounded-lg"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <Input
                  label="Color Palette"
                  placeholder="e.g., Red, Gold, Green"
                  value={formData.colors}
                  onChange={(e) => handleInputChange('colors', e.target.value)}
                  error={errors.colors}
                  className="bg-[#141a24] border-[#2d3748] focus:border-[#3b82f6] text-white rounded-lg"
                />
              </motion.div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={handleBannerSubmit}
                loading={isGenerating}
                disabled={isGenerating}
                className="bg-gradient-to-r from-[#3b82f6] to-[#6366f1] hover:from-[#2563eb] hover:to-[#4f46e5] text-white border-none rounded-lg shadow-md transition-all duration-300"
                size="md"
              >
                <FiImage className="w-4 h-4 mr-2" />
                {isGenerating ? 'Generating...' : 'Generate Banner'}
                {!isGenerating && <FiSend className="w-4 h-4 ml-2" />}
              </Button>

              {(imageUrl || Object.values(formData).some(v => v.trim())) && (
                <Button
                  onClick={handleReset}
                  variant="secondary"
                  size="md"
                  disabled={isGenerating}
                  className="bg-[#141a24] hover:bg-[#1e2734] border border-[#2d3748] text-gray-300 rounded-lg transition-all duration-300"
                >
                  <FiRefreshCw className="w-4 h-4 mr-2" />
                  Reset
                </Button>
              )}
            </div>
          </div>

          {/* Generated Banner Section with professional styling */}
          {imageUrl && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{
                duration: 0.4,
                ease: "easeInOut",
              }}
              className="bg-[#141a24] p-8 border-t border-[#2d3748]"
            >
              <div className="text-center mb-6">
                <motion.h3
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-xl font-medium text-white mb-2"
                >
                  Your Banner is Ready
                </motion.h3>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-gray-400 text-sm"
                >
                  Right-click to save or drag to download
                </motion.p>
              </div>

              <motion.div
                initial={{ opacity: 0, scale: 0.99 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1, duration: 0.4 }}
                className="mb-6 relative"
              >
                <div className="relative p-1 bg-[#0f1419] rounded-lg border border-[#2d3748] overflow-hidden shadow-md">
                  <img
                    src={imageUrl}
                    alt="Generated Banner"
                    className="w-full h-auto rounded-md"
                  />
                </div>
              </motion.div>

              {currentPrompt && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mt-6"
                >
                  <div
                    onClick={() => setShowPrompt(!showPrompt)}
                    className="flex items-center justify-between p-4 bg-[#1a202c] rounded-t-lg border border-[#2d3748] cursor-pointer hover:bg-[#1e2734] transition-colors"
                  >
                    <h4 className="font-medium text-gray-300 text-sm flex items-center">
                      <span className="w-2 h-2 bg-[#3b82f6] rounded-full mr-2"></span>
                      AI Prompt Used
                    </h4>
                    <motion.div
                      animate={{ rotate: showPrompt ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <FiChevronDown className="w-5 h-5 text-gray-400" />
                    </motion.div>
                  </div>

                  <AnimatePresence>
                    {showPrompt && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="p-4 bg-[#141a24] rounded-b-lg border-x border-b border-[#2d3748]"
                      >
                        <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap break-words">
                          "{currentPrompt}"
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}
            </motion.div>
          )}
        </motion.div>
        <div ref={bottomRef} />
      </div>

      {/* Custom styled Toast Container */}
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </div>
  );
}

export default ChatArea;