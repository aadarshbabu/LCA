import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, LogIn, UserPlus } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { authService, RegisterUserData } from "@/services/modules/auth";
import { UserRegistrationSchema } from "@/schema/authSchema";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const AuthPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // Login form state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(UserRegistrationSchema),
  });

  // Check if user is already logged in
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        navigate("/");
      }
    };

    checkSession();
  }, [navigate]);

  // Mutation for login
  const loginMutation = useMutation({
    mutationKey: ["loginUser"],
    mutationFn: (data: { email: string; password: string }) => {
      return authService.login(data);
    },
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      loginMutation.mutate(
        { email: loginEmail, password: loginPassword },
        {
          onSuccess(data) {
            if (data.error) {
              toast({
                title: "Login failed",
                description: data.error,
                variant: "destructive",
              });
              return;
            }

            toast({
              title: "Login successful",
              description: "Welcome back!",
            });
            navigate("/");
          },
          onError(error) {
            toast({
              title: "Login failed",
              description:
                error.message || "Please check your credentials and try again",
              variant: "destructive",
            });
          },
        }
      );
    } catch (error) {
      toast({
        title: "Login failed",
        description:
          error.message || "Please check your credentials and try again",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const userRegistrationMutation = useMutation({
    mutationKey: ["registerUser"],
    mutationFn: (data: RegisterUserData) => {
      return authService.register(data);
    },
  });

  const handleSignup = async (data: RegisterUserData) => {
    setIsLoading(true);

    try {
      userRegistrationMutation.mutate(data, {
        onSuccess(data) {
          if (data.error) {
            toast({
              title: "Registration failed",
              description: data.error,
              variant: "destructive",
            });
            return;
          }

          toast({
            title: "Registration successful",
            description: "Please check your email to verify your account",
          });
          navigate("/");
        },
        onError(error) {
          toast({
            title: "Registration failed",
            description:
              error.message || "An error occurred during registration",
            variant: "destructive",
          });
        },
      });
    } catch (error) {
      toast({
        title: "Registration failed",
        description: error.message || "An error occurred during registration",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
      });

      if (error) throw error;
    } catch (error) {
      toast({
        title: "Login failed",
        description: error.message || "Unable to login with Google",
        variant: "destructive",
      });
    }
  };

  const handleGithubLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "github",
      });

      if (error) throw error;
    } catch (error) {
      toast({
        title: "Login failed",
        description: error.message || "Unable to login with GitHub",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto py-16 px-4 max-w-md">
      <Tabs defaultValue="login" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="signup">Sign Up</TabsTrigger>
        </TabsList>

        <TabsContent value="login">
          <Card>
            <CardHeader>
              <CardTitle>Login to your account</CardTitle>
              <CardDescription>
                Enter your credentials to access your account
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleLogin}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="email@example.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    disabled={isLoading}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="login-password">Password</Label>
                    <a
                      href="#"
                      className="text-sm text-primary hover:underline"
                    >
                      Forgot password?
                    </a>
                  </div>
                  <Input
                    id="login-password"
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    disabled={isLoading}
                    required
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="remember" />
                  <label
                    htmlFor="remember"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Remember me
                  </label>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Logging in...
                    </>
                  ) : (
                    <>
                      <LogIn className="mr-2 h-4 w-4" />
                      Login
                    </>
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>

        <TabsContent value="signup">
          <Card>
            <CardHeader>
              <CardTitle>Create an account</CardTitle>
              <CardDescription>
                Sign up to start exploring coding content
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit(handleSignup)}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Controller
                    name="firstName"
                    control={control}
                    render={({ field }) => (
                      <Input
                        id="firstName"
                        placeholder="John"
                        {...field}
                        className={errors.firstName ? "border-red-500" : ""}
                      />
                    )}
                  />
                  {errors.firstName && (
                    <p className="text-red-500 text-sm">
                      {typeof errors.firstName.message === "string"
                        ? errors.firstName.message
                        : "Invalid input"}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Controller
                    name="lastName"
                    control={control}
                    render={({ field }) => (
                      <Input
                        id="lastName"
                        placeholder="Doe"
                        {...field}
                        className={errors.lastName ? "border-red-500" : ""}
                      />
                    )}
                  />
                  {errors.lastName && (
                    <p className="text-red-500 text-sm">
                      {typeof errors.lastName.message === "string"
                        ? errors.lastName.message
                        : "Invalid input"}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Controller
                    name="email"
                    control={control}
                    render={({ field }) => (
                      <Input
                        id="email"
                        type="email"
                        placeholder="email@example.com"
                        {...field}
                        className={errors.email ? "border-red-500" : ""}
                      />
                    )}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm">
                      {typeof errors.email.message === "string"
                        ? errors.email.message
                        : "Invalid input"}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Controller
                    name="password"
                    control={control}
                    render={({ field }) => (
                      <Input
                        id="password"
                        type="password"
                        {...field}
                        className={errors.password ? "border-red-500" : ""}
                      />
                    )}
                  />
                  {errors.password && (
                    <p className="text-red-500 text-sm">
                      {typeof errors.password.message === "string"
                        ? errors.password.message
                        : "Invalid input"}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Controller
                    name="confirmPassword"
                    control={control}
                    render={({ field }) => (
                      <Input
                        id="confirmPassword"
                        type="password"
                        {...field}
                        className={
                          errors.confirmPassword ? "border-red-500" : ""
                        }
                      />
                    )}
                  />
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-sm">
                      {typeof errors.confirmPassword.message === "string"
                        ? errors.confirmPassword.message
                        : "Invalid input"}
                    </p>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="terms" required />
                  <label
                    htmlFor="terms"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    I agree to the{" "}
                    <a href="#" className="text-primary hover:underline">
                      terms and conditions
                    </a>
                  </label>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    <>
                      <UserPlus className="mr-2 h-4 w-4" />
                      Sign Up
                    </>
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mt-6 text-center">
        <p className="text-muted-foreground">Or continue with</p>
        <div className="flex justify-center mt-4 space-x-4">
          <Button
            variant="outline"
            className="w-full"
            onClick={handleGoogleLogin}
            disabled={isLoading}
          >
            Google
          </Button>
          <Button
            variant="outline"
            className="w-full"
            onClick={handleGithubLogin}
            disabled={isLoading}
          >
            GitHub
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
