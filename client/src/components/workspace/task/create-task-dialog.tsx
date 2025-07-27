
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import CreateTaskForm from "./create-task-form";

interface CreateTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId?: string;
}

const CreateTaskDialog = ({ open, onOpenChange, projectId }: CreateTaskDialogProps) => {
  const onClose = () => onOpenChange(false);
  return (
    <Dialog modal={true} open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-w-[95vw] max-h-[90vh] overflow-hidden bg-white rounded-3xl border-0 shadow-2xl p-0">
        <VisuallyHidden>
          <DialogHeader>
            <DialogTitle>Create Task</DialogTitle>
            <DialogDescription>
              Add a new task to your project. Set details, assign members, and track progress.
            </DialogDescription>
          </DialogHeader>
        </VisuallyHidden>
        <CreateTaskForm projectId={projectId} onClose={onClose} />
      </DialogContent>
    </Dialog>
  );
};

export default CreateTaskDialog;
