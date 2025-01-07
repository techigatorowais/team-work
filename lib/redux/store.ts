import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/authSlice';
import brandReducer from './features/brandSlice';
import projectReducer from './features/projectSlice';
import clientReducer from './features/clientSlice';
import teamMemberReducer from './features/teamMemberSlice';


// store variable is a global variable.
export const makeStore = (preloadedState = {}) => {
    return configureStore({
        reducer: {
            auth: authReducer,
            brands: brandReducer,
            projects: projectReducer,
            clients: clientReducer,
            teamMembers: teamMemberReducer
        },
        preloadedState
    });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];