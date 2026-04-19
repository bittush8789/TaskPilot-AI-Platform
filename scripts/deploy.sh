#!/bin/bash

# --- TaskPilot AI Deployment Script ---

echo "🚀 Starting TaskPilot AI Deployment..."

# 1. Pull latest code
git pull origin main

# 2. Build Docker images
echo "🏗 Building Docker Images..."
docker build -t taskpilot-backend:latest -f infra/docker/Dockerfile.backend .

# 3. Push to Registry (Optional)
# docker push yourusername/taskpilot-backend:latest

# 4. Deploy to Kubernetes
echo "☸️ Deploying to Kubernetes..."
kubectl apply -f infra/kubernetes/

# 5. Check Rollout Status
echo "⏳ Waiting for rollout to complete..."
kubectl rollout status deployment/taskpilot-backend -n taskpilot

echo "✅ Deployment Complete!"
