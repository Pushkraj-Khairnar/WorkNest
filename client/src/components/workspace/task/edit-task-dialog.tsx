import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import EditTaskForm from "./edit-task-form";
import { TaskType } from "@/types/api.type";

const EditTaskDialog = ({ task, isOpen, onClose }: { task: TaskType; isOpen: boolean; onClose: () => void }) => {
  return (
    <Dialog modal={true} open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl max-w-[95vw] h-[90vh] overflow-hidden bg-white rounded-3xl border-0 shadow-2xl p-0 flex flex-col">
        <VisuallyHidden>
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
            <DialogDescription>
              Update the task details and status. Make changes to the task information below.
            </DialogDescription>
          </DialogHeader>
        </VisuallyHidden>
        <div className="flex-1 overflow-hidden">
          <EditTaskForm task={task} onClose={onClose} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditTaskDialog;
