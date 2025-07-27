import { TaskPriorityEnum, TaskStatusEnum } from "../enums/task.enum";
import MemberModel from "../models/member.model";
import ProjectModel from "../models/project.model";
import TaskModel from "../models/task.model";
import WorkspaceModel from "../models/workspace.model";
import { BadRequestException, NotFoundException } from "../utils/appError";

// Helper function to validate workspaceId
const validateWorkspaceId = (workspaceId: string) => {
  if (!workspaceId || workspaceId === "undefined" || workspaceId === "null") {
    throw new BadRequestException("Invalid workspace ID");
  }

  if (!/^[0-9a-fA-F]{24}$/.test(workspaceId)) {
    throw new BadRequestException("Invalid workspace ID format");
  }
};

export const createTaskService = async (
  workspaceId: string,
  projectId: string,
  userId: string,
  body: {
    title: string;
    description?: string;
    priority: string;
    status: string;
    assignedTo?: string | null;
    dueDate?: string;
  }
) => {
  validateWorkspaceId(workspaceId);

  const { title, description, priority, status, assignedTo, dueDate } = body;

  const project = await ProjectModel.findById(projectId);

  if (!project || project.workspace.toString() !== workspaceId.toString()) {
    throw new NotFoundException(
      "Project not found or does not belong to this workspace"
    );
  }
  if (assignedTo) {
    const isAssignedUserMember = await MemberModel.exists({
      userId: assignedTo,
      workspaceId,
    });

    if (!isAssignedUserMember) {
      throw new Error("Assigned user is not a member of this workspace.");
    }
  }
  const task = new TaskModel({
    title,
    description,
    priority: priority || TaskPriorityEnum.MEDIUM,
    status: status || TaskStatusEnum.TODO,
    assignedTo,
    createdBy: userId,
    workspace: workspaceId,
    project: projectId,
    dueDate,
  });

  await task.save();

  return { task };
};

export const updateTaskService = async (
  workspaceId: string,
  projectId: string,
  taskId: string,
  userId: string,
  body: {
    title?: string;
    description?: string;
    priority?: string;
    status?: string;
    assignedTo?: string | null;
    dueDate?: string;
  }
) => {
  validateWorkspaceId(workspaceId);

  const project = await ProjectModel.findById(projectId);

  if (!project || project.workspace.toString() !== workspaceId.toString()) {
    throw new NotFoundException(
      "Project not found or does not belong to this workspace"
    );
  }

  const task = await TaskModel.findById(taskId);

  if (!task || task.project.toString() !== projectId.toString()) {
    throw new NotFoundException(
      "Task not found or does not belong to this project"
    );
  }

  // Check if user is workspace owner
  const workspace = await WorkspaceModel.findById(workspaceId);
  if (!workspace) {
    throw new NotFoundException("Workspace not found");
  }

  const isWorkspaceOwner = workspace.owner.toString() === userId.toString();
  const isTaskAssignee = task.assignedTo?.toString() === userId.toString();

  // Check if user has admin-level permissions (EDIT_TASK or DELETE_TASK)
  const member = await MemberModel.findOne({
    userId,
    workspaceId,
  }).populate('role', 'permissions');

  if (!member) {
    throw new NotFoundException("User is not a member of this workspace");
  }

  const userPermissions = member.role?.permissions || [];
  const hasEditPermission = userPermissions.includes('EDIT_TASK');
  const hasDeletePermission = userPermissions.includes('DELETE_TASK');
  const isAdminOrOwner = isWorkspaceOwner || hasEditPermission || hasDeletePermission;

  // Determine what fields can be updated
  const fieldsToUpdate = Object.keys(body);
  const isStatusOnlyUpdate = fieldsToUpdate.length === 1 && fieldsToUpdate[0] === 'status';

  // STRICT PERMISSION LOGIC:
  // 1. Admin/Owner: Can update ALL fields
  // 2. Task Assignee (non-admin): Can ONLY update status
  // 3. Other members: No update access at all - 403 Forbidden

  if (isAdminOrOwner) {
    // Admins and owners can update all fields
    // Allow all updates
  } else if (isTaskAssignee && isStatusOnlyUpdate) {
    // Task assignees can only update status
    // Allow status update only
  } else {
    // All other cases: unauthorized - throw 403 Forbidden
    const error = new Error(
      "You do not have permission to update this task. Only admins, workspace owners, or task assignees (for status updates only) can modify tasks."
    );
    (error as any).statusCode = 403;
    throw error;
  }

  const updatedTask = await TaskModel.findByIdAndUpdate(
    taskId,
    {
      ...body,
    },
    { new: true }
  ).populate("assignedTo", "_id name profilePicture -password");

  if (!updatedTask) {
    throw new BadRequestException("Failed to update task");
  }

  return { updatedTask };
};

export const getTaskPermissionsService = async (
  workspaceId: string,
  taskId: string,
  userId: string
) => {
  validateWorkspaceId(workspaceId);

  const task = await TaskModel.findOne({
    _id: taskId,
    workspace: workspaceId,
  }).populate('assignedTo', '_id');

  if (!task) {
    throw new NotFoundException(
      "Task not found or does not belong to the specified workspace"
    );
  }

  const workspace = await WorkspaceModel.findById(workspaceId);
  if (!workspace) {
    throw new NotFoundException("Workspace not found");
  }

  // Get member role to check admin permissions
  const member = await MemberModel.findOne({
    userId,
    workspaceId,
  }).populate('role', 'permissions');

  if (!member) {
    throw new NotFoundException("User is not a member of this workspace");
  }

  const isWorkspaceOwner = workspace.owner.toString() === userId.toString();
  const isTaskAssignee = task.assignedTo?.toString() === userId.toString();
  
  // Check if user has admin-level permissions (EDIT_TASK or DELETE_TASK)
  const userPermissions = member.role?.permissions || [];
  const hasEditPermission = userPermissions.includes('EDIT_TASK');
  const hasDeletePermission = userPermissions.includes('DELETE_TASK');
  const isAdminOrOwner = isWorkspaceOwner || hasEditPermission || hasDeletePermission;

  return {
    canUpdateStatus: isTaskAssignee || isAdminOrOwner,
    canUpdateAllFields: isAdminOrOwner,
    canDelete: isAdminOrOwner,
    isWorkspaceOwner,
    isTaskAssignee,
    isAdminOrOwner,
  };
};

export const getAllTasksService = async (
  workspaceId: string,
  filters: {
    projectId?: string;
    status?: string[];
    priority?: string[];
    assignedTo?: string[];
    keyword?: string;
    dueDate?: string;
  },
  pagination: {
    pageSize: number;
    pageNumber: number;
  }
) => {
  validateWorkspaceId(workspaceId);

  const query: Record<string, any> = {
    workspace: workspaceId,
  };

  if (filters.projectId) {
    query.project = filters.projectId;
  }

  if (filters.status && filters.status?.length > 0) {
    query.status = { $in: filters.status };
  }

  if (filters.priority && filters.priority?.length > 0) {
    query.priority = { $in: filters.priority };
  }

  if (filters.assignedTo && filters.assignedTo?.length > 0) {
    query.assignedTo = { $in: filters.assignedTo };
  }

  if (filters.keyword && filters.keyword !== undefined) {
    query.title = { $regex: filters.keyword, $options: "i" };
  }

  if (filters.dueDate) {
    query.dueDate = {
      $eq: new Date(filters.dueDate),
    };
  }

  //Pagination Setup
  const { pageSize, pageNumber } = pagination;
  const skip = (pageNumber - 1) * pageSize;

  const [tasks, totalCount] = await Promise.all([
    TaskModel.find(query)
      .skip(skip)
      .limit(pageSize)
      .populate("assignedTo", "_id name profilePicture -password")
      .populate("project", "_id emoji name")
      .sort({ createdAt: -1 }),
    TaskModel.countDocuments(query),
  ]);

  const totalPages = Math.ceil(totalCount / pageSize);

  return {
    tasks,
    totalCount,
    totalPages,
    skip,
  };
};

export const getTaskByIdService = async (
  workspaceId: string,
  projectId: string,
  taskId: string
) => {
  validateWorkspaceId(workspaceId);

  const project = await ProjectModel.findById(projectId);

  if (!project || project.workspace.toString() !== workspaceId.toString()) {
    throw new NotFoundException(
      "Project not found or does not belong to this workspace"
    );
  }

  const task = await TaskModel.findOne({
    _id: taskId,
    workspace: workspaceId,
    project: projectId,
  }).populate("assignedTo", "_id name profilePicture -password");

  if (!task) {
    throw new NotFoundException("Task not found.");
  }

  return task;
};

export const deleteTaskService = async (
  workspaceId: string,
  taskId: string
) => {
  validateWorkspaceId(workspaceId);

  const task = await TaskModel.findOneAndDelete({
    _id: taskId,
    workspace: workspaceId,
  });

  if (!task) {
    throw new NotFoundException(
      "Task not found or does not belong to the specified workspace"
    );
  }

  return;
};

export const updateTaskStatusService = async (
  workspaceId: string,
  taskId: string,
  userId: string,
  status: string
) => {
  validateWorkspaceId(workspaceId);

  const task = await TaskModel.findOne({
    _id: taskId,
    workspace: workspaceId,
  });

  if (!task) {
    throw new NotFoundException(
      "Task not found or does not belong to the specified workspace"
    );
  }

  // Check if user is workspace owner
  const workspace = await WorkspaceModel.findById(workspaceId);
  if (!workspace) {
    throw new NotFoundException("Workspace not found");
  }

  const isWorkspaceOwner = workspace.owner.toString() === userId.toString();
  const isTaskAssignee = task.assignedTo?.toString() === userId.toString();

  // Check if user has admin-level permissions (EDIT_TASK or DELETE_TASK)
  const member = await MemberModel.findOne({
    userId,
    workspaceId,
  }).populate('role', 'permissions');

  if (!member) {
    throw new NotFoundException("User is not a member of this workspace");
  }

  const userPermissions = member.role?.permissions || [];
  const hasEditPermission = userPermissions.includes('EDIT_TASK');
  const isAdminOrOwner = isWorkspaceOwner || hasEditPermission;

  // STRICT PERMISSION: Task assignees can update status, or admins/owners can update status
  if (!isTaskAssignee && !isAdminOrOwner) {
    const error = new Error(
      "You do not have permission to update this task status. Only the task assignee, workspace owners, or admins can update the task status."
    );
    (error as any).statusCode = 403;
    throw error;
  }

  const updatedTask = await TaskModel.findByIdAndUpdate(
    taskId,
    { status },
    { new: true }
  ).populate("assignedTo", "_id name profilePicture -password");

  if (!updatedTask) {
    throw new BadRequestException("Failed to update task status");
  }

  return { updatedTask };
};
