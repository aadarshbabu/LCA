
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter } from 'lucide-react';
import VideoGrid from '@/components/VideoGrid';
import { Checkbox } from "@/components/ui/checkbox";
import { useFetchVideos } from '@/hooks/useFetchVideos';
import { Skeleton } from '@/components/ui/skeleton';

const DiscoverPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [priceFilter, setPriceFilter] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('all');

  // Determine price filter type for the hook
  const priceFilterType = priceFilter.includes('free') && !priceFilter.includes('paid') 
    ? 'free' 
    : priceFilter.includes('paid') && !priceFilter.includes('free')
      ? 'paid'
      : null;

  // Get category based on active tab
  const getCategory = () => {
    switch(activeTab) {
      case 'javascript': return 'JavaScript';
      case 'python': return 'Python';
      case 'webdev': return null; // Handle special case in the component
      case 'mobile': return 'iOS'; // This matches the mock data
      default: return null;
    }
  };

  // Fetch videos with the appropriate filters
  const { videos, isLoading, error } = useFetchVideos({ 
    category: getCategory(),
    filterByPrice: priceFilterType as 'free' | 'paid' | null,
    limit: 12
  });

  // Filter web development videos for the special case
  const filteredVideos = activeTab === 'webdev' 
    ? videos.filter(v => ['React', 'CSS', 'Angular'].includes(v.category))
    : videos;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Searching for:", searchTerm);
  };

  const togglePriceFilter = (value: string) => {
    setPriceFilter(prev => 
      prev.includes(value) 
        ? prev.filter(item => item !== value)
        : [...prev, value]
    );
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold">Discover Coding Content</h1>
        
        <div className="flex items-center gap-2 w-full md:w-auto">
          <form onSubmit={handleSearch} className="relative flex-1">
            <Input
              type="text"
              placeholder="Search videos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-10"
            />
            <button 
              type="submit" 
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
            >
              <Search className="h-4 w-4 text-muted-foreground" />
            </button>
          </form>
          
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => setFilterOpen(!filterOpen)}
            className={filterOpen ? "bg-secondary text-secondary-foreground" : ""}
          >
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {filterOpen && (
        <div className="bg-card p-4 rounded-lg shadow-sm mb-6">
          <h3 className="font-medium mb-3">Filter by:</h3>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="free" 
                checked={priceFilter.includes('free')} 
                onCheckedChange={() => togglePriceFilter('free')}
              />
              <label htmlFor="free" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Free
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="paid" 
                checked={priceFilter.includes('paid')} 
                onCheckedChange={() => togglePriceFilter('paid')}
              />
              <label htmlFor="paid" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Paid
              </label>
            </div>
          </div>
        </div>
      )}
      
      <Tabs 
        defaultValue="all" 
        className="space-y-6"
        onValueChange={(value) => setActiveTab(value)}
      >
        <TabsList>
          <TabsTrigger value="all">All Topics</TabsTrigger>
          <TabsTrigger value="javascript">JavaScript</TabsTrigger>
          <TabsTrigger value="python">Python</TabsTrigger>
          <TabsTrigger value="webdev">Web Dev</TabsTrigger>
          <TabsTrigger value="mobile">Mobile</TabsTrigger>
        </TabsList>
        
        {isLoading ? (
          <div className="py-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {Array(8).fill(0).map((_, index) => (
                <div key={index} className="space-y-3">
                  <Skeleton className="h-48 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              ))}
            </div>
          </div>
        ) : error ? (
          <div className="py-8 text-center">
            <p className="text-red-500">Failed to load videos. Please try again later.</p>
          </div>
        ) : (
          <>
            <TabsContent value="all">
              <VideoGrid videos={filteredVideos} />
            </TabsContent>
            
            <TabsContent value="javascript">
              <VideoGrid videos={filteredVideos} />
            </TabsContent>
            
            <TabsContent value="python">
              <VideoGrid videos={filteredVideos} />
            </TabsContent>
            
            <TabsContent value="webdev">
              <VideoGrid videos={filteredVideos} />
            </TabsContent>
            
            <TabsContent value="mobile">
              <VideoGrid videos={filteredVideos} />
            </TabsContent>
          </>
        )}
      </Tabs>
    </div>
  );
};

export default DiscoverPage;
