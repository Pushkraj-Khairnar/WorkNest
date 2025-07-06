import { useState } from "react";
import { Plus, Target } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import CreateTaskForm from "./create-task-form";

const CreateTaskDialog = (props: { projectId?: string }) => {
  const [isOpen, setIsOpen] = useState(false);

  const onClose = () => {
    setIsOpen(false);
  };
  
  return (
    <Dialog modal={true} open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105">
          <Plus className="mr-2 h-5 w-5" />
          New Task
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-auto my-5 border-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-3xl shadow-2xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl shadow-lg">
            <Target className="w-6 h-6 text-white" />
          </div>
          <div>
            <DialogTitle className="text-2xl font-bold text-slate-900 dark:text-white">
              Create New Task
            </DialogTitle>
            <DialogDescription className="text-slate-600 dark:text-slate-400 mt-1">
              Add a new task to your project. Fill in the details below to get started.
            </DialogDescription>
          </div>
        </div>
        <CreateTaskForm projectId={props.projectId} onClose={onClose} />
      </DialogContent>
    </Dialog>
  );
};

export default CreateTaskDialog;
