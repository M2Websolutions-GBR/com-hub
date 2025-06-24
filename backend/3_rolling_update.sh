#1/bin/bash

# Restarting backend-services
kubectl rollout restart deployment video-service
kubectl rollout restart deployment auth-service
kubectl rollout restart deployment data-service
