import { FC } from "react";

interface TaskTabsProps {
  tab: string;
  setTab: (tab: string) => void;
}

const tabs = [
  { label: "All Tasks", value: "all" },
  { label: "My Tasks", value: "mine" },
  { label: "Overdue", value: "overdue" },
  { label: "Completed", value: "done" },
];

const TaskTabs: FC<TaskTabsProps> = ({ tab, setTab }) => {
  return (
    <div className="flex gap-2 mb-6 border-b border-gray-200">
      {tabs.map((t) => (
        <button
          key={t.value}
          className={`px-5 py-2 rounded-t-xl font-semibold text-sm transition-colors focus:outline-none ${tab === t.value ? "bg-white shadow text-indigo-700 border-b-2 border-indigo-600 -mb-px" : "bg-gray-50 text-gray-500 hover:text-indigo-600"}`}
          onClick={() => setTab(t.value)}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
};

export default TaskTabs;
