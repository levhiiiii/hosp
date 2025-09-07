import { configureStore } from '@reduxjs/toolkit'
import authSlice from './slices/authSlice'
import patientSlice from './slices/patientSlice'
import uiSlice from './slices/uiSlice'

export const store = configureStore({
  reducer: {
    auth: authSlice,
    patients: patientSlice,
    ui: uiSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
  devTools: import.meta.env.VITE_NODE_ENV !== 'production',
})
