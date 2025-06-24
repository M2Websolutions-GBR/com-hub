#!/bin/bash
set -e

# Configure kubectl
aws eks update-kubeconfig --name "$1" --region "$2"

# Apply Kubernetes manifests
kubectl apply -f ../../backend/k8s/test-manifests/authdeploy.yaml
kubectl apply -f ../../backend/k8s/test-manifests/datadeploy.yaml
kubectl apply -f ../../backend/k8s/test-manifests/frontenddeploy.yaml
kubectl apply -f ../../backend/k8s/test-manifests/ingress.yaml
kubectl apply -f ../../backend/k8s/test-manifests/mongodb-deploy.yaml
kubectl apply -f ../../backend/k8s/test-manifests/videodeploy.yaml
