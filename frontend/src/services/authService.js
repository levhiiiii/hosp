import { apiGet, apiPost } from './api'

const authService = {
  // Login user
  login: async (credentials) => {
    const response = await apiPost('/auth/login', credentials)
    return response
  },

  // Register user (for demo purposes)
  register: async (userData) => {
    const response = await apiPost('/auth/register', userData)
    return response
  },

  // Get current user profile
  getCurrentUser: async () => {
    const response = await apiGet('/auth/me')
    return response
  },

  // Logout user
  logout: async () => {
    const response = await apiPost('/auth/logout')
    // Clear token from localStorage
    localStorage.removeItem('token')
    return response
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    const token = localStorage.getItem('token')
    return !!token
  },

  // Get token from localStorage
  getToken: () => {
    return localStorage.getItem('token')
  },

  // Set token in localStorage
  setToken: (token) => {
    localStorage.setItem('token', token)
  },

  // Remove token from localStorage
  removeToken: () => {
    localStorage.removeItem('token')
  },

  // Decode JWT token (basic implementation)
  decodeToken: (token) => {
    try {
      const base64Url = token.split('.')[1]
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      )
      return JSON.parse(jsonPayload)
    } catch (error) {
      console.error('Error decoding token:', error)
      return null
    }
  },

  // Check if token is expired
  isTokenExpired: (token) => {
    try {
      const decoded = authService.decodeToken(token)
      if (!decoded || !decoded.exp) return true
      
      const currentTime = Date.now() / 1000
      return decoded.exp < currentTime
    } catch (error) {
      return true
    }
  },

  // Get user role from token
  getUserRole: () => {
    const token = authService.getToken()
    if (!token) return null
    
    const decoded = authService.decodeToken(token)
    return decoded?.role || null
  },

  // Check if user has specific role
  hasRole: (role) => {
    const userRole = authService.getUserRole()
    return userRole === role
  },

  // Check if user is doctor
  isDoctor: () => {
    return authService.hasRole('doctor')
  },

  // Check if user is receptionist
  isReceptionist: () => {
    return authService.hasRole('receptionist')
  },
}

export default authService
