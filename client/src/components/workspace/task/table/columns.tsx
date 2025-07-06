import { Column, ColumnDef, Row } from "@tanstack/react-table";
import { format } from "date-fns";

import { DataTableColumnHeader } from "./table-column-header";
import { DataTableRowActions } from "./table-row-actions";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  getAvatarColor,
  getAvatarFallbackText,
} from "@/lib/helper";
import { priorities, statuses } from "./data";
import { TaskType } from "@/types/api.type";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const getColumns = (projectId?: string): ColumnDef<TaskType>[] => {
  const columns: ColumnDef<TaskType>[] = [
    {
      id: "_id",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          className="translate-y-[2px]"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="translate-y-[2px]"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "title",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Task Details" />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex flex-col space-y-2">
            <div className="flex items-center gap-2">
              <Badge 
                variant="outline" 
                className="capitalize h-6 px-2 text-xs font-medium bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300"
              >
                {row.original.taskCode}
              </Badge>
            </div>
            <span className="block lg:max-w-[280px] max-w-[240px] font-semibold text-slate-900 dark:text-white leading-tight">
              {row.original.title}
            </span>
          </div>
        );
      },
    },
    ...(projectId
      ? [] // If projectId exists, exclude the "Project" column
      : [
          {
            accessorKey: "project",
            header: ({ column }: { column: Column<TaskType, unknown> }) => (
              <DataTableColumnHeader column={column} title="Project" />
            ),
            cell: ({ row }: { row: Row<TaskType> }) => {
              const project = row.original.project;

              if (!project) {
                return null;
              }

              return (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg flex items-center justify-center text-lg shadow-sm">
                    {project.emoji}
                  </div>
                  <span className="block capitalize truncate w-[120px] text-ellipsis font-medium text-slate-900 dark:text-white">
                    {project.name}
                  </span>
                </div>
              );
            },
          },
        ]),
    {
      accessorKey: "assignedTo",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Assigned To" />
      ),
      cell: ({ row }) => {
        const assignee = row.original.assignedTo || null;
        const name = assignee?.name || "";

        if (!name) {
          return (
            <span className="text-sm text-slate-400 dark:text-slate-500 italic">
              Unassigned
            </span>
          );
        }

        const initials = getAvatarFallbackText(name);
        const avatarColor = getAvatarColor(name);

        return (
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8 border-2 border-white dark:border-slate-700 shadow-sm">
              <AvatarImage src={assignee?.profilePicture || ""} alt={name} />
              <AvatarFallback className={`${avatarColor} text-sm font-medium`}>
                {initials}
              </AvatarFallback>
            </Avatar>
            <span className="block text-ellipsis w-[120px] truncate font-medium text-slate-900 dark:text-white">
              {assignee?.name}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "dueDate",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Due Date" />
      ),
      cell: ({ row }) => {
        const dueDate = row.original.dueDate;
        if (!dueDate) {
          return (
            <span className="text-sm text-slate-400 dark:text-slate-500 italic">
              No due date
            </span>
          );
        }

        const isOverdue = new Date(dueDate) < new Date();
        
        return (
          <div className="flex flex-col">
            <span className={`text-sm font-medium ${isOverdue ? 'text-red-600 dark:text-red-400' : 'text-slate-900 dark:text-white'}`}>
              {format(dueDate, "MMM dd, yyyy")}
            </span>
            {isOverdue && (
              <span className="text-xs text-red-500 dark:text-red-400 font-medium">
                Overdue
              </span>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" />
      ),
      cell: ({ row }) => {
        const status = statuses.find(
          (status) => status.value === row.getValue("status")
        );

        if (!status) {
          return null;
        }

        const getStatusColor = (status: string) => {
          switch (status) {
            case "COMPLETED":
              return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 border-green-200 dark:border-green-800";
            case "IN_PROGRESS":
              return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400 border-blue-200 dark:border-blue-800";
            case "TODO":
              return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800";
            default:
              return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400 border-gray-200 dark:border-gray-800";
          }
        };

        return (
          <div className="flex lg:w-[140px] items-center">
            <Badge
              className={`flex items-center gap-2 px-3 py-1 rounded-full border font-medium ${getStatusColor(status.value)}`}
            >
              <span className="text-xs">{status.label}</span>
            </Badge>
          </div>
        );
      },
    },
    {
      accessorKey: "priority",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Priority" />
      ),
      cell: ({ row }) => {
        const priority = priorities.find(
          (priority) => priority.value === row.getValue("priority")
        );

        if (!priority) {
          return null;
        }

        const getPriorityColor = (priority: string) => {
          switch (priority) {
            case "HIGH":
              return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400 border-red-200 dark:border-red-800";
            case "MEDIUM":
              return "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400 border-orange-200 dark:border-orange-800";
            case "LOW":
              return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 border-green-200 dark:border-green-800";
            default:
              return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400 border-gray-200 dark:border-gray-800";
          }
        };

        return (
          <div className="flex items-center">
            <Badge
              className={`flex items-center gap-2 px-3 py-1 rounded-full border font-medium ${getPriorityColor(priority.value)}`}
            >
              <span className="text-xs">{priority.label}</span>
            </Badge>
          </div>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        return (
          <>
            <DataTableRowActions row={row} />
          </>
        );
      },
    },
  ];

  return columns;
};
