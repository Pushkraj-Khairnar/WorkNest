import React from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Logo from "@/components/logo";
import GoogleOauthButton from "@/components/auth/google-oauth-button";
import { useMutation } from "@tanstack/react-query";
import { loginMutationFn } from "@/lib/api";
import { toast } from "@/hooks/use-toast";
import { Loader, Eye, EyeOff, ArrowRight, Sparkles } from "lucide-react";
import { useState } from "react";

const SignIn = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const returnUrl = searchParams.get("returnUrl");
  const [showPassword, setShowPassword] = useState(false);
  const [showDebug, setShowDebug] = useState(false);

  // Add immediate debug info when component loads
  React.useEffect(() => {
    console.log('SignIn component loaded');
    localStorage.setItem('loginDebug', JSON.stringify({
      timestamp: new Date().toISOString(),
      status: 'component_loaded',
      message: 'SignIn component mounted'
    }));
  }, []);

  const { mutate, isPending } = useMutation({
    mutationFn: loginMutationFn,
  });

  const formSchema = z.object({
    email: z.string().trim().email("Invalid email address").min(1, {
      message: "Email is required",
    }),
    password: z.string().trim().min(1, {
      message: "Password is required",
    }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    try {
      if (isPending) return;

      // Store debug info in localStorage so it persists through reloads
      localStorage.setItem('loginDebug', JSON.stringify({
        timestamp: new Date().toISOString(),
        email: values.email,
        status: 'attempting'
      }));

      console.log('Attempting to sign in with:', values.email);

    mutate(values, {
      onSuccess: (data) => {
        // Store successful login data
        localStorage.setItem('loginDebug', JSON.stringify({
          timestamp: new Date().toISOString(),
          email: values.email,
          status: 'success',
          response: data,
          user: data.user,
          currentWorkspace: data.user.currentWorkspace
        }));

        console.log('Login successful, response:', data);
        const user = data.user;
        console.log('User data:', user);
        console.log('Current workspace:', user.currentWorkspace);
        
        const decodedUrl = returnUrl ? decodeURIComponent(returnUrl) : null;
        
        // Handle case where user has no current workspace
        if (!user.currentWorkspace) {
          console.log('User has no current workspace, redirecting to dashboard');
          navigate('/dashboard');
          return;
        }
        
        const redirectUrl = decodedUrl || `/workspace/${user.currentWorkspace}`;
        console.log('Redirecting to:', redirectUrl);
        
        // Store redirect info
        localStorage.setItem('loginRedirect', redirectUrl);
        localStorage.setItem('loginDebug', JSON.stringify({
          timestamp: new Date().toISOString(),
          status: 'navigating',
          redirectUrl: redirectUrl,
          user: user
        }));
        
        // Use setTimeout to ensure navigation happens after state updates
        setTimeout(() => {
          console.log('Executing navigation to:', redirectUrl);
          navigate(redirectUrl);
        }, 100);
      },
      onError: (error) => {
        // Store error data
        localStorage.setItem('loginDebug', JSON.stringify({
          timestamp: new Date().toISOString(),
          email: values.email,
          status: 'error',
          error: error.message
        }));

        console.error('Login error:', error);
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      },
    });
    } catch (error) {
      console.error('Error in onSubmit:', error);
      localStorage.setItem('loginDebug', JSON.stringify({
        timestamp: new Date().toISOString(),
        status: 'error_in_onSubmit',
        error: error.message
      }));
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Hero Section */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/5 rounded-full blur-2xl animate-pulse delay-500"></div>
        </div>
        
        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center items-center text-white p-12">
          <div className="text-center max-w-md">
            <div className="flex items-center justify-center mb-8">
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
              Welcome to WorkNest
            </h1>
            <p className="text-lg text-blue-100 mb-8 leading-relaxed">
              Streamline your team collaboration with our powerful project management platform. 
              Get started today and transform how your team works together.
            </p>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-blue-100">Real-time collaboration</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-blue-100">Advanced project tracking</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-blue-100">Smart analytics & insights</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl">
                <Logo />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
              Welcome back
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
              Sign in to your account to continue
            </p>
          </div>

          {/* Login Form */}
          <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20 dark:border-slate-700/50">
            <Form {...form}>
              <form 
                onSubmit={(e) => {
                  e.preventDefault(); // Explicitly prevent default
                  console.log('Form submitted - preventDefault called');
                  localStorage.setItem('loginDebug', JSON.stringify({
                    timestamp: new Date().toISOString(),
                    status: 'form_submitted',
                    event: 'form_onSubmit',
                    preventDefault: true
                  }));
                  form.handleSubmit(onSubmit)(e);
                }} 
                className="space-y-6"
              >
                {/* Google OAuth */}
                <div className="space-y-4">
                  <GoogleOauthButton label="Continue" />
                  
                  {/* Divider */}
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-slate-300 dark:border-slate-600"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 bg-white/70 dark:bg-slate-800/70 text-slate-500 dark:text-slate-400">
                        Or continue with email
                      </span>
                    </div>
                  </div>
                </div>

                {/* Email Field */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Email address
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your email"
                          className="h-12 px-4 bg-white/50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Password Field */}
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel className="text-sm font-medium text-slate-700 dark:text-slate-300">
                          Password
                        </FormLabel>
                        <button
                          type="button"
                          className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                        >
                          Forgot password?
                        </button>
                      </div>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
                            className="h-12 px-4 pr-12 bg-white/50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                            {...field}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                          >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Submit Button */}
                <Button
                  disabled={isPending}
                  type="submit"
                  className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
                >
                  {isPending ? (
                    <Loader className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      Sign in
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>

                {/* Test Button */}
                <Button
                  type="button"
                  onClick={() => {
                    console.log('Test button clicked');
                    localStorage.setItem('loginDebug', JSON.stringify({
                      timestamp: new Date().toISOString(),
                      status: 'test_button_clicked'
                    }));
                    navigate('/dashboard');
                  }}
                  className="w-full h-12 bg-green-600 hover:bg-green-700 text-white font-medium rounded-xl"
                >
                  Test Navigation (Go to Dashboard)
                </Button>
              </form>
            </Form>

            {/* Sign Up Link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Don't have an account?{" "}
                <Link
                  to="/sign-up"
                  className="font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                >
                  Create one now
                </Link>
              </p>
            </div>
          </div>

          {/* Terms */}
          <div className="mt-6 text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              By signing in, you agree to our{" "}
              <a href="#" className="underline hover:text-slate-700 dark:hover:text-slate-300 transition-colors">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="underline hover:text-slate-700 dark:hover:text-slate-300 transition-colors">
                Privacy Policy
              </a>
            </p>
          </div>

          {/* Debug Section */}
          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => setShowDebug(!showDebug)}
              className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
            >
              {showDebug ? 'Hide Debug' : 'Show Debug'}
            </button>
            
            {showDebug && (
              <div className="mt-2 p-3 bg-slate-100 dark:bg-slate-700 rounded-lg text-left">
                <h4 className="text-sm font-medium mb-2">Debug Info:</h4>
                <pre className="text-xs overflow-auto max-h-32">
                  {(() => {
                    const debug = localStorage.getItem('loginDebug');
                    const redirect = localStorage.getItem('loginRedirect');
                    return JSON.stringify({ debug: debug ? JSON.parse(debug) : null, redirect }, null, 2);
                  })()}
                </pre>
                <button
                  type="button"
                  onClick={() => {
                    localStorage.removeItem('loginDebug');
                    localStorage.removeItem('loginRedirect');
                    setShowDebug(false);
                  }}
                  className="mt-2 text-xs text-red-600 hover:text-red-700"
                >
                  Clear Debug
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
