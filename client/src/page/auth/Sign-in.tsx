import { useNavigate, useSearchParams } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useMutation } from "@tanstack/react-query";
import { loginMutationFn } from "@/lib/api";
import { toast } from "@/hooks/use-toast";
import { Loader } from "lucide-react";
import RocketIllustration from "@/assets/undraw_shared-goals.svg?url";
import Logo from "@/components/logo";
import { Link } from "react-router-dom";

const SignIn = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const returnUrl = searchParams.get("returnUrl");

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
    if (isPending) return;
    mutate(values, {
      onSuccess: (data) => {
        const user = data.user;
        const decodedUrl = returnUrl ? decodeURIComponent(returnUrl) : null;
        navigate(decodedUrl || `/workspace/${user.currentWorkspace}`);
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      },
    });
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row relative">
      {/* WorkNest Logo - Top Left Corner */}
      <div className="absolute top-6 left-6 z-10">
        <Link to="/" className="flex items-center gap-2 text-white md:text-gray-900 font-medium">
          <Logo size="h-8 w-8" />
          <span className="text-lg font-bold">WorkNest</span>
        </Link>
      </div>
      
      {/* Left Side */}
      <div className="hidden md:flex flex-col justify-center items-center w-1/2 bg-[#4f8cff] text-white relative overflow-hidden">
        <div className="flex flex-col items-center z-10 px-8">
          <h2 className="text-3xl font-bold mb-2 mt-8 text-center">New here ?</h2>
          <p className="mb-6 text-center text-base font-light max-w-xs">Collaborate, launch projects, and manage your team with ease. Start your journey with WorkNest!</p>
          <button
            type="button"
            onClick={() => navigate("/sign-up")}
            className="px-8 py-2 border-2 border-white rounded-full text-white font-semibold hover:bg-white hover:text-[#4f8cff] transition-colors"
          >
            SIGN UP
          </button>
        </div>
        <img src={RocketIllustration} alt="Rocket Illustration" className="w-2/3 max-w-md mt-12 mb-4 z-0" />
      </div>
      {/* Right Side */}
      <div className="flex flex-1 flex-col justify-center items-center bg-white px-4 py-12 min-h-screen">
        <div className="w-full max-w-md flex flex-col items-center animate-fade-in">
          <h1 className="mb-8 text-3xl font-extrabold font-sans text-black tracking-tight text-center">Sign in</h1>
          <Card className="w-full border-0 shadow-none bg-white">
            <CardContent className="p-0">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="Username"
                            autoComplete="email"
                            className="bg-gray-100 rounded-full px-6 py-4 text-base border-0 focus:ring-2 focus:ring-blue-400 focus:bg-white"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Password"
                            autoComplete="current-password"
                            className="bg-gray-100 rounded-full px-6 py-4 text-base border-0 focus:ring-2 focus:ring-blue-400 focus:bg-white"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    variant="modern"
                    disabled={isPending}
                    className="mt-2 bg-[#4f8cff] text-white rounded-full text-base font-bold border-2 border-white hover:bg-[#357ae8] w-[140px] h-11 mx-auto flex items-center justify-center p-0"
                  >
                    {isPending && <Loader className="animate-spin mr-2" />}
                    LOGIN
                  </Button>
                </form>
              </Form>
              <div className="flex flex-col items-center w-full mt-8 gap-2">
                {/* Social login options removed as requested */}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <style>{`
        .animate-fade-in {
          animation: fadeInUp 0.7s cubic-bezier(0.23, 1, 0.32, 1);
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(32px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default SignIn;
