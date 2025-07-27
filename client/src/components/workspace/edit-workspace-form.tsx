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
import { useAuthContext } from "@/context/auth-provider";
import { useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { editWorkspaceMutationFn } from "@/lib/api";
import useWorkspaceId from "@/hooks/use-workspace-id";
import { toast } from "@/hooks/use-toast";
import { Loader, Settings, Lock } from "lucide-react";
import { Permissions } from "@/constant";
import { cn } from "@/lib/utils";

export default function EditWorkspaceForm() {
  const { workspace, hasPermission } = useAuthContext();
  const canEditWorkspace = hasPermission(Permissions.EDIT_WORKSPACE);

  const queryClient = useQueryClient();
  const workspaceId = useWorkspaceId();

  const { mutate, isPending } = useMutation({
    mutationFn: editWorkspaceMutationFn,
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

  useEffect(() => {
    if (workspace) {
      form.setValue("name", workspace.name);
      form.setValue("description", workspace?.description || "");
    }
  }, [form, workspace]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (isPending) return;
    if (!workspaceId) {
      toast({
        title: "Error",
        description: "Workspace ID is missing.",
        variant: "destructive",
      });
      return;
    }
    const payload = {
      workspaceId: workspaceId,
      data: { ...values },
    };
    mutate(payload, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["workspace"],
        });
        queryClient.invalidateQueries({
          queryKey: ["userWorkspaces"],
        });
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
    <div className="w-full">
      {/* Modern Header Section */}
      <div className="relative mb-8 p-6 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 
                      rounded-xl border border-slate-200/60 shadow-sm">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <Settings className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Edit Workspace</h2>
            <p className="text-sm text-gray-600 mt-1">
              Customize your workspace settings and information
            </p>
          </div>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Main Form Container */}
          <div className="bg-white rounded-xl border border-slate-200/60 shadow-sm hover:shadow-md 
                          transition-all duration-300 p-6 space-y-6">
            
            {/* Workspace Name Field */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    Workspace Name
                    <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      disabled={!canEditWorkspace}
                      className={cn(
                        "h-12 px-4 bg-slate-50/50 border-slate-200 rounded-xl text-sm",
                        "focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-50/50",
                        "transition-all duration-300 placeholder:text-gray-400",
                        "shadow-sm hover:shadow-md focus:shadow-lg",
                        !canEditWorkspace && "opacity-60 cursor-not-allowed bg-gray-50"
                      )}
                      placeholder="Enter workspace name..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-xs text-red-500" />
                </FormItem>
              )}
            />

            {/* Workspace Description Field */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    Description
                    <span className="text-gray-400 text-xs font-normal">(Optional)</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      rows={4}
                      disabled={!canEditWorkspace}
                      className={cn(
                        "px-4 py-3 bg-slate-50/50 border-slate-200 rounded-xl text-sm resize-none",
                        "focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-50/50",
                        "transition-all duration-300 placeholder:text-gray-400",
                        "shadow-sm hover:shadow-md focus:shadow-lg",
                        !canEditWorkspace && "opacity-60 cursor-not-allowed bg-gray-50"
                      )}
                      placeholder="Describe your workspace purpose and goals..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-xs text-red-500" />
                </FormItem>
              )}
            />
          </div>

          {/* Action Section */}
          {canEditWorkspace ? (
            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={isPending}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 
                         hover:to-blue-800 text-white font-medium rounded-xl shadow-md hover:shadow-lg 
                         transition-all duration-200 transform hover:scale-105 disabled:opacity-60 
                         disabled:transform-none disabled:cursor-not-allowed min-w-[160px] h-12"
              >
                {isPending ? (
                  <div className="flex items-center gap-2">
                    <Loader className="w-4 h-4 animate-spin" />
                    <span>Updating...</span>
                  </div>
                ) : (
                  "Update Workspace"
                )}
              </Button>
            </div>
          ) : (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <Lock className="w-5 h-5 text-amber-600" />
                <div>
                  <p className="text-sm font-medium text-amber-800">
                    Permission Required
                  </p>
                  <p className="text-xs text-amber-700 mt-1">
                    You don't have permission to edit this workspace
                  </p>
                </div>
              </div>
            </div>
          )}
        </form>
      </Form>
    </div>
  );
}
