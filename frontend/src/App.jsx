import React, { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import { getCurrentUser } from './store/slices/authSlice'
import authService from './services/authService'

// Import components
import Layout from './components/Layout/Layout'
import ProtectedRoute from './components/Auth/ProtectedRoute'
import LoadingSpinner from './components/UI/LoadingSpinner'

// Import pages
import LoginPage from './pages/Auth/LoginPage'
import DashboardPage from './pages/Dashboard/DashboardPage'
import PatientsPage from './pages/Patients/PatientsPage'
import PatientDetailsPage from './pages/Patients/PatientDetailsPage'
import CheckInPage from './pages/Patients/CheckInPage'
import NotFoundPage from './pages/NotFound/NotFoundPage'

function App() {
  const dispatch = useDispatch()
  const { isAuthenticated, isLoading, user } = useSelector((state) => state.auth)

  useEffect(() => {
    // Check if user is authenticated on app load - only run once
    const token = authService.getToken()
    
    if (token && !authService.isTokenExpired(token)) {
      dispatch(getCurrentUser())
    } else if (token && authService.isTokenExpired(token)) {
      authService.removeToken()
    }
  }, [dispatch]) // Only run on mount, not when isAuthenticated changes

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary-50">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-secondary-50">
      <AnimatePresence mode="wait">
        <Routes>
          {/* Public Routes */}
          <Route
            path="/login"
            element={
              isAuthenticated ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <LoginPage />
                </motion.div>
              )
            }
          />

          {/* Protected Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            {/* Dashboard */}
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />

            {/* Patients */}
            <Route path="patients" element={<PatientsPage />} />
            <Route path="patients/:id" element={<PatientDetailsPage />} />
            
            {/* Check-in (Receptionist only) */}
            <Route
              path="check-in"
              element={
                <ProtectedRoute requiredRole="receptionist">
                  <CheckInPage />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* 404 Page */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AnimatePresence>
    </div>
  )
}

export default App
