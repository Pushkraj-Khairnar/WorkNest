import { FC, useState } from "react";
import { getColumns } from "./table/columns";
import { DataTable } from "./table/table";
import { useParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter, RefreshCw } from "lucide-react";
import { DataTableFacetedFilter } from "./table/table-faceted-filter";
import { priorities, statuses } from "./table/data";
import useTaskTableFilter from "@/hooks/use-task-table-filter";
import { useQuery } from "@tanstack/react-query";
import useWorkspaceId from "@/hooks/use-workspace-id";
import { getAllTasksQueryFn } from "@/lib/api";
import { TaskType } from "@/types/api.type";
import useGetProjectsInWorkspaceQuery from "@/hooks/api/use-get-projects";
import useGetWorkspaceMembers from "@/hooks/api/use-get-workspace-members";
import { getAvatarColor, getAvatarFallbackText } from "@/lib/helper";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type Filters = ReturnType<typeof useTaskTableFilter>[0];
type SetFilters = ReturnType<typeof useTaskTableFilter>[1];

interface DataTableFilterToolbarProps {
  isLoading?: boolean;
  projectId?: string;
  filters: Filters;
  setFilters: SetFilters;
}

const TaskTable = () => {
  const param = useParams();
  const projectId = param.projectId as string;

  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [filters, setFilters] = useTaskTableFilter();
  const workspaceId = useWorkspaceId();
  const columns = getColumns(projectId);

  const { data, isLoading } = useQuery({
    queryKey: [
      "all-tasks",
      workspaceId,
      pageSize,
      pageNumber,
      filters,
      projectId,
    ],
    queryFn: () =>
      getAllTasksQueryFn({
        workspaceId,
        keyword: filters.keyword,
        priority: filters.priority,
        status: filters.status,
        projectId: projectId || filters.projectId,
        assignedTo: filters.assigneeId,
        pageNumber,
        pageSize,
      }),
    staleTime: 0,
  });

  const tasks: TaskType[] = data?.tasks || [];
  const totalCount = data?.pagination.totalCount || 0;

  const handlePageChange = (page: number) => {
    setPageNumber(page);
  };

  // Handle page size changes
  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
  };

  return (
    <div className="w-full relative">
      <DataTable
        isLoading={isLoading}
        data={tasks}
        columns={columns}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        pagination={{
          totalCount,
          pageNumber,
          pageSize,
        }}
        filtersToolbar={
          <DataTableFilterToolbar
            isLoading={isLoading}
            projectId={projectId}
            filters={filters}
            setFilters={setFilters}
          />
        }
      />
    </div>
  );
};

const DataTableFilterToolbar: FC<DataTableFilterToolbarProps> = ({
  isLoading,
  projectId,
  filters,
  setFilters,
}) => {
  const workspaceId = useWorkspaceId();

  const { data } = useGetProjectsInWorkspaceQuery({
    workspaceId,
  });

  const { data: memberData } = useGetWorkspaceMembers(workspaceId);

  const projects = data?.projects || [];
  const members = memberData?.members || [];

  //Workspace Projects
  const projectOptions = projects?.map((project) => {
    return {
      label: (
        <div className="flex items-center gap-2">
          <span className="text-lg">{project.emoji}</span>
          <span className="font-medium">{project.name}</span>
        </div>
      ),
      value: project._id,
    };
  });

  // Workspace Memebers
  const assigneesOptions = members?.map((member) => {
    const name = member.userId?.name || "Unknown";
    const initials = getAvatarFallbackText(name);
    const avatarColor = getAvatarColor(name);

    return {
      label: (
        <div className="flex items-center space-x-3">
          <Avatar className="h-8 w-8 border-2 border-white dark:border-slate-700 shadow-sm">
            <AvatarImage src={member.userId?.profilePicture || ""} alt={name} />
            <AvatarFallback className={`${avatarColor} text-sm font-medium`}>{initials}</AvatarFallback>
          </Avatar>
          <span className="font-medium">{name}</span>
        </div>
      ),
      value: member.userId._id,
    };
  });

  const handleFilterChange = (key: keyof Filters, values: string[]) => {
    setFilters({
      ...filters,
      [key]: values.length > 0 ? values.join(",") : null,
    });
  };

  const hasActiveFilters = Object.values(filters).some(
    (value) => value !== null && value !== ""
  );

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
        <Input
          placeholder="Search tasks by title, code, or description..."
          value={filters.keyword || ""}
          onChange={(e) =>
            setFilters({
              ...filters,
              keyword: e.target.value,
            })
          }
          className="h-12 pl-10 pr-4 bg-white/60 dark:bg-slate-700/60 border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
        />
      </div>

      {/* Filter Section */}
      <div className="bg-white/40 dark:bg-slate-800/40 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
            <Filter className="w-4 h-4 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
            Filters
          </h3>
          {hasActiveFilters && (
            <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400 text-xs font-medium rounded-full">
              Active
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Status filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Status
            </label>
            <DataTableFacetedFilter
              title=""
              multiSelect={true}
              options={statuses}
              disabled={isLoading}
              selectedValues={filters.status?.split(",") || []}
              onFilterChange={(values) => handleFilterChange("status", values)}
            />
          </div>

          {/* Priority filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Priority
            </label>
            <DataTableFacetedFilter
              title=""
              multiSelect={true}
              options={priorities}
              disabled={isLoading}
              selectedValues={filters.priority?.split(",") || []}
              onFilterChange={(values) => handleFilterChange("priority", values)}
            />
          </div>

          {/* Assigned To filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Assigned To
            </label>
            <DataTableFacetedFilter
              title=""
              multiSelect={true}
              options={assigneesOptions}
              disabled={isLoading}
              selectedValues={filters.assigneeId?.split(",") || []}
              onFilterChange={(values) => handleFilterChange("assigneeId", values)}
            />
          </div>

          {/* Projects filter */}
          {!projectId && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Project
              </label>
              <DataTableFacetedFilter
                title=""
                multiSelect={false}
                options={projectOptions}
                disabled={isLoading}
                selectedValues={filters.projectId?.split(",") || []}
                onFilterChange={(values) => handleFilterChange("projectId", values)}
              />
            </div>
          )}
        </div>

        {/* Reset Button */}
        {hasActiveFilters && (
          <div className="flex justify-end mt-6">
            <Button
              disabled={isLoading}
              variant="outline"
              className="h-10 px-4 bg-white/60 dark:bg-slate-700/60 border-slate-200 dark:border-slate-600 hover:bg-white dark:hover:bg-slate-700 rounded-xl transition-all duration-200"
              onClick={() =>
                setFilters({
                  keyword: null,
                  status: null,
                  priority: null,
                  projectId: null,
                  assigneeId: null,
                })
              }
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Reset Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskTable;
