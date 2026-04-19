#!/bin/bash

# --- TaskPilot AI Rollback Script ---

echo "⚠️ Initiating Rollback..."

# Rollback Kubernetes deployment to the previous version
kubectl rollout undo deployment/taskpilot-backend -n taskpilot

echo "⏳ Checking status of rollback..."
kubectl rollout status deployment/taskpilot-backend -n taskpilot

echo "✅ Rollback Successful!"
