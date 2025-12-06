import { useState, useEffect } from 'react';
import { getUnsplashQuery } from '../data/vocabularyImageMapping';
import { getVocabularyImageUrl, hasVocabularyImageUrl } from '../data/vocabularyImageUrls';

// Cache to store fetched image URLs
const imageCache = new Map<string, string>();

// Default placeholder SVG
const defaultPlaceholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBvcGFjaXR5PSIuMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIzLjciPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iNiIvPjxwYXRoIGQ9Im0xNiA1OCAxNi0xOCAzMiAzMiIvPjxjaXJjbGUgY3g9IjUzIiBjeT0iMzUiIHI9IjciLz48L3N2Zz4KCg==';

/**
 * Generate a consistent hash number from a string
 * Used to create consistent random images for each word
 */
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

/**
 * Hook to fetch and cache images for vocabulary words
 * Priority: 1. Real Unsplash URLs, 2. Picsum Photos with consistent seed
 */
export function useVocabularyImage(word: string): string {
  const [imageUrl, setImageUrl] = useState<string>(defaultPlaceholder);

  useEffect(() => {
    // Check cache first
    if (imageCache.has(word)) {
      setImageUrl(imageCache.get(word)!);
      return;
    }

    let finalUrl: string;

    // PRIORITY 1: Check if we have a real Unsplash URL for this word
    if (hasVocabularyImageUrl(word)) {
      const realUrl = getVocabularyImageUrl(word);
      if (realUrl) {
        finalUrl = realUrl;
        imageCache.set(word, finalUrl);
        setImageUrl(finalUrl);
        return;
      }
    }

    // PRIORITY 2: Use Picsum Photos with consistent seed
    // Generate a consistent seed based on the word
    // This ensures the same word always gets the same image
    const seed = hashString(word);
    finalUrl = `https://picsum.photos/seed/${seed}/400/300`;
    
    // Store in cache and update state
    imageCache.set(word, finalUrl);
    setImageUrl(finalUrl);
  }, [word]);

  return imageUrl;
}

/**
 * Hook for vocabulary images with better error handling
 */
export function useVocabularyImageSafe(word: string) {
  const [imageUrl, setImageUrl] = useState<string>(defaultPlaceholder);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // Check cache first
    if (imageCache.has(word)) {
      setImageUrl(imageCache.get(word)!);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setHasError(false);

    try {
      let finalUrl: string;

      // PRIORITY 1: Real Unsplash URLs
      if (hasVocabularyImageUrl(word)) {
        const realUrl = getVocabularyImageUrl(word);
        if (realUrl) {
          finalUrl = realUrl;
          imageCache.set(word, finalUrl);
          setImageUrl(finalUrl);
          setIsLoading(false);
          return;
        }
      }

      // PRIORITY 2: Picsum Photos
      const seed = hashString(word);
      finalUrl = `https://picsum.photos/seed/${seed}/400/300`;
      
      imageCache.set(word, finalUrl);
      setImageUrl(finalUrl);
    } catch (error) {
      console.error('Error generating image URL for word:', word, error);
      setHasError(true);
      setImageUrl(defaultPlaceholder);
    } finally {
      setIsLoading(false);
    }
  }, [word]);

  return { imageUrl, isLoading, hasError };
}