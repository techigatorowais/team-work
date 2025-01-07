'use client'
import { Provider } from "react-redux";
import { makeStore } from "../lib/redux/store";

function Providers({children}: {children: React.ReactNode}) {
    let preloadedState = {};
    if (typeof window !== 'undefined') {
        const loginData = JSON.parse(window.localStorage.getItem('loginData') || '{}');
        const projectsData = JSON.parse(window.localStorage.getItem('projectsData') || 'null');
        const projectsDataSelected = JSON.parse(window.localStorage.getItem('projectsDataSelected') || '{}');
        const teamMemberData = JSON.parse(window.localStorage.getItem('teamMemberData') || '[]');
        
        preloadedState = {
            auth: {
                user: loginData || null,
                isLoading: false,
                error: null,
            },
            projects: {
                projects: projectsData || null,
                selectedProject: projectsDataSelected || null,
                filteredProjects: [],
                projectTasks: {
                  pendingTasks: [],
                  completedTasks: [],
                  teamMembers: [],
                  tags: []
                },
                isLoading: false,
                error: null,
              },
            teamMembers:{
                teamMembers: teamMemberData,
                selectedTeamMembers: null,
                isLoading: false,
                error: null,
                
            }         
        };
    }

    return <Provider store={makeStore(preloadedState)}>{children}</Provider>;
}

export default Providers;