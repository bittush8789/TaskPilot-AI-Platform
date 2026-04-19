# TaskPilot AI Setup & Execution Guide

Follow this guide to deploy the TaskPilot AI platform from Day 1 to Production.

## 📅 Day 1: Local Development Setup
1. **Clone & Install**:
   ```bash
   git clone https://github.com/yourusername/taskpilot-ai.git
   cd taskpilot-ai
   pip install -r backend/requirements.txt
   ```
2. **Environment**:
   Copy `.env.example` to `.env` and add your `GEMINI_API_KEY`.
3. **Database**:
   Initializes automatically on first run using SQLAlchemy.
4. **Run**:
   ```bash
   uvicorn backend.main:app --reload
   ```

## 📅 Day 2: Containerization with Docker
1. **Build Image**:
   ```bash
   docker build -t taskpilot-backend -f infra/docker/Dockerfile.backend .
   ```
2. **Compose Run**:
   ```bash
   docker-compose -f infra/docker/docker-compose.yml up
   ```

## 📅 Day 3: CI/CD & Security Scanning
1. **GitHub Actions**:
   Push your code to GitHub. The pipeline in `.github/workflows/main.yml` will trigger automatically.
2. **Security Checks**:
   Check the "Actions" tab to ensure **Semgrep**, **Bandit**, and **Trivy** scans passed.

## 📅 Day 4: Infrastructure with Terraform
1. **Provision AWS EKS**:
   ```bash
   cd infra/terraform
   terraform init
   terraform apply
   ```

## 📅 Day 5: Kubernetes Production Deployment
1. **Apply Manifests**:
   ```bash
   kubectl apply -f infra/kubernetes/
   ```
2. **Monitor Pods**:
   ```bash
   kubectl get pods -n taskpilot -w
   ```
3. **Access App**:
   Get the LoadBalancer IP:
   ```bash
   kubectl get service -n taskpilot
   ```

## 📅 Day 6: Monitoring & LLMOps
1. **Install Monitoring Stack**:
   Use Helm to install Prometheus and Grafana.
2. **Dashboard**:
   Import the TaskPilot Grafana dashboard to track model latency and API health.
