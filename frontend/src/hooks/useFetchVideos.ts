
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { VideoCardProps } from '@/components/VideoCard';

interface UseFetchVideosOptions {
  category?: string;
  limit?: number;
  filterByPrice?: 'free' | 'paid' | null;
}

export const useFetchVideos = ({ category, limit = 8, filterByPrice }: UseFetchVideosOptions = {}) => {
  const [videos, setVideos] = useState<VideoCardProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Start building the query
        let query = supabase
          .from('videos')
          .select('*')
          .eq('status', 'approved');

        // Apply category filter if provided
        if (category) {
          query = query.eq('category', category);
        }

        // Apply price filter if provided
        if (filterByPrice === 'free') {
          query = query.eq('price', 0);
        } else if (filterByPrice === 'paid') {
          query = query.gt('price', 0);
        }

        // Apply limit and order by views (most popular first)
        query = query.order('views', { ascending: false }).limit(limit);

        const { data, error } = await query;

        if (error) throw error;

        // Transform the data to match VideoCardProps format
        const formattedVideos: VideoCardProps[] = data.map(video => ({
          id: video.id,
          title: video.title,
          thumbnail: video.thumbnail_url || 'https://images.unsplash.com/photo-1581276879432-15e50529f34b?q=80&w=2070&auto=format&fit=crop',
          price: 0, // Default to free if price is not available
          category: video.category || 'Uncategorized',
          views: video.views || 0,
          duration: video.duration || '0:00'
        }));

        setVideos(formattedVideos);
      } catch (err: any) {
        console.error('Error fetching videos:', err.message);
        setError('Failed to fetch videos');
        // Provide some fallback videos if fetching fails
        setVideos([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVideos();
  }, [category, limit, filterByPrice]);

  return { videos, isLoading, error };
};
