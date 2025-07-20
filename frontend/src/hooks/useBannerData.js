import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { bannerService } from "../services/bannerService";
import { useAuth } from "./AuthContext";

const BannerContext = createContext();

export const BannerProvider = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  const [banners, setBanners] = useState([]);
  const [stats, setStats] = useState({
    totalBanners: 0,
    aiGenerations: 0,
    templatesUsed: 0
  });
  const [isLoading, setIsLoading] = useState(false);

  const fetchBannerData = useCallback(async () => {
    if (!isAuthenticated) return;

    setIsLoading(true);
    try {
      const [bannersResponse, statsResponse] = await Promise.all([
        bannerService.getBannerHistory(),
        bannerService.getBannerStats()
      ]);

      setBanners(Array.isArray(bannersResponse?.banners) ? bannersResponse.banners : []);
      setStats(statsResponse || {
        totalBanners: 0,
        aiGenerations: 0,
        templatesUsed: 0
      });

    } catch (error) {
      console.error("Failed to fetch banner data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchBannerData();
  }, [fetchBannerData, user?.id]);

  const saveBanner = async (bannerData) => {
    setIsLoading(true);
    try {
      const response = await bannerService.saveBanner(bannerData);
      setBanners(prev => [response.banner, ...prev]);
      setStats(prev => ({
        ...prev,
        totalBanners: prev.totalBanners + 1
      }));
      fetchBannerData();
    } catch (error) {
      console.error('Error saving banner:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteBanner = async (bannerId) => {
    try {
      await bannerService.deleteBanner(bannerId);
      setBanners(prev => prev.filter(b => b.id !== bannerId));
      setStats(prev => ({
        ...prev,
        totalBanners: Math.max(0, prev.totalBanners - 1)
      }));
      fetchBannerData();
    } catch (error) {
      console.error("Failed to delete banner:", error);
    }
  };

  const refreshBannerData = () => {
    fetchBannerData();
  };

  return (
    <BannerContext.Provider value={{
      banners,
      stats,
      isLoading,
      saveBanner,
      deleteBanner,
      refreshBannerData
    }}>
      {children}
    </BannerContext.Provider>
  );
};

export const useBanner = () => useContext(BannerContext);
