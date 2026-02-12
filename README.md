# Node.js Demo App - CI/CD Pipeline

![CI/CD Pipeline](https://github.com/Afsheen-Aziz/nodejs-demo-app/workflows/CI/CD%20Pipeline/badge.svg)

This project demonstrates a complete CI/CD automation process using GitHub Actions to build, test, and deploy a Node.js application with Docker.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Setup Instructions](#setup-instructions)
- [CI/CD Pipeline](#cicd-pipeline)
- [Docker Deployment](#docker-deployment)
- [Local Development](#local-development)
- [Interview Questions & Answers](#interview-questions--answers)
- [Troubleshooting](#troubleshooting)

## 🎯 Overview

This is a DevOps internship task demonstrating the complete CI/CD automation process. The project includes:

- A simple Node.js Express application
- Automated testing with GitHub Actions
- Docker containerization
- Automated deployment to DockerHub
- Complete CI/CD pipeline workflow

## ✨ Features

- **Express.js Web Server**: Simple REST API with health checks
- **Automated Testing**: Test suite that runs on every push
- **Docker Support**: Containerized application with health checks
- **CI/CD Pipeline**: Automated build, test, and deployment
- **DockerHub Integration**: Automatic image publishing

## 📁 Project Structure

```
nodejs-demo-app/
├── .github/
│   └── workflows/
│       └── main.yml          # CI/CD workflow configuration
├── app.js                    # Main application file
├── test.js                   # Test suite
├── package.json              # Node.js dependencies
├── Dockerfile                # Docker configuration
├── .dockerignore            # Docker ignore file
├── .gitignore               # Git ignore file
└── README.md                # This file
```

## 🔧 Prerequisites

- Node.js 18 or higher
- Docker Desktop (for local Docker builds)
- DockerHub account
- GitHub account

## 🚀 Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/Afsheen-Aziz/nodejs-demo-app.git
cd nodejs-demo-app
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Run the Application Locally

```bash
npm start
```

The application will be available at `http://localhost:3000`

### 4. Run Tests

```bash
npm test
```

### 5. Configure GitHub Secrets

To enable Docker image deployment, add the following secrets to your GitHub repository:

1. Go to your GitHub repository
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Add the following secrets:
   - `DOCKER_USERNAME`: Your DockerHub username
   - `DOCKER_PASSWORD`: Your DockerHub password or access token

**How to create DockerHub access token:**
1. Log in to DockerHub
2. Go to **Account Settings** → **Security**
3. Click **New Access Token**
4. Give it a name and click **Generate**
5. Copy the token and use it as `DOCKER_PASSWORD`

## 🔄 CI/CD Pipeline

The CI/CD pipeline is defined in `.github/workflows/main.yml` and consists of four main jobs:

### Pipeline Flow

```
Push to main → Test → Build → Docker Build & Push → Deployment Summary
```

### Job Details

1. **Test Job**
   - Checks out the code
   - Sets up Node.js environment
   - Installs dependencies
   - Runs the test suite

2. **Build Job**
   - Runs after tests pass
   - Verifies the application builds correctly
   - Prepares for deployment

3. **Docker Job**
   - Builds Docker image
   - Pushes to DockerHub with multiple tags:
     - `latest` (for main branch)
     - Branch name
     - Git SHA
   - Uses caching for faster builds

4. **Deployment Summary**
   - Shows overall pipeline status
   - Provides deployment information

### Trigger Conditions

The pipeline triggers on:
- Push to `main` branch
- Push to `copilot/automate-code-deployment` branch
- Pull requests to `main` branch

## 🐳 Docker Deployment

### Pull the Image

```bash
docker pull <your-dockerhub-username>/nodejs-demo-app:latest
```

### Run the Container

```bash
docker run -d -p 3000:3000 --name nodejs-app <your-dockerhub-username>/nodejs-demo-app:latest
```

### Test the Container

```bash
# Health check
curl http://localhost:3000/health

# Main endpoint
curl http://localhost:3000/

# API info
curl http://localhost:3000/api/info
```

### Stop the Container

```bash
docker stop nodejs-app
docker rm nodejs-app
```

## 💻 Local Development

### Build Docker Image Locally

```bash
docker build -t nodejs-demo-app .
```

### Run Docker Container Locally

```bash
docker run -p 3000:3000 nodejs-demo-app
```

### Test the Application

```bash
# Root endpoint
curl http://localhost:3000/

# Health check
curl http://localhost:3000/health

# API info
curl http://localhost:3000/api/info
```

## ❓ Interview Questions & Answers

### 1. What is CI/CD?

**CI/CD** stands for **Continuous Integration** and **Continuous Deployment/Delivery**:

- **Continuous Integration (CI)**: The practice of automatically integrating code changes from multiple developers into a shared repository several times a day. Each integration triggers automated builds and tests to detect errors quickly.

- **Continuous Deployment (CD)**: The practice of automatically deploying all code changes that pass the automated tests to production. It ensures that software can be released reliably at any time.

**Benefits:**
- Faster release cycles
- Early bug detection
- Reduced manual errors
- Consistent deployment process

### 2. How do GitHub Actions work?

**GitHub Actions** is a CI/CD platform that allows you to automate workflows directly in your GitHub repository.

**Key Concepts:**
- **Workflows**: Automated processes defined in YAML files in `.github/workflows/`
- **Events**: Triggers that start workflows (push, pull_request, schedule, etc.)
- **Jobs**: A set of steps that execute on the same runner
- **Steps**: Individual tasks that run commands or actions
- **Actions**: Reusable units of code

**Example Flow:**
1. Developer pushes code to GitHub
2. GitHub detects the push event
3. Workflow is triggered
4. Jobs run on virtual machines (runners)
5. Steps execute sequentially
6. Results are reported back

### 3. What are runners?

**Runners** are servers that execute your GitHub Actions workflows.

**Types:**
- **GitHub-hosted runners**: Provided by GitHub (Ubuntu, Windows, macOS)
- **Self-hosted runners**: Your own infrastructure

**GitHub-hosted runners:**
- Pre-configured with common tools
- Clean environment for each job
- Automatically updated
- Free for public repos (limited for private)

**When to use self-hosted:**
- Specific hardware requirements
- Access to internal resources
- Custom software/configurations
- Cost optimization for heavy usage

### 4. Difference between jobs and steps

| Aspect | Jobs | Steps |
|--------|------|-------|
| **Definition** | Set of steps that execute on the same runner | Individual task within a job |
| **Execution** | Run in parallel by default | Run sequentially within a job |
| **Environment** | Each job runs in a fresh virtual environment | All steps share the same environment |
| **Dependencies** | Can depend on other jobs using `needs` | Cannot depend on other jobs |
| **Failure Handling** | If one job fails, others continue (unless dependencies) | If one step fails, subsequent steps skip |

**Example:**
```yaml
jobs:
  test:                    # Job 1
    steps:
      - checkout code      # Step 1
      - run tests         # Step 2
  
  build:                   # Job 2 (runs in parallel)
    needs: test           # Dependency: waits for test
    steps:
      - build app         # Step 1
      - upload artifact   # Step 2
```

### 5. How to secure secrets in GitHub Actions?

**Best Practices:**

1. **Use GitHub Secrets**
   - Store in Settings → Secrets and variables → Actions
   - Encrypted and only exposed to selected workflows
   - Referenced as `${{ secrets.SECRET_NAME }}`

2. **Never hardcode secrets**
   ```yaml
   # ❌ Bad
   password: mypassword123
   
   # ✅ Good
   password: ${{ secrets.DB_PASSWORD }}
   ```

3. **Limit secret access**
   - Use environment-specific secrets
   - Restrict to specific branches
   - Use environments for approvals

4. **Mask sensitive output**
   ```yaml
   - name: Add mask
     run: echo "::add-mask::${{ secrets.API_KEY }}"
   ```

5. **Use OIDC for cloud providers**
   - Avoid long-lived credentials
   - Use temporary tokens

### 6. How to handle deployment errors?

**Strategies:**

1. **Conditional Execution**
   ```yaml
   - name: Deploy
     if: success()  # Only run if previous steps succeed
   ```

2. **Continue on Error**
   ```yaml
   - name: Deploy
     continue-on-error: true
   ```

3. **Retry Logic**
   ```yaml
   - uses: nick-invision/retry@v2
     with:
       max_attempts: 3
       timeout_minutes: 10
   ```

4. **Rollback Mechanism**
   - Keep previous versions
   - Implement blue-green deployment
   - Use canary releases

5. **Notifications**
   - Slack/Email alerts on failure
   - Status badges
   - GitHub deployment status

6. **Logging and Monitoring**
   - Detailed logs for debugging
   - Health checks after deployment
   - Automated testing in production

### 7. Explain the Docker build-push workflow

**Workflow Steps:**

1. **Setup Environment**
   ```yaml
   - uses: docker/setup-buildx-action@v3  # Advanced builder
   ```

2. **Authentication**
   ```yaml
   - uses: docker/login-action@v3
     with:
       username: ${{ secrets.DOCKER_USERNAME }}
       password: ${{ secrets.DOCKER_PASSWORD }}
   ```

3. **Metadata Extraction**
   ```yaml
   - uses: docker/metadata-action@v5  # Generate tags
   ```

4. **Build and Push**
   ```yaml
   - uses: docker/build-push-action@v5
     with:
       push: true
       tags: user/app:latest
       cache-from: type=registry,ref=user/app:buildcache
   ```

**Benefits:**
- **Layer caching**: Faster subsequent builds
- **Multi-platform builds**: ARM, x86, etc.
- **Build args**: Pass secrets securely
- **Automatic tagging**: Latest, version, SHA

### 8. How can you test a CI/CD pipeline locally?

**Methods:**

1. **Act (GitHub Actions locally)**
   ```bash
   # Install act
   curl https://raw.githubusercontent.com/nektos/act/master/install.sh | sudo bash
   
   # Run workflow
   act push
   
   # Run specific job
   act -j test
   ```

2. **Docker Compose**
   - Test multi-service setups
   - Replicate production environment

3. **Local Testing Before Push**
   ```bash
   # Run tests
   npm test
   
   # Build Docker image
   docker build -t app .
   
   # Run container
   docker run -p 3000:3000 app
   
   # Test endpoints
   curl http://localhost:3000/health
   ```

4. **Validate YAML**
   ```bash
   # Using actionlint
   actionlint .github/workflows/main.yml
   ```

5. **Branch Testing**
   - Create feature branch
   - Push to trigger workflow
   - Review results before merging

## 🐛 Troubleshooting

### Common Issues

**1. Docker build fails**
```bash
# Check Dockerfile syntax
docker build -t test .

# View build logs
docker build --progress=plain -t test .
```

**2. Tests failing**
```bash
# Run tests locally
npm test

# Check Node version
node --version
```

**3. Secrets not working**
- Ensure secrets are set in repository settings
- Check secret names match exactly (case-sensitive)
- Verify secret scopes and permissions

**4. Workflow not triggering**
- Check branch name in workflow file
- Verify .github/workflows/ directory location
- Check YAML syntax

## 📝 License

This project is open source and available under the MIT License.

## 👤 Author

DevOps Internship Task - CI/CD Pipeline Implementation

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## ⭐ Show your support

Give a ⭐️ if this project helped you learn CI/CD!
