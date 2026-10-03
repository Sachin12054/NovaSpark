#!/usr/bin/env bash

echo "================================================================"
echo "Starting AI Project Challenge Hub (Expo Mobile + Firebase)"
echo "================================================================"

# Start backend
(cd backend && python run_backend.py) &
BACKEND_PID=$!

sleep 2

# Start Expo
(cd mobile && npx expo start) &
EXPO_PID=$!

echo "FastAPI Backend: http://localhost:8000"
echo "Expo Bundler starting in mobile/..."

wait $BACKEND_PID $EXPO_PID
