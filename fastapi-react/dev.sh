#!/usr/bin/env bash

# stop the script if some command returns an error
set -e

# clean up background processes
cleanup() {
    echo "Cleaning up..."
    # kill all background processes in the current process group
    kill -- -$$
}

# trap the EXIT signal to execute cleanup function
trap cleanup EXIT

# start the backend
echo "[+] Installing backend dependencies - if not present..."
cd backend/
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt > /dev/null 2>&1
cd app/
echo "[+] Starting the backend service..."
uvicorn main:app --host 0.0.0.0 --port 8000 --reload > /dev/null 2>&1 &
echo "[+] Backend running on port 8000..."

# start the frontend
cd ../../frontend
echo "[+] Installing frontend dependencies - if not present..."
npm install > /dev/null 2>&1
npm start > /dev/null 2>&1 &
echo "[+] Frontend running on port 3000..."

wait
