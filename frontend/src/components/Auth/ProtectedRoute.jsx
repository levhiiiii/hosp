import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import authService from '../../services/authService'
import LoadingSpinner from '../UI/LoadingSpinner'

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const location = useLocation()
  const { isAuthenticated, isLoading, user } = useSelector((state) => state.auth)

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary-50">
        <LoadingSpinner size="lg" text="Checking authentication..." />
      </div>
    )
  }

  // Check if user is authenticated
  if (!isAuthenticated || !authService.getToken()) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // Check role-based access if required
  if (requiredRole && user?.role !== requiredRole) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary-50">
        <div className="text-center">
          <div className="bg-white rounded-lg shadow-soft p-8 max-w-md mx-auto">
            <div className="text-error-500 text-6xl mb-4">🚫</div>
            <h2 className="text-2xl font-bold text-secondary-900 mb-2">
              Access Denied
            </h2>
            <p className="text-secondary-600 mb-4">
              You don't have permission to access this page.
            </p>
            <p className="text-sm text-secondary-500">
              Required role: <span className="font-medium">{requiredRole}</span>
              <br />
              Your role: <span className="font-medium">{user?.role || 'Unknown'}</span>
            </p>
            <button
              onClick={() => window.history.back()}
              className="mt-4 btn-primary"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    )
  }

  return children
}

export default ProtectedRoute
