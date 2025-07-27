import { FC } from "react";
import { TaskType } from "@/types/api.type";
import TaskCard from "./TaskCard";

interface TaskGridProps {
  tasks: TaskType[];
}

const TaskGrid: FC<TaskGridProps> = ({ tasks }) => {
  return (
    <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-7 py-4">
      {tasks.map((task) => (
        <TaskCard key={task._id} task={task} />
      ))}
    </div>
  );
};

export default TaskGrid;
