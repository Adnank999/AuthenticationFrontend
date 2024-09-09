import { configureStore } from '@reduxjs/toolkit';
import { authenticationApi } from './authentication/authenticationApi';
import authenticationReducer from './authentication/authenticationSlice';
import { userApi } from './userApi';  

export const store = configureStore({
  reducer: {
    [authenticationApi.reducerPath]: authenticationApi.reducer,
    authentication: authenticationReducer,
    [userApi.reducerPath]: userApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authenticationApi.middleware, userApi.middleware),
});

export default store;
