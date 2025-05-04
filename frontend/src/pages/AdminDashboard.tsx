import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2 } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { videoService } from "@/services/modules/video";

const AdminDashboard = () => {
  const {
    data: pendingVideos,
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: ["pendingVideo"],
    queryFn: videoService.pendingVideoList,
  });
  const { toast } = useToast();
  const { profile } = useAuth();
  const queryClient = useQueryClient();

  const handleVideoAction = async (
    videoId: string,
    status: "approved" | "rejected"
  ) => {
    try {
      await videoService.approvedVideo(videoId);

      queryClient.invalidateQueries({
        queryKey: ["pendingVideo"],
      });

      toast({
        title: "Success",
        description: `Video ${status} successfully`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update video status",
        variant: "destructive",
      });
    }
  };

  if (profile?.type !== "admin") {
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
                  <TableCell>{video.profiles?.username || "Unknown"}</TableCell>
                  <TableCell>{video.category}</TableCell>
                  <TableCell>
                    {new Date(video.created_at).toDateString()}
                  </TableCell>
                  <TableCell className="space-x-2">
                    <Button
                      size="sm"
                      onClick={() => handleVideoAction(video.id, "approved")}
                    >
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleVideoAction(video.id, "rejected")}
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
