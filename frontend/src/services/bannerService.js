import api from './api';

export const bannerService = {
  // Generate a new banner
  generateBanner: async (bannerData) => {
    try {
      const response = await api.post('/api/generate', {
        theme: bannerData.theme,
        products: Array.isArray(bannerData.products) 
          ? bannerData.products 
          : bannerData.products.split(',').map(p => p.trim()),
        offer: bannerData.offer,
        colors: Array.isArray(bannerData.colors) 
          ? bannerData.colors 
          : bannerData.colors.split(',').map(c => c.trim()),
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to generate banner');
    }
  },

  // Get user's banner history
  getBannerHistory: async () => {
    try {
      console.log('Fetching banner history from /api/banners');
      const response = await api.get('/api/banners');
      console.log('Banner history response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching banner history:', error);
      throw new Error(error.response?.data?.error || 'Failed to fetch banner history');
    }
  },

  // Save a banner to user's collection
  saveBanner: async (bannerData) => {
    try {
      const response = await api.post('/api/banners', bannerData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to save banner');
    }
  },

  // Get banner statistics
  getBannerStats: async () => {
    try {
      const response = await api.get('/api/banners/stats');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to fetch banner statistics');
    }
  },

  // Delete a banner
  deleteBanner: async (bannerId) => {
    try {
      const response = await api.delete(`/api/banners/${bannerId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to delete banner');
    }
  },
};