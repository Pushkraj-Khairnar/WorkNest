import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import EditTaskForm from "./edit-task-form";
import { TaskType } from "@/types/api.type";

const EditTaskDialog = ({ task, isOpen, onClose }: { task: TaskType; isOpen: boolean; onClose: () => void }) => {
  return (
    <Dialog modal={true} open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-h-auto my-5 border-0">
        <DialogTitle>Edit Task</DialogTitle>
        <DialogDescription>
          Update the task details below.
        </DialogDescription>
        <EditTaskForm task={task} onClose={onClose} />
      </DialogContent>
    </Dialog>
  );
};

export default EditTaskDialog;
