import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "../ui/textarea";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createWorkspaceMutationFn } from "@/lib/api";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { Loader, Sparkles, X } from "lucide-react";

export default function CreateWorkspaceForm({
  onClose,
}: {
  onClose: () => void;
}) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: createWorkspaceMutationFn,
  });

  const formSchema = z.object({
    name: z.string().trim().min(1, {
      message: "Workspace name is required",
    }),
    description: z.string().trim(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (isPending) return;
    mutate(values, {
      onSuccess: (data) => {
        queryClient.resetQueries({
          queryKey: ["userWorkspaces"],
        });

        const workspace = data.workspace;
        onClose();
        navigate(`/workspace/${workspace._id}`);
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
    <div className="relative w-full min-h-[500px] p-8">
      {/* Abstract Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute top-4 right-4 w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full blur-3xl" />
        <div className="absolute bottom-8 left-6 w-24 h-24 bg-gradient-to-tr from-indigo-400 to-pink-400 rounded-full blur-2xl" />
        <div className="absolute top-1/2 right-1/3 w-16 h-16 bg-gradient-to-bl from-emerald-400 to-cyan-400 rounded-full blur-xl" />
      </div>

      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 group"
        aria-label="Close dialog"
      >
        <X className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors duration-200" />
      </button>

      {/* Content */}
      <div className="relative z-10 max-w-md mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Create Workspace
          </h1>
          <p className="text-gray-600 text-sm leading-relaxed">
            Build a collaborative space for your team to organize projects and achieve goals together.
          </p>
        </div>

        {/* Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Workspace Name Field */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <div className="relative">
                    <FormControl>
                      <Input
                        placeholder=" "
                        className="peer h-14 px-4 pt-6 pb-2 bg-white/80 backdrop-blur-sm border-gray-200/50 rounded-xl 
                                 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all duration-200
                                 placeholder-transparent shadow-sm hover:shadow-md hover:border-gray-300/70"
                        {...field}
                      />
                    </FormControl>
                    <FormLabel className="absolute left-4 top-4 text-gray-500 text-sm font-medium transition-all duration-200
                                        peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-base
                                        peer-focus:top-4 peer-focus:text-sm peer-focus:text-blue-600 pointer-events-none">
                      Workspace Name
                    </FormLabel>
                  </div>
                  <FormMessage className="text-xs text-red-500 ml-1" />
                </FormItem>
              )}
            />

            {/* Description Field */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200/50 p-4 shadow-sm hover:shadow-md transition-all duration-200">
                    <FormLabel className="text-sm font-medium text-gray-700 mb-3 block">
                      Description 
                      <span className="text-xs text-gray-400 font-normal ml-2">(Optional)</span>
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe what your team will work on in this workspace..."
                        className="min-h-[100px] resize-none border-0 bg-transparent p-0 focus-visible:ring-0 
                                 placeholder:text-gray-400 text-sm leading-relaxed"
                        {...field}
                      />
                    </FormControl>
                  </div>
                  <FormMessage className="text-xs text-red-500 ml-1" />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <Button
              disabled={isPending}
              className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 
                       text-white font-semibold rounded-full shadow-lg hover:shadow-xl 
                       transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-70 disabled:transform-none"
              type="submit"
            >
              {isPending ? (
                <div className="flex items-center gap-2">
                  <Loader className="w-4 h-4 animate-spin" />
                  <span>Creating...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  <span>Create Workspace</span>
                </div>
              )}
            </Button>
          </form>
        </Form>

        {/* Footer */}
        <p className="text-center text-xs text-gray-400 mt-6">
          You can customize your workspace settings after creation
        </p>
      </div>
    </div>
  );
}
