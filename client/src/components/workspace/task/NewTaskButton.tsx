import { FC } from "react";
import { Plus } from "lucide-react";

interface NewTaskButtonProps {
  onClick: () => void;
}

const NewTaskButton: FC<NewTaskButtonProps> = ({ onClick }) => (
  <button
    onClick={onClick}
    className="fixed top-6 right-10 z-40 flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-indigo-500 to-blue-500 text-white font-semibold shadow-lg hover:from-indigo-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-all text-base"
    style={{ boxShadow: "0 4px 24px 0 rgba(99, 102, 241, 0.15)" }}
  >
    <Plus className="w-5 h-5" />
    New Task
  </button>
);

export default NewTaskButton;
