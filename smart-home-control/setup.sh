#!/bin/bash

# Smart Home Control Center - Setup and Run Script

echo "🏠 Smart Home Control Center Setup"
echo "===================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null
then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

echo "✓ Node.js version: $(node -v)"
echo "✓ npm version: $(npm -v)"
echo ""

# Setup Backend
echo "Setting up Backend..."
cd backend
npm install
echo "✓ Backend dependencies installed"
echo ""

# Setup Frontend
echo "Setting up Frontend..."
cd ../frontend
npm install
echo "✓ Frontend dependencies installed"
echo ""

echo "✓ Installation complete!"
echo ""
echo "To start the application:"
echo "1. Terminal 1 - Backend: cd backend && npm start"
echo "2. Terminal 2 - Frontend: cd frontend && npm start"
echo ""
echo "Frontend will open at: http://localhost:3000"
echo "Backend API at: http://localhost:5000"
