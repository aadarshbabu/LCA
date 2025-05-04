import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import VideoGrid from "@/components/VideoGrid";
import { useFetchVideos } from "@/hooks/useFetchVideos";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { videoService } from "@/services/modules/video";

const LandingPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { videos, isLoading, error } = useFetchVideos({ limit: 4 });
  const {
    data: popularCategories,
    isLoading: isCategoriesLoading,
    error: categoriesError,
  } = useQuery({
    queryKey: ["fetchPopularCategories"],
    queryFn: videoService.popularCategories,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app we would navigate to search results with the search term
    console.log("Searching for:", searchTerm);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-coder-blue/10 via-coder-purple/10 to-coder-green/10 py-16 md:py-24">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="gradient-text">Learn to Code.</span>
            <br />
            <span>Anytime. Anywhere.</span>
          </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-muted-foreground">
            Discover, learn, and master coding through our community-driven
            platform with expert-curated and user-contributed content.
          </p>

          <div className="max-w-md mx-auto">
            <form onSubmit={handleSearch} className="relative">
              <Input
                type="text"
                placeholder="What do you want to learn today?"
                className="w-full pl-4 pr-12 py-6 text-base"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Button
                type="submit"
                className="absolute right-1 top-1 bottom-1"
                size="icon"
              >
                <Search className="h-5 w-5" />
              </Button>
            </form>
          </div>
        </div>
      </section>

      {/* Trending Videos */}
      <section className="py-12">
        {isLoading ? (
          <div className="container mx-auto px-6">
            <h2 className="text-2xl font-bold mb-6">Trending Topics</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {Array(4)
                .fill(0)
                .map((_, index) => (
                  <div key={index} className="space-y-3">
                    <Skeleton className="h-48 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                ))}
            </div>
          </div>
        ) : error ? (
          <div className="container mx-auto px-6 text-center py-8">
            <p className="text-red-500">
              Failed to load trending videos. Please try again later.
            </p>
          </div>
        ) : (
          <VideoGrid videos={videos} title="Trending Topics" />
        )}
      </section>

      {/* Popular Categories */}
      <section className="py-12 bg-muted/50">
        <div className="container mx-auto px-6">
          <h2 className="text-2xl font-bold mb-8">Popular Categories</h2>
          {isCategoriesLoading ? (
            <p>Loading categories...</p>
          ) : categoriesError ? (
            <p className="text-red-500">
              Failed to load categories. Please try again later.
            </p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {popularCategories.map(
                (category: {
                  id: string;
                  name: string;
                  videoCount: number;
                }) => (
                  <div
                    key={category.id}
                    className="bg-card rounded-lg shadow-sm p-4 text-center hover:shadow-md transition-shadow cursor-pointer"
                  >
                    <h3 className="font-medium text-lg mb-1">
                      {category.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {category.videoCount} videos
                    </p>
                  </div>
                )
              )}
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-coder-blue/20 to-coder-purple/20">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to start your coding journey?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of learners who are mastering coding skills through
            our platform.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" className="px-8">
              Sign Up Free
            </Button>
            <Button size="lg" variant="outline" className="px-8">
              Browse Topics
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
