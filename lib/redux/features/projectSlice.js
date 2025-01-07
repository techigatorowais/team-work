import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  projects: null,
  selectedProject: {
    project_id: null,
    project_title: null,
    project_description: null,
    created_by: null,
    team_key: null,
    brand_key: null,
    teamMembers: [],
    task_count: 0,
  },
  filteredProjects: [],
  projectTasks: {
    pendingTasks: [],
    completedTasks: [],
    teamMembers: [],
    tags: [],
  },
  isLoading: false,
  error: null,
};

const projectSlice = createSlice({
  name: "brands",
  initialState,
  reducers: {
    ProjectsFetchStart: (state) => {
      state.isLoading = true;
    },
    ProjectsFetchSuccess: (state, action) => {
      state.isLoading = false;
      state.projects = action.payload.projects;
      window.localStorage.setItem(
        "projectsData",
        JSON.stringify(action.payload.projects)
      );
      state.error = null;
    },
    ProjectsFetchFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    SelectProject: (state, action) => {
      state.selectedProject = action.payload;
    },
    SetFilteredProjects: (state, action) => {
      state.filteredProjects = action.payload.filteredProjects;
    },
    SetProjectTasks: (state, action) => {
      state.projectTasks.pendingTasks = action.payload.pendingTasks;
      state.projectTasks.completedTasks = action.payload.completedTasks;
      state.projectTasks.teamMembers = action.payload.teamMembers;
      state.projectTasks.tags = action.payload.tags;
    },
    UpdateSelectedProjectMembers: (state, action) => {
      console.log("action payload---> ", action.payload);
      state.selectedProject.teamMembers = action.payload.teamMembers;
    },
    SetTaskStatus: (state, action) => {
      const { taskId, status } = action.payload;

      if (status === 1) {
        // Task is marked as completed, move it from pending to completed
        const taskIndex = state.projectTasks.pendingTasks.findIndex(
          (task) => task.id === taskId
        );

        if (taskIndex !== -1) {
          let taskToMove = state.projectTasks.pendingTasks.splice(
            taskIndex,
            1
          )[0];
          taskToMove.status = status;
          state.projectTasks.completedTasks.push(taskToMove);
        }
      } else {
        // Task is not completed, move it from completed to pending
        const taskIndex = state.projectTasks.completedTasks.findIndex(
          (task) => task.id === taskId
        );

        if (taskIndex !== -1) {
          let taskToMove = state.projectTasks.completedTasks.splice(
            taskIndex,
            1
          )[0];
          taskToMove.status = status;
          state.projectTasks.pendingTasks.push(taskToMove);
        }
      }
    },
  },
});

export const {
  ProjectsFetchStart,
  ProjectsFetchSuccess,
  ProjectsFetchFailure,
  SelectProject,
  SetFilteredProjects,
  SetProjectTasks,
  SetTaskStatus,
  UpdateSelectedProjectMembers,
} = projectSlice.actions;

export default projectSlice.reducer;
