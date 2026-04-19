# 📖 Deployment & DevOps Glossary

This document explains the technical terms used in the TaskPilot AI deployment pipeline.

## 1. 🐳 Containerization (Docker)
**Definition**: Packaging an application with its environment (OS, libraries, code).
**In TaskPilot**: We use Docker to ensure the FastAPI backend and MySQL database run consistently across development and production environments.

## 2. ☸️ Orchestration (Kubernetes / K8s)
**Definition**: An automated system for deploying, scaling, and managing containerized applications.
**In TaskPilot**: Kubernetes manages our "Pods" (app instances). It ensures that if one instance crashes, another is started immediately.

## 3. 🔄 CI/CD (Continuous Integration / Deployment)
**Definition**: 
- **CI**: Automated building and testing of code.
- **CD**: Automated delivery of the app to production.
**In TaskPilot**: GitHub Actions handles CI (linting, building images) and CD (deploying to EKS).

## 4. 🏗 Infrastructure as Code (IaC)
**Definition**: Managing infrastructure through machine-readable definition files.
**In TaskPilot**: We use **Terraform** to define our AWS VPC and EKS cluster in code rather than manual configuration.

## 5. 📈 Horizontal Pod Autoscaling (HPA)
**Definition**: Dynamically increasing or decreasing the number of running pods based on CPU/Memory usage.
**In TaskPilot**: If the AI processing load increases, HPA automatically spins up more backend instances.

## 6. 🚪 Ingress
**Definition**: An API object that manages external access to the services in a cluster (typically HTTP).
**In TaskPilot**: The Ingress controller acts as the entry point, routing external traffic to our `taskpilot-service`.

## 7. 📦 Registry (Docker Hub / GHCR)
**Definition**: A central repository for storing and sharing Docker images.
**In TaskPilot**: Our CI pipeline pushes the `taskpilot-backend` image to the registry so the Kubernetes cluster can pull and deploy it.

## 8. 🔐 Secrets Management
**Definition**: Securely storing sensitive data like API keys, passwords, and tokens.
**In TaskPilot**: We use Kubernetes Secrets to store the `GEMINI_API_KEY` so it's never exposed in plain text.

## 9. 🚀 Rolling Update
**Definition**: Updating an application without downtime by replacing old pods with new ones gradually.
**In TaskPilot**: When we push a new version of the agent, Kubernetes ensures users don't experience a service gap.

## 10. 🏥 Health Checks (Liveness/Readiness)
**Definition**: Probes used by Kubernetes to determine if a container is healthy and ready to receive traffic.
**In TaskPilot**: We define these in `deployment.yaml` to monitor the FastAPI `/api/history` endpoint.
