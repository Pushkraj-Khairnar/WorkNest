import { Edit3 } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import EditProjectForm from "./edit-project-form";
import { ProjectType } from "@/types/api.type";
import { useState } from "react";

const EditProjectDialog = (props: { project?: ProjectType }) => {
  const [isOpen, setIsOpen] = useState(false);

  const onClose = () => {
    setIsOpen(false);
  };
  return (
    <Dialog modal={true} open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger className="mt-1.5" asChild>
        <button>
          <Edit3 className="w-5 h-5" />
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg border-0">
        <DialogTitle>Edit Project</DialogTitle>
        <DialogDescription>
          Update the project details below.
        </DialogDescription>
        <EditProjectForm project={props.project} onClose={onClose} />
      </DialogContent>
    </Dialog>
  );
};

export default EditProjectDialog;
