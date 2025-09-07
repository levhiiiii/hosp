import { createSlice } from '@reduxjs/toolkit'

// Initial state
const initialState = {
  sidebarOpen: true,
  theme: 'light',
  notifications: [],
  modals: {
    patientForm: false,
    patientDetails: false,
    confirmDelete: false,
  },
  loading: {
    global: false,
    patients: false,
    auth: false,
  },
  alerts: [],
}

// UI slice
const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen
    },
    setSidebarOpen: (state, action) => {
      state.sidebarOpen = action.payload
    },
    setTheme: (state, action) => {
      state.theme = action.payload
    },
    openModal: (state, action) => {
      const { modalName } = action.payload
      state.modals[modalName] = true
    },
    closeModal: (state, action) => {
      const { modalName } = action.payload
      state.modals[modalName] = false
    },
    closeAllModals: (state) => {
      Object.keys(state.modals).forEach(key => {
        state.modals[key] = false
      })
    },
    setLoading: (state, action) => {
      const { key, value } = action.payload
      state.loading[key] = value
    },
    addNotification: (state, action) => {
      const notification = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        ...action.payload,
      }
      state.notifications.unshift(notification)
      // Keep only last 50 notifications
      if (state.notifications.length > 50) {
        state.notifications = state.notifications.slice(0, 50)
      }
    },
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(
        notification => notification.id !== action.payload
      )
    },
    clearNotifications: (state) => {
      state.notifications = []
    },
    markNotificationAsRead: (state, action) => {
      const notification = state.notifications.find(n => n.id === action.payload)
      if (notification) {
        notification.read = true
      }
    },
    markAllNotificationsAsRead: (state) => {
      state.notifications.forEach(notification => {
        notification.read = true
      })
    },
    addAlert: (state, action) => {
      const alert = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        ...action.payload,
      }
      state.alerts.push(alert)
    },
    removeAlert: (state, action) => {
      state.alerts = state.alerts.filter(alert => alert.id !== action.payload)
    },
    clearAlerts: (state) => {
      state.alerts = []
    },
  },
})

export const {
  toggleSidebar,
  setSidebarOpen,
  setTheme,
  openModal,
  closeModal,
  closeAllModals,
  setLoading,
  addNotification,
  removeNotification,
  clearNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  addAlert,
  removeAlert,
  clearAlerts,
} = uiSlice.actions

export default uiSlice.reducer
