import { FC } from "react";

interface TaskFiltersBarProps {
  status: string;
  setStatus: (status: string) => void;
  priority: string;
  setPriority: (priority: string) => void;
  search: string;
  setSearch: (search: string) => void;
}

const statusOptions = ["All", "TODO", "IN_PROGRESS", "IN_REVIEW", "DONE"];
const priorityOptions = ["All", "LOW", "MEDIUM", "HIGH"];

const pillClass = (active: boolean) =>
  `px-4 py-1 rounded-full text-sm font-medium transition-colors cursor-pointer select-none ${active ? "bg-indigo-600 text-white shadow" : "bg-gray-100 text-gray-600 hover:bg-indigo-50"}`;

const TaskFiltersBar: FC<TaskFiltersBarProps> = ({ status, setStatus, priority, setPriority, search, setSearch }) => {
  return (
    <div className="flex flex-wrap items-center gap-3 mb-6">
      {/* Status Pills */}
      <div className="flex gap-2">
        {statusOptions.map((opt) => (
          <span
            key={opt}
            className={pillClass(status === opt)}
            onClick={() => setStatus(opt)}
          >
            {opt === "All" ? "Status" : opt.replace("_", " ")}
          </span>
        ))}
      </div>
      {/* Priority Pills */}
      <div className="flex gap-2 ml-4">
        {priorityOptions.map((opt) => (
          <span
            key={opt}
            className={pillClass(priority === opt)}
            onClick={() => setPriority(opt)}
          >
            {opt === "All" ? "Priority" : opt}
          </span>
        ))}
      </div>
      {/* Search */}
      <input
        type="text"
        placeholder="Search tasks..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="ml-4 px-4 py-1.5 rounded-full border border-gray-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 text-sm min-w-[180px]"
      />
    </div>
  );
};

export default TaskFiltersBar;
