
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Loader2 } from 'lucide-react';

const AdminDashboard = () => {
  const [pendingVideos, setPendingVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { profile } = useAuth();

  useEffect(() => {
    fetchPendingVideos();
  }, []);

  const fetchPendingVideos = async () => {
    try {
      const { data, error } = await supabase
        .from('videos')
        .select(`
          *,
          profiles:user_id (username)
        `)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPendingVideos(data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch pending videos",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVideoAction = async (videoId: string, status: 'approved' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('videos')
        .update({ status })
        .eq('id', videoId);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Video ${status} successfully`,
      });

      setPendingVideos(pendingVideos.filter(video => video.id !== videoId));
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update video status",
        variant: "destructive",
      });
    }
  };

  if (profile?.role !== 'admin') {
    return (
      <div className="container mx-auto py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
        <p>You do not have permission to access this page.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      
      <div className="bg-card rounded-lg p-6 mb-8 border">
        <h2 className="text-xl font-semibold mb-4">Pending Videos</h2>
        
        {pendingVideos.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No pending videos to review
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Submitted By</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Submitted Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pendingVideos.map((video) => (
                <TableRow key={video.id}>
                  <TableCell>{video.title}</TableCell>
                  <TableCell>{video.profiles?.username || 'Unknown'}</TableCell>
                  <TableCell>{video.category}</TableCell>
                  <TableCell>{new Date(video.created_at).toLocaleDateString()}</TableCell>
                  <TableCell className="space-x-2">
                    <Button 
                      size="sm" 
                      onClick={() => handleVideoAction(video.id, 'approved')}
                    >
                      Approve
                    </Button>
                    <Button 
                      size="sm" 
                      variant="destructive"
                      onClick={() => handleVideoAction(video.id, 'rejected')}
                    >
                      Reject
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
