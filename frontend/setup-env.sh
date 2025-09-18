#!/bin/bash

# Setup script for frontend environment variables
# This script creates a .env.local file with the appropriate configuration

echo "🏥 Kale Hospital Frontend Environment Setup"
echo "=========================================="

# Check if .env.local already exists
if [ -f ".env.local" ]; then
    echo "⚠️  .env.local already exists!"
    read -p "Do you want to overwrite it? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "❌ Setup cancelled."
        exit 1
    fi
fi

# Ask for environment type
echo "Select environment:"
echo "1) Local Development (backend on localhost:5001)"
echo "2) Production (backend on Render)"
read -p "Enter choice (1 or 2): " -n 1 -r
echo

case $REPLY in
    1)
        echo "🔧 Setting up for LOCAL DEVELOPMENT..."
        cat > .env.local << EOF
# Frontend Environment Variables - Local Development
VITE_API_BASE_URL=http://localhost:5001/api
VITE_APP_NAME=Kale Hospital Management System
VITE_APP_VERSION=1.0.0
EOF
        ;;
    2)
        echo "🚀 Setting up for PRODUCTION..."
        cat > .env.local << EOF
# Frontend Environment Variables - Production
VITE_API_BASE_URL=https://hosp-245y.onrender.com/api
VITE_APP_NAME=Kale Hospital Management System
VITE_APP_VERSION=1.0.0
EOF
        ;;
    *)
        echo "❌ Invalid choice. Setup cancelled."
        exit 1
        ;;
esac

echo "✅ Environment file created successfully!"
echo "📁 File: .env.local"
echo ""
echo "🔄 Please restart your development server:"
echo "   npm run dev"
echo ""
echo "📖 For more information, see ENVIRONMENT_SETUP.md"
