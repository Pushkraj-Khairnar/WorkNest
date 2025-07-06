import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import CreateProjectForm from "@/components/workspace/project/create-project-form";
import useCreateProjectDialog from "@/hooks/use-create-project-dialog";

const CreateProjectDialog = () => {
  const { open, onClose } = useCreateProjectDialog();
  return (
    <Dialog modal={true} open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg border-0">
        <DialogTitle>Create New Project</DialogTitle>
        <DialogDescription>
          Create a new project for your workspace.
        </DialogDescription>
        <CreateProjectForm {...{ onClose }} />
      </DialogContent>
    </Dialog>
  );
};

export default CreateProjectDialog;
