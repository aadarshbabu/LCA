
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';
import FileUploader from './FileUploader';

const VideoSubmissionForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    video_url: '',
    thumbnail_url: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please login to submit videos",
        variant: "destructive",
      });
      return;
    }

    if (!formData.video_url) {
      toast({
        title: "Video required",
        description: "Please upload a video file",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('videos')
        .insert({
          ...formData,
          user_id: user.id,
        });

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Your video has been submitted for review",
      });
      
      setFormData({
        title: '',
        description: '',
        category: '',
        video_url: '',
        thumbnail_url: '',
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit video. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Input
          placeholder="Video Title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
          disabled={isSubmitting}
        />
      </div>
      
      <div>
        <Textarea
          placeholder="Video Description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          required
          disabled={isSubmitting}
          className="min-h-32"
        />
      </div>
      
      <div>
        <Input
          placeholder="Category"
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          required
          disabled={isSubmitting}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Upload Video</label>
        <FileUploader
          bucketName="videos"
          onUploadComplete={(url) => setFormData({ ...formData, video_url: url })}
          accept="video/*"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Upload Thumbnail</label>
        <FileUploader
          bucketName="thumbnails"
          onUploadComplete={(url) => setFormData({ ...formData, thumbnail_url: url })}
          accept="image/*"
        />
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Submitting...
          </>
        ) : 'Submit Video'}
      </Button>
    </form>
  );
};

export default VideoSubmissionForm;
