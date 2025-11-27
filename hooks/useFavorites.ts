import { useState, useEffect, useCallback } from 'react';

const getStorageKey = (userId: string) => `favorite_images_${userId}`;

export const useFavorites = (userId: string | undefined) => {
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!userId) {
        setFavoriteIds(new Set());
        return;
    };
    try {
      const storedFavorites = localStorage.getItem(getStorageKey(userId));
      if (storedFavorites) {
        setFavoriteIds(new Set(JSON.parse(storedFavorites)));
      } else {
        setFavoriteIds(new Set());
      }
    } catch (error) {
      console.error("Failed to parse favorites from localStorage", error);
      setFavoriteIds(new Set());
    }
  }, [userId]);

  const toggleFavorite = useCallback((imageId: string) => {
    if (!userId) return;
    
    setFavoriteIds(prevFavorites => {
      const newFavorites = new Set(prevFavorites);
      if (newFavorites.has(imageId)) {
        newFavorites.delete(imageId);
      } else {
        newFavorites.add(imageId);
      }
      
      try {
        localStorage.setItem(getStorageKey(userId), JSON.stringify(Array.from(newFavorites)));
      } catch (error) {
        console.error("Failed to save favorites to localStorage", error);
      }
      
      return newFavorites;
    });
  }, [userId]);

  return { favoriteIds, toggleFavorite };
};
