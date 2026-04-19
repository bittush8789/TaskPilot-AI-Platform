# 🔍 Troubleshooting Guide

Common issues and their solutions for the TaskPilot AI Platform.

## 1. Backend Issues
### `ModuleNotFoundError: No module named 'backend'`
- **Cause**: Running uvicorn from the wrong directory.
- **Solution**: Always run from the project root: `python -m uvicorn backend.main:app --reload`.

### `API key not loading`
- **Cause**: `.env` file missing or `GEMINI_API_KEY` not set.
- **Solution**: Verify the `.env` file exists in the root and contains the key. Check container logs: `docker logs taskpilot_backend`.

## 2. Docker & Compose Issues
### `Port 8000 is already in use`
- **Cause**: Another process (like a local uvicorn) is using the port.
- **Solution**: Kill the process or change the port mapping in `docker-compose.yml`.

### `db_1  | Error: Access denied for user 'root'@'localhost'`
- **Cause**: MySQL initialization failed due to existing volume data.
- **Solution**: Clear the volume: `docker-compose down -v` and restart.

## 3. Kubernetes Issues
### `Pod Status: ImagePullBackOff`
- **Cause**: K8s cannot find the image or credentials for the registry are missing.
- **Solution**: Ensure the image is pushed to a registry or use `imagePullPolicy: IfNotPresent` for local testing.

### `Pod Status: CrashLoopBackOff`
- **Cause**: The application is crashing on startup.
- **Solution**: Check logs: `kubectl logs <pod-name> -n taskpilot`. Common causes include missing environment variables or database connection strings.

## 4. CI/CD Issues
### `Build stage failed: Out of disk space`
- **Cause**: Docker cache buildup on the runner.
- **Solution**: Add a step to prune old docker images/containers in the CI pipeline.

### `Security scan failed (Bandit/Semgrep)`
- **Cause**: Vulnerabilities found in code.
- **Solution**: Review the scan report in GitHub Actions and fix the offending code before repushing.
