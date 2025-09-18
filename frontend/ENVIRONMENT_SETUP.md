# Frontend Environment Setup

## Environment Variables

To configure the frontend API connection, create a `.env.local` file in the frontend directory with the following variables:

### For Local Development
```bash
# Backend API Configuration
VITE_API_BASE_URL=http://localhost:5001/api

# Application Settings
VITE_APP_NAME=Kale Hospital Management System
VITE_APP_VERSION=1.0.0
```

### For Production
```bash
# Backend API Configuration
VITE_API_BASE_URL=https://hosp-245y.onrender.com/api

# Application Settings
VITE_APP_NAME=Kale Hospital Management System
VITE_APP_VERSION=1.0.0
```

## Setup Instructions

1. **Create the environment file:**
   ```bash
   cd frontend
   touch .env.local
   ```

2. **Add the configuration:**
   Copy the appropriate configuration above into `.env.local`

3. **Restart the development server:**
   ```bash
   npm run dev
   ```

## Default Configuration

If no `.env.local` file is found, the application will use these defaults:
- **Development**: `http://localhost:5001/api`
- **Production**: `https://hosp-245y.onrender.com/api`

## API Configuration

The API configuration is managed in `src/config/api.js` and automatically detects the environment to use the correct backend URL.
