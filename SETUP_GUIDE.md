# Setup Guide for CI/CD Pipeline

This guide will help you set up the CI/CD pipeline for the Node.js Demo App.

## Step 1: Fork or Clone the Repository

```bash
git clone https://github.com/Afsheen-Aziz/nodejs-demo-app.git
cd nodejs-demo-app
```

## Step 2: Create a DockerHub Account

If you don't have a DockerHub account:

1. Visit https://hub.docker.com/
2. Click "Sign Up"
3. Follow the registration process

## Step 3: Create a DockerHub Access Token

1. Log in to DockerHub
2. Click on your username in the top right
3. Select "Account Settings"
4. Go to "Security" tab
5. Click "New Access Token"
6. Give it a description (e.g., "GitHub Actions")
7. Set permissions to "Read, Write, Delete"
8. Click "Generate"
9. **IMPORTANT**: Copy the token immediately (you won't be able to see it again)

## Step 4: Add Secrets to GitHub Repository

1. Go to your GitHub repository
2. Click on "Settings" tab
3. In the left sidebar, expand "Secrets and variables"
4. Click "Actions"
5. Click "New repository secret"

### Add DOCKER_USERNAME:
- Name: `DOCKER_USERNAME`
- Value: Your DockerHub username (e.g., `johndoe`)

### Add DOCKER_PASSWORD:
- Name: `DOCKER_PASSWORD`
- Value: The access token you copied in Step 3

## Step 5: Verify the Setup

1. Make a small change to the code (e.g., update README.md)
2. Commit and push to the `main` branch or `copilot/automate-code-deployment` branch:
   ```bash
   git add .
   git commit -m "Test CI/CD pipeline"
   git push origin main
   ```
3. Go to the "Actions" tab in your GitHub repository
4. You should see the workflow running
5. Wait for it to complete (usually 2-3 minutes)

## Step 6: Verify Docker Image on DockerHub

1. Log in to DockerHub
2. Go to your repositories
3. You should see `nodejs-demo-app` repository
4. Click on it to see the tags (latest, branch name, SHA)

## Step 7: Pull and Run the Docker Image

```bash
# Pull the image
docker pull <your-dockerhub-username>/nodejs-demo-app:latest

# Run the container
docker run -d -p 3000:3000 --name nodejs-app <your-dockerhub-username>/nodejs-demo-app:latest

# Test the application
curl http://localhost:3000/
curl http://localhost:3000/health

# Stop and remove the container
docker stop nodejs-app
docker rm nodejs-app
```

## Troubleshooting

### Workflow fails with "unauthorized" error

- Check that `DOCKER_USERNAME` and `DOCKER_PASSWORD` secrets are correctly set
- Verify the access token has not expired
- Ensure the access token has write permissions

### Workflow fails at test step

- Run `npm install` and `npm test` locally to debug
- Check Node.js version compatibility

### Docker image not appearing on DockerHub

- Check the workflow logs in GitHub Actions
- Verify the Docker job completed successfully
- Ensure you're looking at the correct DockerHub account

### Cannot pull Docker image

- Verify the image name: `<username>/nodejs-demo-app:latest`
- Check that the image was pushed successfully
- Ensure the repository is public or you're logged in

## Security Best Practices

1. **Never commit secrets** to the repository
2. **Use access tokens** instead of passwords
3. **Rotate tokens regularly** (every 90 days recommended)
4. **Use minimal permissions** for tokens
5. **Enable 2FA** on both GitHub and DockerHub accounts

## Next Steps

- Customize the Node.js application for your needs
- Add more tests to improve coverage
- Configure environment-specific deployments (staging, production)
- Set up monitoring and logging
- Implement blue-green or canary deployments
- Add deployment notifications (Slack, email, etc.)

## Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Docker Documentation](https://docs.docker.com/)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)

## Support

If you encounter any issues:
1. Check the Actions tab for detailed logs
2. Review the troubleshooting section
3. Open an issue on GitHub with detailed error messages
