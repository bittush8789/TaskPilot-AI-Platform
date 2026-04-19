# 🛠 Essential Commands Documentation

This file contains all the critical commands used for managing the TaskPilot AI Platform.

## 🐳 Docker Commands
| Command | Description |
|---------|-------------|
| `docker build -t tp-backend -f infra/docker/Dockerfile.backend .` | Build the backend image |
| `docker-compose -f infra/docker/docker-compose.yml up -d` | Run in detached mode |
| `docker logs -f taskpilot_backend` | View backend logs |
| `docker exec -it taskpilot_mysql mysql -u root -p` | Enter MySQL container |

## ☸️ Kubernetes Commands
| Command | Description |
|---------|-------------|
| `kubectl apply -f infra/kubernetes/` | Deploy all manifests |
| `kubectl get pods -n taskpilot` | List all pods |
| `kubectl logs <pod-name> -n taskpilot` | View pod logs |
| `kubectl describe pod <pod-name> -n taskpilot` | Troubleshooting pod issues |
| `kubectl get hpa -n taskpilot` | Check autoscaling status |

## 🌍 Terraform Commands
| Command | Description |
|---------|-------------|
| `terraform init` | Initialize terraform |
| `terraform plan` | See infrastructure changes |
| `terraform apply --auto-approve` | Provision infrastructure |
| `terraform destroy` | Tear down infrastructure |

## 🛡 Security Commands
| Command | Description |
|---------|-------------|
| `bandit -r backend/` | Scan python code for security issues |
| `semgrep --config auto backend/` | Static analysis scanning |
| `trivy image <image-name>` | Scan docker image for vulnerabilities |
| `gitleaks detect --source .` | Scan for hardcoded secrets |

## 📈 Monitoring Commands
| Command | Description |
|---------|-------------|
| `helm install prometheus prometheus-community/prometheus` | Install Prometheus |
| `kubectl port-forward service/prometheus-server 9090` | Access Prometheus UI |
