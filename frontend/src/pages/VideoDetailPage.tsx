
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Play, Lock, Share2 } from 'lucide-react';
import VideoGrid from '@/components/VideoGrid';

// Mock video data based on ID
const getVideoById = (id: string) => {
  const allVideos = [
    {
      id: '1',
      title: 'Complete React JS Course for Beginners',
      thumbnail: 'https://images.unsplash.com/photo-1581276879432-15e50529f34b?q=80&w=2070&auto=format&fit=crop',
      price: 0,
      category: 'React',
      views: 154000,
      duration: '2h 35m',
      description: 'Learn React JS from scratch with this comprehensive course for beginners. Master the fundamental concepts, hooks, state management, and build real-world projects.',
      instructor: 'Sarah Johnson',
      publishedDate: '2023-06-15',
      tags: ['react', 'javascript', 'frontend', 'web development']
    },
    {
      id: '2',
      title: 'Master Node.js: Build a Full Backend',
      thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=2070&auto=format&fit=crop',
      price: 29.99,
      category: 'Node.js',
      views: 89500,
      duration: '4h 20m',
      description: 'A comprehensive guide to building scalable backend applications with Node.js. Learn Express, MongoDB, authentication, and deploy your applications to production.',
      instructor: 'Michael Chen',
      publishedDate: '2023-08-22',
      tags: ['node.js', 'javascript', 'backend', 'express', 'mongodb']
    },
    // Add more videos as needed
  ];
  
  return allVideos.find(video => video.id === id);
};

// Mock related videos
const relatedVideos = [
  {
    id: '3',
    title: 'Python for AI and Machine Learning',
    thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=2070&auto=format&fit=crop',
    price: 49.99,
    category: 'Python',
    views: 275000,
    duration: '6h 10m'
  },
  {
    id: '4',
    title: 'Modern CSS & TailwindCSS Complete Guide',
    thumbnail: 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?q=80&w=2070&auto=format&fit=crop',
    price: 0,
    category: 'CSS',
    views: 124000,
    duration: '3h 45m'
  },
  {
    id: '6',
    title: 'Angular: From Zero to Hero',
    thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=2072&auto=format&fit=crop',
    price: 24.99,
    category: 'Angular',
    views: 83000,
    duration: '4h 30m'
  },
  {
    id: '8',
    title: 'JavaScript ES6+ Deep Dive',
    thumbnail: 'https://images.unsplash.com/photo-1649180556628-9ba704115795?q=80&w=2062&auto=format&fit=crop',
    price: 0,
    category: 'JavaScript',
    views: 185000,
    duration: '3h 20m'
  },
];

const VideoDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [isPreviewPlaying, setIsPreviewPlaying] = useState(false);
  const video = getVideoById(id || '');

  if (!video) {
    return (
      <div className="container mx-auto py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Video Not Found</h1>
        <p className="text-muted-foreground mb-8">The video you are looking for might be removed or doesn't exist.</p>
        <Button variant="default" onClick={() => window.history.back()}>
          Go Back
        </Button>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="aspect-video bg-muted rounded-lg overflow-hidden relative">
            {isPreviewPlaying ? (
              <div className="w-full h-full flex items-center justify-center">
                {/* This would be a real video player in a production app */}
                <div className="text-center">
                  <p className="mb-4">Preview video playing...</p>
                  <Button 
                    variant="outline" 
                    onClick={() => setIsPreviewPlaying(false)}
                  >
                    Close Preview
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <img 
                  src={video.thumbnail} 
                  alt={video.title} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center">
                  {video.price === 0 ? (
                    <Button 
                      size="lg"
                      className="mb-4"
                      onClick={() => setIsPreviewPlaying(true)}
                    >
                      <Play className="mr-2 h-5 w-5" /> Watch Now
                    </Button>
                  ) : (
                    <>
                      <Lock className="h-12 w-12 mb-4 text-muted" />
                      <Button 
                        variant="outline" 
                        size="lg" 
                        className="mb-4"
                        onClick={() => setIsPreviewPlaying(true)}
                      >
                        <Play className="mr-2 h-5 w-5" /> Watch 1-Min Preview
                      </Button>
                    </>
                  )}
                  <p className="text-muted-foreground">
                    {video.duration} • {video.views.toLocaleString()} views
                  </p>
                </div>
              </>
            )}
          </div>

          <div className="mt-6">
            <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
              <div>
                <h1 className="text-2xl font-bold">{video.title}</h1>
                <p className="text-muted-foreground">
                  By {video.instructor} • Published {formatDate(video.publishedDate)}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Heart className="mr-1 h-4 w-4" /> Add to Wishlist
                </Button>
                <Button variant="outline" size="sm">
                  <Share2 className="mr-1 h-4 w-4" /> Share
                </Button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              <Badge variant="secondary">{video.category}</Badge>
              {video.tags.map((tag, index) => (
                <Badge key={index} variant="outline">{tag}</Badge>
              ))}
            </div>

            <div className="prose max-w-none dark:prose-invert">
              <h2 className="text-xl font-semibold mb-2">About this course</h2>
              <p>{video.description}</p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-card rounded-lg p-6 shadow-sm border mb-6">
            <div className="mb-4 text-center">
              <h2 className="text-3xl font-bold mb-2">
                {video.price === 0 ? 'FREE' : `$${video.price}`}
              </h2>
              <p className="text-muted-foreground mb-4">
                {video.price === 0 
                  ? 'Login to watch this video for free' 
                  : 'One-time purchase, lifetime access'
                }
              </p>
              <Button className="w-full mb-2" size="lg">
                {video.price === 0 ? 'Watch Now' : 'Purchase'}
              </Button>
              {video.price > 0 && (
                <Button variant="outline" className="w-full" size="lg" onClick={() => setIsPreviewPlaying(true)}>
                  Watch Preview
                </Button>
              )}
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Duration:</span>
                <span className="font-medium">{video.duration}</span>
              </div>
              <div className="flex justify-between">
                <span>Category:</span>
                <span className="font-medium">{video.category}</span>
              </div>
              <div className="flex justify-between">
                <span>Instructor:</span>
                <span className="font-medium">{video.instructor}</span>
              </div>
              <div className="flex justify-between">
                <span>Published:</span>
                <span className="font-medium">{formatDate(video.publishedDate)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Related Videos</h2>
        <VideoGrid videos={relatedVideos} />
      </div>
    </div>
  );
};

export default VideoDetailPage;
