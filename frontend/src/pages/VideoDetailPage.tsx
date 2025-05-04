import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Play, Lock, Share2 } from "lucide-react";
import VideoGrid from "@/components/VideoGrid";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Video, videoService } from "@/services/modules/video";
import { Player } from "@/components/Player";

// Mock related videos
const relatedVideos = [
  {
    id: "3",
    title: "Python for AI and Machine Learning",
    thumbnail:
      "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=2070&auto=format&fit=crop",
    price: 49.99,
    category: "Python",
    views: 275000,
    duration: "6h 10m",
  },
  {
    id: "4",
    title: "Modern CSS & TailwindCSS Complete Guide",
    thumbnail:
      "https://images.unsplash.com/photo-1587620962725-abab7fe55159?q=80&w=2070&auto=format&fit=crop",
    price: 0,
    category: "CSS",
    views: 124000,
    duration: "3h 45m",
  },
  {
    id: "6",
    title: "Angular: From Zero to Hero",
    thumbnail:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=2072&auto=format&fit=crop",
    price: 24.99,
    category: "Angular",
    views: 83000,
    duration: "4h 30m",
  },
  {
    id: "8",
    title: "JavaScript ES6+ Deep Dive",
    thumbnail:
      "https://images.unsplash.com/photo-1649180556628-9ba704115795?q=80&w=2062&auto=format&fit=crop",
    price: 0,
    category: "JavaScript",
    views: 185000,
    duration: "3h 20m",
  },
];

const VideoDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [play, setPlay] = useState(false);
  const {
    data: video,
    isLoading,
    error,
  } = useQuery<Video, AxiosError<{ message: string; login: boolean }>>({
    queryKey: ["Video", id],
    queryFn: async () => videoService.fetchVideoById(id),
  });

  if (isLoading) {
    return (
      <div className="container mx-auto py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Loading...</h1>
      </div>
    );
  }

  console.log("err", error);

  if (error?.response?.data?.login === false) {
    return (
      <div className="container mx-auto py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Login is required</h1>
        <p className="text-muted-foreground mb-8">
          The video you are looking for to required login
        </p>
        <Button variant="default">
          <Link to={"/login"}>Login</Link>
        </Button>
      </div>
    );
  }

  if (error || !video) {
    return (
      <div className="container mx-auto py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Video Not Found</h1>
        <p className="text-muted-foreground mb-8">
          The video you are looking for might be removed or doesn't exist.
        </p>
        <Button variant="default" onClick={() => window.history.back()}>
          Go Back
        </Button>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="aspect-video bg-muted rounded-lg overflow-hidden relative">
            {!play ? (
              <>
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center">
                  <Button
                    size="lg"
                    className="mb-4"
                    onClick={() => setPlay(true)}
                  >
                    <Play className="mr-2 h-5 w-5" /> Watch Now
                  </Button>
                  <p className="text-muted-foreground">
                    {video.duration} minutes • {video.views.toLocaleString()}{" "}
                    views
                  </p>
                </div>
              </>
            ) : (
              <Player
                thumbnail={video.thumbnail}
                title={video.title}
                url={video.url}
              />
            )}
          </div>

          <div className="mt-6">
            <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
              <div>
                <h1 className="text-2xl font-bold">{video.title}</h1>
                <p className="text-muted-foreground">
                  By {video.user.firstName || "Unknown"}{" "}
                  {video.user.lastName || ""} • Published{" "}
                  {formatDate(video.createdAt)}
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
              <Badge variant="secondary">{video.category.name}</Badge>
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
                {video.price === 0 ? "FREE" : `$${video.price}`}
              </h2>
              <p className="text-muted-foreground mb-4">
                {video.price === 0
                  ? "Login to watch this video for free"
                  : "One-time purchase, lifetime access"}
              </p>
              <Button className="w-full mb-2" size="lg">
                {video.price === 0 ? "Watch Now" : "Purchase"}
              </Button>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Duration:</span>
                <span className="font-medium">{video.duration} minutes</span>
              </div>
              <div className="flex justify-between">
                <span>Category:</span>
                <span className="font-medium">{video.category.name}</span>
              </div>
              <div className="flex justify-between">
                <span>Instructor:</span>
                <span className="font-medium">
                  {video.user.firstName || "Unknown"}{" "}
                  {video.user.lastName || ""}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Published:</span>
                <span className="font-medium">
                  {formatDate(video.createdAt)}
                </span>
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
