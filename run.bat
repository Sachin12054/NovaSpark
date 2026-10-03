@echo off
echo ================================================================
echo Starting AI Project Challenge Hub (Expo Mobile + Firebase)
echo ================================================================

echo [1/2] Launching FastAPI Backend with Firebase on http://localhost:8000 ...
start cmd /k "cd backend && python run_backend.py"

timeout /t 2 >nul

echo [2/2] Launching Expo React Native Mobile App ...
start cmd /k "cd mobile && npx expo start"

echo.
echo ================================================================
echo Applications are running!
echo Expo Metro Bundler: Press 'a' for Android, 'w' for Web, or scan QR in Expo Go
echo FastAPI Backend:    http://localhost:8000
echo OpenAPI Docs:       http://localhost:8000/docs
echo ================================================================
