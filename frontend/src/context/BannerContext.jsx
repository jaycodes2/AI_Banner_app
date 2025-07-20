import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { bannerService } from "../services/bannerService";
import { useAuth } from "./AuthContext";

const BannerContext = createContext();

export const BannerProvider = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  const [bannerState, setBannerState] = useState({
    banners: [],
    stats: {
      totalBanners: 0,
      aiGenerations: 0,
      templatesUsed: 0
    },
    isLoading: false
  });

  // Fetch user's banners and stats when authenticated
  const fetchBannerData = useCallback(async () => {
    if (!isAuthenticated) return;
    
    setBannerState(prev => ({ ...prev, isLoading: true }));
    
    try {
      // Fetch banners in parallel with stats
      const [bannersResponse, statsResponse] = await Promise.all([
        bannerService.getBannerHistory(),
        bannerService.getBannerStats()
      ]);
      
      // Log the responses for debugging
      console.log('Fetched banner data:', { 
        bannersResponse, 
        statsResponse,
        hasBanners: bannersResponse && Array.isArray(bannersResponse.banners),
        bannerCount: bannersResponse?.banners?.length || 0
      });
      
      // Update state with the fetched data
      setBannerState({
        banners: Array.isArray(bannersResponse?.banners) ? bannersResponse.banners : [],
        stats: statsResponse || {
          totalBanners: 0,
          aiGenerations: 0,
          templatesUsed: 0
        },
        isLoading: false
      });
    } catch (error) {
      console.error("Failed to fetch banner data:", error);
      setBannerState(prev => ({ ...prev, isLoading: false }));
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchBannerData();
  }, [fetchBannerData, user?.id]);

  // Save a new banner and update stats
  const saveBanner = async (bannerData) => {
    setBannerState(prev => ({ ...prev, isLoading: true }));
    
    try {
      console.log('Saving banner:', bannerData);
      const response = await bannerService.saveBanner(bannerData);
      console.log('Banner saved response:', response);
      
      // Update local state with new banner and increment stats
      setBannerState(prev => {
        console.log('Updating banner state:', {
          currentBanners: prev.banners,
          currentStats: prev.stats,
          newBanner: response.banner
        });
        
        return {
          banners: [response.banner, ...prev.banners],
          stats: {
            ...prev.stats,
            totalBanners: (prev.stats.totalBanners || 0) + 1,
            aiGenerations: bannerData.isAiGenerated 
              ? (prev.stats.aiGenerations || 0) + 1 
              : (prev.stats.aiGenerations || 0),
            templatesUsed: bannerData.templateId 
              ? (prev.stats.templatesUsed || 0) + 1 
              : (prev.stats.templatesUsed || 0)
          },
          isLoading: false
        };
      });
      
      // Refresh banner data to ensure consistency
      setTimeout(() => {
        fetchBannerData();
      }, 1000);
      
      return response.banner;
    } catch (error) {
      console.error('Error saving banner:', error);
      setBannerState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  // Delete a banner and update stats
  const deleteBanner = async (bannerId) => {
    try {
      await bannerService.deleteBanner(bannerId);
      
      // Find the banner to be deleted to update stats correctly
      const bannerToDelete = bannerState.banners.find(b => b.id === bannerId);
      
      // Update local state by removing banner and decrementing stats
      setBannerState(prev => ({
        banners: prev.banners.filter(banner => banner.id !== bannerId),
        stats: {
          ...prev.stats,
          totalBanners: Math.max(0, prev.stats.totalBanners - 1),
          aiGenerations: bannerToDelete?.isAiGenerated 
            ? Math.max(0, prev.stats.aiGenerations - 1) 
            : prev.stats.aiGenerations,
          templatesUsed: bannerToDelete?.templateId 
            ? Math.max(0, prev.stats.templatesUsed - 1) 
            : prev.stats.templatesUsed
        },
        isLoading: false
      }));
      
      return true;
    } catch (error) {
      console.error("Failed to delete banner:", error);
      throw error;
    }
  };

  // Refresh banner data
  const refreshBannerData = () => {
    fetchBannerData();
  };

  return (
    <BannerContext.Provider value={{ 
      ...bannerState, 
      saveBanner, 
      deleteBanner, 
      refreshBannerData 
    }}>
      {children}
    </BannerContext.Provider>
  );
};

export const useBanner = () => useContext(BannerContext);