# Interview Questions and Answers - CI/CD & DevOps

This document contains detailed answers to common DevOps interview questions related to CI/CD pipelines, GitHub Actions, and Docker.

## Table of Contents

1. [What is CI/CD?](#1-what-is-cicd)
2. [How do GitHub Actions work?](#2-how-do-github-actions-work)
3. [What are runners?](#3-what-are-runners)
4. [Difference between jobs and steps](#4-difference-between-jobs-and-steps)
5. [How to secure secrets in GitHub Actions?](#5-how-to-secure-secrets-in-github-actions)
6. [How to handle deployment errors?](#6-how-to-handle-deployment-errors)
7. [Explain the Docker build-push workflow](#7-explain-the-docker-build-push-workflow)
8. [How can you test a CI/CD pipeline locally?](#8-how-can-you-test-a-cicd-pipeline-locally)

---

## 1. What is CI/CD?

### Definition

**CI/CD** stands for **Continuous Integration** and **Continuous Deployment/Delivery**.

### Continuous Integration (CI)

Continuous Integration is a development practice where developers integrate code into a shared repository frequently, preferably several times a day. Each integration is verified by an automated build and automated tests.

**Key principles:**
- Developers commit code frequently (at least daily)
- Each commit triggers an automated build
- Automated tests run on every build
- Fast feedback on integration issues
- Issues are detected and fixed quickly

**Benefits:**
- Reduces integration problems
- Early bug detection
- Improves software quality
- Reduces manual testing overhead
- Enables faster development cycles

### Continuous Deployment (CD)

Continuous Deployment is a practice where every change that passes automated tests is automatically deployed to production without human intervention.

**Continuous Delivery** is similar but requires manual approval before deploying to production.

**Key principles:**
- Automated deployment pipeline
- All tests must pass before deployment
- Deployment happens automatically or with one-click approval
- Rollback mechanisms in place
- Monitoring and alerting configured

**Benefits:**
- Faster time to market
- Reduced deployment risk
- Consistent deployment process
- Higher deployment frequency
- Better customer feedback loop

### Real-world Example

In this project:
1. **CI**: When code is pushed, GitHub Actions automatically runs tests
2. **CD**: If tests pass, the code is built and Docker image is pushed to DockerHub
3. The entire process is automated without manual intervention

---

## 2. How do GitHub Actions work?

### Overview

GitHub Actions is a CI/CD platform integrated directly into GitHub that allows you to automate workflows.

### Core Components

#### 1. Workflows
- YAML files in `.github/workflows/` directory
- Define the automation process
- Triggered by events
- Example: `.github/workflows/main.yml`

#### 2. Events
- Triggers that start workflows
- Examples:
  - `push`: Code pushed to repository
  - `pull_request`: PR opened/updated
  - `schedule`: Cron-based scheduling
  - `workflow_dispatch`: Manual trigger
  - `release`: Release created

#### 3. Jobs
- Set of steps that execute on the same runner
- Run in parallel by default
- Can have dependencies using `needs`

#### 4. Steps
- Individual tasks within a job
- Can run commands or actions
- Execute sequentially

#### 5. Actions
- Reusable units of code
- Can be from GitHub Marketplace
- Or custom actions in your repository

### Workflow Execution Process

```
Event (push) → Workflow Triggered → Jobs Start → Steps Execute → Results Reported
```

### Example from Our Project

```yaml
on:
  push:
    branches: [main]  # Event trigger

jobs:
  test:               # Job 1
    runs-on: ubuntu-latest  # Runner
    steps:
      - uses: actions/checkout@v4  # Action
      - run: npm install          # Command
      - run: npm test            # Command
```

### Key Features

1. **Matrix Builds**: Test across multiple versions
   ```yaml
   strategy:
     matrix:
       node-version: [14, 16, 18]
   ```

2. **Caching**: Speed up workflows
   ```yaml
   - uses: actions/setup-node@v4
     with:
       cache: 'npm'
   ```

3. **Artifacts**: Share data between jobs
   ```yaml
   - uses: actions/upload-artifact@v3
   ```

4. **Conditions**: Control execution
   ```yaml
   if: github.ref == 'refs/heads/main'
   ```

---

## 3. What are runners?

### Definition

Runners are servers that execute your GitHub Actions workflows. They listen for available jobs, run one job at a time, and report progress and results back to GitHub.

### Types of Runners

#### 1. GitHub-hosted Runners

**Provided by GitHub:**
- Free for public repositories
- Limited minutes for private repositories
- Clean environment for each job
- Automatically updated

**Available Operating Systems:**
- Ubuntu (Linux)
- Windows Server
- macOS

**Pre-installed Software:**
- Common programming languages (Node.js, Python, Ruby, etc.)
- Package managers (npm, pip, gem, etc.)
- Build tools (make, cmake, etc.)
- Docker
- Cloud CLI tools (AWS CLI, Azure CLI, etc.)

**Specifications (Ubuntu latest):**
- 2-core CPU
- 7 GB RAM
- 14 GB SSD space

**Usage:**
```yaml
runs-on: ubuntu-latest  # or windows-latest, macos-latest
```

#### 2. Self-hosted Runners

**Your own infrastructure:**
- Complete control over hardware
- Custom software installations
- Access to internal resources
- No usage limits (you pay for infrastructure)

**When to use:**
- Specific hardware requirements (GPU, high memory)
- Need access to internal services
- Custom security requirements
- Heavy usage (cost-effective)
- Special software/licenses

**Setup:**
1. Go to repository Settings → Actions → Runners
2. Click "New self-hosted runner"
3. Follow instructions to install on your machine
4. Runner starts listening for jobs

**Usage:**
```yaml
runs-on: self-hosted  # or custom labels
```

### Runner Security

**GitHub-hosted:**
- Isolated environment
- Cleaned after each job
- No data persistence
- Secure by default

**Self-hosted:**
- Your responsibility to secure
- Can persist data
- May have access to internal networks
- Need to manage updates

---

## 4. Difference between jobs and steps

### Jobs

**Definition:** A job is a set of steps that execute on the same runner.

**Characteristics:**
- Run on separate runners
- Have their own virtual environment
- Execute in parallel by default
- Can depend on other jobs using `needs`
- Each job starts with a clean environment

**Example:**
```yaml
jobs:
  job1:
    runs-on: ubuntu-latest
    steps:
      - run: echo "Job 1"
  
  job2:
    runs-on: ubuntu-latest
    needs: job1  # Wait for job1
    steps:
      - run: echo "Job 2"
```

### Steps

**Definition:** Individual tasks that run commands within a job.

**Characteristics:**
- Run sequentially within a job
- Share the same environment
- Can use actions or run shell commands
- If one fails, subsequent steps are skipped (unless configured otherwise)
- Share file system and environment variables

**Example:**
```yaml
steps:
  - name: Step 1
    run: echo "First"
  
  - name: Step 2
    run: echo "Second"
  
  - name: Step 3
    run: echo "Third"
```

### Comparison Table

| Aspect | Jobs | Steps |
|--------|------|-------|
| **Execution** | Parallel by default | Sequential only |
| **Environment** | Separate virtual machines | Shared environment |
| **Dependencies** | Can depend on other jobs | Cannot depend on other jobs |
| **Failure Impact** | Other jobs continue (unless dependent) | Subsequent steps skip |
| **File System** | Isolated | Shared within job |
| **Use Case** | Different tasks (test, build, deploy) | Sequential tasks in a workflow |

### When to Use Multiple Jobs vs. Multiple Steps

**Use multiple jobs when:**
- Tasks can run in parallel
- Tasks need different operating systems
- Tasks are independent
- Want to isolate failures

**Use multiple steps when:**
- Tasks must run sequentially
- Tasks share data/files
- Tasks are part of a single logical unit
- Want to minimize runner time

### Example from Our Project

```yaml
jobs:
  test:              # Job 1: Testing
    steps:
      - checkout
      - setup node
      - install
      - run tests
  
  build:             # Job 2: Building (depends on test)
    needs: test
    steps:
      - checkout
      - setup node
      - install
      - build
  
  docker:            # Job 3: Docker (depends on build)
    needs: build
    steps:
      - checkout
      - docker login
      - docker build
      - docker push
```

---

## 5. How to secure secrets in GitHub Actions?

### GitHub Secrets

GitHub provides encrypted secrets storage for sensitive data.

#### Creating Secrets

1. Go to repository Settings
2. Navigate to Secrets and variables → Actions
3. Click "New repository secret"
4. Add name and value
5. Secret is encrypted and stored securely

#### Using Secrets

```yaml
steps:
  - name: Deploy
    env:
      API_KEY: ${{ secrets.API_KEY }}
    run: ./deploy.sh
```

### Best Practices

#### 1. Never Hardcode Secrets

```yaml
# ❌ BAD - Never do this
env:
  PASSWORD: "mypassword123"
  API_KEY: "sk-1234567890"

# ✅ GOOD - Use secrets
env:
  PASSWORD: ${{ secrets.DB_PASSWORD }}
  API_KEY: ${{ secrets.API_KEY }}
```

#### 2. Mask Secrets in Logs

Secrets are automatically masked, but you can add custom masking:

```yaml
- name: Add mask
  run: |
    echo "::add-mask::${{ secrets.API_KEY }}"
```

#### 3. Limit Secret Scope

**Repository secrets:** Available to all workflows in repository

**Environment secrets:** Only available to specific environments

```yaml
jobs:
  deploy:
    environment: production  # Uses production environment secrets
    steps:
      - run: echo "${{ secrets.PROD_API_KEY }}"
```

#### 4. Use OIDC for Cloud Providers

Instead of storing long-lived credentials:

```yaml
- name: Configure AWS Credentials
  uses: aws-actions/configure-aws-credentials@v2
  with:
    role-to-assume: arn:aws:iam::123456789012:role/GitHubAction
    aws-region: us-east-1
```

**Benefits:**
- No long-lived credentials
- Automatic token rotation
- Better audit trail
- Reduced risk of credential leakage

#### 5. Principle of Least Privilege

- Give secrets minimum required permissions
- Use read-only tokens when possible
- Create service accounts with limited scope

```yaml
# Example: DockerHub token with read-only access
- uses: docker/login-action@v3
  with:
    username: ${{ secrets.DOCKER_USERNAME }}
    password: ${{ secrets.DOCKER_READ_TOKEN }}  # Read-only token
```

#### 6. Rotate Secrets Regularly

- Set expiration dates for tokens
- Rotate every 90 days minimum
- Update secrets when team members leave

#### 7. Use Secret Scanning

GitHub automatically scans for exposed secrets:
- Monitors commits
- Scans pull requests
- Alerts on detected secrets
- Automatically revokes some tokens

### Environment Protection Rules

```yaml
jobs:
  deploy:
    environment:
      name: production
      url: https://myapp.com
    steps:
      - run: ./deploy.sh
```

**Configure in Settings → Environments:**
- Required reviewers
- Wait timer
- Deployment branches
- Environment secrets

### Security Tips

1. **Audit secret usage** regularly
2. **Use environment-specific secrets** for different stages
3. **Never log secrets** (even in debug mode)
4. **Use pull_request_target** carefully (has access to secrets)
5. **Review third-party actions** before using (can access secrets)

---

## 6. How to handle deployment errors?

### 1. Conditional Execution

Control when steps run based on previous step results:

```yaml
steps:
  - name: Deploy
    id: deploy
    run: ./deploy.sh
  
  - name: Rollback on failure
    if: failure()
    run: ./rollback.sh
  
  - name: Notify success
    if: success()
    run: ./notify-success.sh
  
  - name: Always run
    if: always()
    run: ./cleanup.sh
```

**Available conditions:**
- `success()`: Previous steps succeeded
- `failure()`: Any previous step failed
- `always()`: Run regardless of previous steps
- `cancelled()`: Workflow was cancelled

### 2. Continue on Error

Allow workflow to continue even if a step fails:

```yaml
steps:
  - name: Optional step
    continue-on-error: true
    run: ./optional-task.sh
  
  - name: Required step
    run: ./required-task.sh
```

### 3. Timeout Protection

Prevent workflows from running indefinitely:

```yaml
jobs:
  deploy:
    timeout-minutes: 30  # Job timeout
    steps:
      - name: Deploy
        timeout-minutes: 10  # Step timeout
        run: ./deploy.sh
```

### 4. Retry Logic

Automatically retry failed steps:

```yaml
steps:
  - name: Deploy with retry
    uses: nick-invision/retry@v2
    with:
      timeout_minutes: 10
      max_attempts: 3
      retry_wait_seconds: 30
      command: ./deploy.sh
```

### 5. Error Notification

Send alerts when deployments fail:

```yaml
jobs:
  deploy:
    steps:
      - name: Deploy
        id: deploy
        run: ./deploy.sh
      
      - name: Notify on failure
        if: failure()
        uses: slackapi/slack-github-action@v1
        with:
          payload: |
            {
              "text": "Deployment failed: ${{ github.event.head_commit.message }}"
            }
        env:
          SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK }}
```

### 6. Deployment Strategies

#### Blue-Green Deployment

```yaml
steps:
  - name: Deploy to green
    run: ./deploy-green.sh
  
  - name: Health check green
    run: ./health-check.sh green
  
  - name: Switch traffic to green
    run: ./switch-traffic.sh
  
  - name: Rollback to blue on failure
    if: failure()
    run: ./switch-traffic.sh blue
```

#### Canary Deployment

```yaml
steps:
  - name: Deploy canary (10%)
    run: ./deploy-canary.sh --percentage 10
  
  - name: Monitor metrics
    run: ./monitor.sh --duration 5m
  
  - name: Rollback if errors
    if: failure()
    run: ./rollback-canary.sh
  
  - name: Full deployment
    if: success()
    run: ./deploy-full.sh
```

### 7. Health Checks

Always verify deployment health:

```yaml
steps:
  - name: Deploy
    run: ./deploy.sh
  
  - name: Wait for startup
    run: sleep 30
  
  - name: Health check
    run: |
      for i in {1..10}; do
        if curl -f http://app/health; then
          echo "Health check passed"
          exit 0
        fi
        sleep 10
      done
      echo "Health check failed"
      exit 1
  
  - name: Rollback on unhealthy
    if: failure()
    run: ./rollback.sh
```

### 8. Rollback Mechanism

Always have a rollback plan:

```yaml
steps:
  - name: Backup current version
    run: ./backup-version.sh
  
  - name: Deploy new version
    id: deploy
    run: ./deploy.sh
  
  - name: Verify deployment
    run: ./verify.sh
  
  - name: Rollback if failed
    if: failure()
    run: ./rollback.sh
```

### 9. Manual Approval

Require approval before critical deployments:

```yaml
jobs:
  deploy:
    environment:
      name: production
      # Requires manual approval in GitHub UI
    steps:
      - name: Deploy to production
        run: ./deploy.sh
```

### 10. Monitoring and Logging

Comprehensive logging for debugging:

```yaml
steps:
  - name: Deploy
    run: |
      set -x  # Enable debug mode
      ./deploy.sh 2>&1 | tee deploy.log
  
  - name: Upload logs on failure
    if: failure()
    uses: actions/upload-artifact@v3
    with:
      name: deployment-logs
      path: deploy.log
```

---

## 7. Explain the Docker build-push workflow

### Overview

The Docker build-push workflow builds a Docker image from your application and pushes it to a container registry (like DockerHub).

### Workflow Steps

#### 1. Setup Docker Buildx

```yaml
- name: Set up Docker Buildx
  uses: docker/setup-buildx-action@v3
```

**What it does:**
- Sets up Docker Buildx (advanced builder)
- Enables multi-platform builds
- Provides better caching
- Supports BuildKit features

#### 2. Login to Registry

```yaml
- name: Log in to Docker Hub
  uses: docker/login-action@v3
  with:
    username: ${{ secrets.DOCKER_USERNAME }}
    password: ${{ secrets.DOCKER_PASSWORD }}
```

**Supported registries:**
- DockerHub
- GitHub Container Registry (ghcr.io)
- Amazon ECR
- Google Container Registry
- Azure Container Registry

#### 3. Extract Metadata

```yaml
- name: Extract metadata
  id: meta
  uses: docker/metadata-action@v5
  with:
    images: username/app
    tags: |
      type=ref,event=branch
      type=ref,event=pr
      type=semver,pattern={{version}}
      type=sha,prefix={{branch}}-
      type=raw,value=latest,enable={{is_default_branch}}
```

**Generated tags:**
- `main` - branch name
- `pr-123` - pull request number
- `v1.0.0` - semantic version
- `main-abc1234` - branch + git SHA
- `latest` - only on main branch

#### 4. Build and Push

```yaml
- name: Build and push
  uses: docker/build-push-action@v5
  with:
    context: .
    push: true
    tags: ${{ steps.meta.outputs.tags }}
    labels: ${{ steps.meta.outputs.labels }}
    cache-from: type=registry,ref=user/app:buildcache
    cache-to: type=registry,ref=user/app:buildcache,mode=max
```

**Parameters:**
- `context`: Build context (usually `.`)
- `push`: Push to registry after build
- `tags`: Image tags
- `labels`: OCI labels (metadata)
- `cache-from`: Use cached layers
- `cache-to`: Save cache for next build

### Advanced Features

#### Multi-platform Builds

Build for multiple architectures:

```yaml
- name: Build and push
  uses: docker/build-push-action@v5
  with:
    platforms: linux/amd64,linux/arm64
    push: true
    tags: user/app:latest
```

#### Build Arguments

Pass variables to Dockerfile:

```yaml
- name: Build and push
  uses: docker/build-push-action@v5
  with:
    build-args: |
      NODE_ENV=production
      API_URL=${{ secrets.API_URL }}
    push: true
    tags: user/app:latest
```

**In Dockerfile:**
```dockerfile
ARG NODE_ENV
ARG API_URL
ENV NODE_ENV=$NODE_ENV
ENV API_URL=$API_URL
```

#### Secrets in Build

Pass secrets securely:

```yaml
- name: Build and push
  uses: docker/build-push-action@v5
  with:
    secrets: |
      "npm_token=${{ secrets.NPM_TOKEN }}"
    push: true
    tags: user/app:latest
```

**In Dockerfile:**
```dockerfile
RUN --mount=type=secret,id=npm_token \
    NPM_TOKEN=$(cat /run/secrets/npm_token) \
    npm install
```

### Caching Strategies

#### Registry Cache

```yaml
cache-from: type=registry,ref=user/app:buildcache
cache-to: type=registry,ref=user/app:buildcache,mode=max
```

#### GitHub Actions Cache

```yaml
cache-from: type=gha
cache-to: type=gha,mode=max
```

#### Local Cache

```yaml
cache-from: type=local,src=/tmp/.buildx-cache
cache-to: type=local,dest=/tmp/.buildx-cache-new,mode=max
```

### Complete Example

```yaml
jobs:
  docker:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      
      - name: Set up QEMU
        uses: docker/setup-qemu-action@v3
      
      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3
      
      - name: Login to DockerHub
        uses: docker/login-action@v3
        with:
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_PASSWORD }}
      
      - name: Extract metadata
        id: meta
        uses: docker/metadata-action@v5
        with:
          images: ${{ secrets.DOCKER_USERNAME }}/myapp
          tags: |
            type=ref,event=branch
            type=semver,pattern={{version}}
            type=sha
            type=raw,value=latest,enable={{is_default_branch}}
      
      - name: Build and push
        uses: docker/build-push-action@v5
        with:
          context: .
          platforms: linux/amd64,linux/arm64
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}
          cache-from: type=registry,ref=${{ secrets.DOCKER_USERNAME }}/myapp:buildcache
          cache-to: type=registry,ref=${{ secrets.DOCKER_USERNAME }}/myapp:buildcache,mode=max
          build-args: |
            BUILD_DATE=${{ steps.meta.outputs.created }}
            VCS_REF=${{ github.sha }}
```

### Benefits

1. **Automated tagging**: Consistent tag naming
2. **Layer caching**: Faster builds (reuses unchanged layers)
3. **Multi-platform**: Build for different architectures
4. **Security**: Secrets never exposed in image
5. **Metadata**: Proper image labels for tracking
6. **Efficiency**: Only rebuilds changed layers

---

## 8. How can you test a CI/CD pipeline locally?

### 1. Act - Run GitHub Actions Locally

**Act** is a tool that runs GitHub Actions workflows locally using Docker.

#### Installation

```bash
# macOS
brew install act

# Linux
curl https://raw.githubusercontent.com/nektos/act/master/install.sh | sudo bash

# Windows
choco install act-cli
```

#### Basic Usage

```bash
# List workflows
act -l

# Run push event
act push

# Run pull_request event
act pull_request

# Run specific job
act -j test

# Run specific workflow
act -W .github/workflows/main.yml

# Dry run (show what would be executed)
act -n
```

#### With Secrets

Create `.secrets` file:
```
DOCKER_USERNAME=myusername
DOCKER_PASSWORD=mytoken
API_KEY=secret123
```

Run with secrets:
```bash
act --secret-file .secrets
```

Or pass individually:
```bash
act -s DOCKER_USERNAME=myuser -s DOCKER_PASSWORD=mytoken
```

#### Limitations

- Not 100% identical to GitHub Actions
- Some GitHub-specific contexts unavailable
- May have issues with some actions
- Resource-intensive (runs in Docker)

### 2. Local Testing Before Pushing

Test components individually:

#### Test Application

```bash
# Install dependencies
npm install

# Run tests
npm test

# Run linter
npm run lint

# Build application
npm run build
```

#### Test Docker Build

```bash
# Build image
docker build -t myapp:test .

# Run container
docker run -d -p 3000:3000 --name test-app myapp:test

# Test endpoints
curl http://localhost:3000/health
curl http://localhost:3000/

# Check logs
docker logs test-app

# Stop and remove
docker stop test-app
docker rm test-app
```

#### Test Multi-stage Builds

```bash
# Build specific stage
docker build --target builder -t myapp:builder .

# Test each stage
docker build --target test -t myapp:test .
docker run myapp:test npm test
```

### 3. Validate YAML Syntax

#### Using actionlint

```bash
# Install
brew install actionlint  # macOS
go install github.com/rhysd/actionlint/cmd/actionlint@latest

# Validate workflow
actionlint .github/workflows/main.yml

# Validate all workflows
actionlint
```

#### Using yamllint

```bash
# Install
pip install yamllint

# Validate
yamllint .github/workflows/main.yml
```

#### Online Validators

- [YAML Lint](http://www.yamllint.com/)
- [GitHub Actions Workflow Validator](https://rhysd.github.io/actionlint/)

### 4. Docker Compose for Complex Setups

For multi-service applications:

**docker-compose.yml:**
```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DB_HOST=db
    depends_on:
      - db
  
  db:
    image: postgres:15
    environment:
      - POSTGRES_PASSWORD=testpass
    ports:
      - "5432:5432"
```

**Test:**
```bash
# Build and start services
docker-compose up -d

# View logs
docker-compose logs -f

# Test app
curl http://localhost:3000/health

# Stop services
docker-compose down
```

### 5. Branch Testing Strategy

Use feature branches to test workflows:

```bash
# Create feature branch
git checkout -b test/ci-workflow

# Make changes to workflow
vim .github/workflows/main.yml

# Commit and push
git add .github/workflows/main.yml
git commit -m "Test workflow changes"
git push origin test/ci-workflow

# Monitor in GitHub Actions tab
# If successful, merge to main
```

### 6. Mock External Services

For testing integrations:

#### Use LocalStack for AWS

```bash
docker run -d -p 4566:4566 localstack/localstack
```

#### Use MockServer

```bash
docker run -d -p 1080:1080 mockserver/mockserver
```

### 7. Pre-commit Hooks

Catch issues before committing:

**.pre-commit-config.yaml:**
```yaml
repos:
  - repo: https://github.com/pre-commit/pre-commit-hooks
    rev: v4.4.0
    hooks:
      - id: trailing-whitespace
      - id: end-of-file-fixer
      - id: check-yaml
      - id: check-added-large-files
```

**Install:**
```bash
pip install pre-commit
pre-commit install
```

### 8. Testing Checklist

Before pushing changes:

- [ ] Code builds successfully
- [ ] All tests pass
- [ ] Linter passes
- [ ] Docker image builds
- [ ] Docker container runs
- [ ] Application responds correctly
- [ ] Workflow YAML is valid
- [ ] Environment variables are set correctly
- [ ] Secrets are not hardcoded
- [ ] Documentation is updated

### 9. GitHub Actions Debug Mode

Enable detailed logging:

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - name: Debug info
        run: |
          echo "Event: ${{ github.event_name }}"
          echo "Ref: ${{ github.ref }}"
          echo "SHA: ${{ github.sha }}"
          echo "Actor: ${{ github.actor }}"
          env | sort
```

Or enable step debugging:
```yaml
- name: Setup debugging
  run: echo "::debug::Debug message here"
```

Enable in repository:
Settings → Secrets → Add `ACTIONS_STEP_DEBUG` = `true`

### 10. Gradual Rollout

Test in stages:

1. **Development branch**: Test workflow changes
2. **Staging environment**: Test full deployment
3. **Canary deployment**: Deploy to small subset
4. **Full deployment**: Deploy to all users

## Summary

Understanding these concepts is crucial for:
- Building robust CI/CD pipelines
- Implementing DevOps best practices
- Ensuring secure deployments
- Handling production issues effectively

Practice these concepts in real projects to gain hands-on experience and prepare for DevOps interviews.
