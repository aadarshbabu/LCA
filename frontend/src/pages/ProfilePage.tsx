import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { authService } from "@/services/modules/auth";

const ProfilePage = () => {
  const { toast } = useToast();

  const {
    data: profileData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["profile"],
    queryFn: authService.getProfile,
  });
  const [username, setUsername] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  // const handleUpdateProfile = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   if (!profileData) return;

  //   setIsUpdating(true);
  //   try {
  //     const { error } = await supabase
  //       .from("profiles")
  //       .update({ username })
  //       .eq("id", profileData.id);

  //     if (error) throw error;

  //     toast({
  //       title: "Profile updated",
  //       description: "Your profile has been updated successfully",
  //     });
  //   } catch (error: any) {
  //     toast({
  //       title: "Error",
  //       description: error.message || "Failed to update profile",
  //       variant: "destructive",
  //     });
  //   } finally {
  //     setIsUpdating(false);
  //   }
  // };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading profile</div>;
  }

  if (!profileData) {
    return <div>Please log in to view your profile</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Your Profile</CardTitle>
          <CardDescription>Update your account information</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={profileData.email}
                disabled
                className="bg-muted"
              />
              <p className="text-sm text-muted-foreground">
                Email cannot be changed
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Your username"
              />
            </div>

            <Button type="submit" disabled={isUpdating}>
              {isUpdating ? "Updating..." : "Save Changes"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {profileData.isAdmin && (
        <Card className="max-w-2xl mx-auto mt-6 border-primary">
          <CardHeader>
            <CardTitle>Admin Access</CardTitle>
            <CardDescription>You have admin privileges</CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              As an admin, you can access the admin dashboard to manage content.
            </p>
            <Button
              className="mt-4"
              onClick={() => (window.location.href = "/admin")}
            >
              Go to Admin Dashboard
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="max-w-2xl mx-auto mt-6">
        <h2 className="text-xl font-bold mb-4">Your Submissions</h2>
        <div className="text-center text-muted-foreground py-8">
          No submissions yet. Go to the{" "}
          <a href="/submit" className="text-primary hover:underline">
            submission page
          </a>{" "}
          to upload a video.
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
