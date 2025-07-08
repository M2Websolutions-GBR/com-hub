#!/bin/bash

echo "Building auth-service docker Image..."
docker build -t guckguck/auth-service:latest -f Auth/Dockerfile .

echo "Building data-service docker Image..."
docker build -t guckguck/data-service:latest -f Data/Dockerfile .

echo "Building video-service docker Image..."
docker build -t guckguck/video-service:latest -f Video/Dockerfile .

# echo "Building frontend-service docker Image..."
# docker build -t guckguck/frontend-service:latest -f ../frontend/Dockerfile .

echo "Build completed"