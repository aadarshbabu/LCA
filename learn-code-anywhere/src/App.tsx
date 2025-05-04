
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "@/components/MainLayout";
import LandingPage from "@/pages/LandingPage";
import DiscoverPage from "@/pages/DiscoverPage";
import VideoDetailPage from "@/pages/VideoDetailPage";
import AuthPage from "@/pages/AuthPage";
import NotFound from "@/pages/NotFound";
import AdminDashboard from "@/pages/AdminDashboard";
import SubmitVideo from "@/pages/SubmitVideo";
import ProfilePage from "@/pages/ProfilePage";
import ProtectedRoute from "@/components/ProtectedRoute";
import { AuthProvider } from "@/contexts/AuthContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <MainLayout>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/discover" element={<DiscoverPage />} />
              <Route path="/video/:id" element={<VideoDetailPage />} />
              
              {/* Public routes (accessible when logged out) */}
              <Route 
                path="/login" 
                element={<ProtectedRoute requireAuth={false}><AuthPage /></ProtectedRoute>} 
              />
              
              {/* Protected routes (require authentication) */}
              <Route element={<ProtectedRoute />}>
                <Route path="/submit" element={<SubmitVideo />} />
                <Route path="/profile" element={<ProfilePage />} />
              </Route>
              
              {/* Admin routes (require admin role) */}
              <Route element={<ProtectedRoute requireAdmin={true} />}>
                <Route path="/admin" element={<AdminDashboard />} />
              </Route>
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </MainLayout>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
