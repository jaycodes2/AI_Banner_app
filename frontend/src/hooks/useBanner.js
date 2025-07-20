import { useState } from 'react';
import { bannerService } from '../services/bannerService';

export const useBanner = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [bannerHistory, setBannerHistory] = useState([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  const generateBanner = async (bannerData) => {
    setIsGenerating(true);
    try {
      const result = await bannerService.generateBanner(bannerData);
      return result;
    } catch (error) {
      throw error;
    } finally {
      setIsGenerating(false);
    }
  };

  const loadBannerHistory = async () => {
    setIsLoadingHistory(true);
    try {
      const history = await bannerService.getBannerHistory();
      setBannerHistory(history);
      return history;
    } catch (error) {
      throw error;
    } finally {
      setIsLoadingHistory(false);
    }
  };

  return {
    isGenerating,
    generateBanner,
    bannerHistory,
    isLoadingHistory,
    loadBannerHistory,
  };
};