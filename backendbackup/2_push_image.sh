#1/bin/bash

echo "Push auth-service Image to Docker Hub..."
docker push guckguck/auth-service:latest

echo "Push data-service Image to Docker Hub..."
docker push guckguck/data-service:latest

echo "Push video-service Image to Docker Hub..."
docker push guckguck/video-service:latest

echo "Push frontend-service Image to Docker Hub..."
docker push guckguck/frontend-service:latest

echo "Push completed."