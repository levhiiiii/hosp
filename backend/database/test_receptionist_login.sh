#!/bin/bash

# Test Receptionist Login for Kale Accident Hospital Management System
# This script tests the receptionist login functionality

API_BASE_URL="http://localhost:5001/api"

echo "🏥 Kale Accident Hospital - Testing Receptionist Login"
echo "====================================================="
echo ""

# Test if API is running
echo "1. Testing API Health..."
health_response=$(curl -s "$API_BASE_URL/health")
if [[ $health_response == *"OK"* ]]; then
    echo "✅ API is running"
else
    echo "❌ API is not responding"
    echo "Please start the backend server first: npm run dev"
    exit 1
fi
echo ""

# Test receptionist login
echo "2. Testing Receptionist Login..."
receptionist_response=$(curl -s -X POST "$API_BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "receptionist_test",
    "password": "receptionist123",
    "role": "receptionist"
  }')

if [[ $receptionist_response == *"success"* ]]; then
    echo "✅ Receptionist login successful"
    echo "   Response: $receptionist_response"
    
    # Extract token for further testing
    token=$(echo $receptionist_response | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
    if [ ! -z "$token" ]; then
        echo "   Token extracted: ${token:0:20}..."
    fi
else
    echo "❌ Receptionist login failed"
    echo "   Response: $receptionist_response"
fi
echo ""

# Test receptionist profile access
if [ ! -z "$token" ]; then
    echo "3. Testing Receptionist Profile Access..."
    profile_response=$(curl -s -X GET "$API_BASE_URL/auth/profile" \
      -H "Authorization: Bearer $token")
    
    if [[ $profile_response == *"success"* ]]; then
        echo "✅ Profile access successful"
        echo "   Response: $profile_response"
    else
        echo "❌ Profile access failed"
        echo "   Response: $profile_response"
    fi
    echo ""
fi

# Test patient creation (receptionist only)
if [ ! -z "$token" ]; then
    echo "4. Testing Patient Creation (Receptionist Permission)..."
    patient_response=$(curl -s -X POST "$API_BASE_URL/patients" \
      -H "Authorization: Bearer $token" \
      -H "Content-Type: application/json" \
      -d '{
        "patient_id": "TEST001",
        "full_name": "Test Patient",
        "age": 30,
        "gender": "Male",
        "phone": "1234567890",
        "address": "Test Address",
        "emergency_contact": "9876543210",
        "medical_history": "No known allergies",
        "current_condition": "Routine checkup",
        "priority": "normal"
      }')
    
    if [[ $patient_response == *"success"* ]]; then
        echo "✅ Patient creation successful"
        echo "   Response: $patient_response"
    else
        echo "❌ Patient creation failed"
        echo "   Response: $patient_response"
    fi
    echo ""
fi

echo "====================================================="
echo "🏥 Receptionist login testing completed!"
echo ""
echo "Receptionist Credentials:"
echo "  Username: receptionist_test"
echo "  Password: receptionist123"
echo "  Role: receptionist"
echo ""
echo "Use these credentials to login to the frontend application."
echo "The receptionist can:"
echo "  - Create new patients"
echo "  - View all patients"
echo "  - Update patient information"
echo "  - Delete patient records"
echo "  - Access dashboard statistics"
