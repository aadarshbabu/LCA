
import React from 'react';
import { Heart, Play } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';

export interface VideoCardProps {
  id: string;
  title: string;
  thumbnail: string;
  price: number; // 0 for free
  category: string;
  views: number;
  duration: string;
}

const VideoCard: React.FC<VideoCardProps> = ({
  id,
  title,
  thumbnail,
  price,
  category,
  views,
  duration,
}) => {
  const formatViews = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  return (
    <Card className="h-full overflow-hidden transition-all hover:shadow-md">
      <Link to={`/video/${id}`} className="block relative group">
        <div className="aspect-video overflow-hidden relative">
          <img
            src={thumbnail}
            alt={title}
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Button size="sm" variant="secondary" className="rounded-full">
              <Play className="h-4 w-4 mr-1" /> Preview
            </Button>
          </div>
          <Badge 
            variant={price === 0 ? "secondary" : "default"}
            className="absolute top-2 right-2"
          >
            {price === 0 ? 'FREE' : `$${price.toFixed(2)}`}
          </Badge>
          <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
            {duration}
          </div>
        </div>
      </Link>
      <CardContent className="p-4">
        <div className="flex justify-between">
          <Badge variant="outline" className="mb-2">{category}</Badge>
          <span className="text-xs text-muted-foreground">{formatViews(views)} views</span>
        </div>
        <Link to={`/video/${id}`}>
          <h3 className="font-medium line-clamp-2 hover:text-primary transition-colors">{title}</h3>
        </Link>
      </CardContent>
      <CardFooter className="px-4 pb-4 pt-0 flex justify-between">
        <Button variant="outline" size="sm" className="w-[48%]">
          <Heart className="h-4 w-4 mr-1" /> Wishlist
        </Button>
        <Button size="sm" className="w-[48%]" variant={price === 0 ? "secondary" : "default"}>
          {price === 0 ? 'Watch' : 'Purchase'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default VideoCard;
