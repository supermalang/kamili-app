# Docker Guide

This document explains how to use Docker with the Kamili App and how the automated Docker Hub deployment works.

## Local Development with Docker

### Building the Image

```sh
docker build -t kamili-app .
```

### Running the Container

```sh
docker run -p 8080:80 kamili-app
```

The app will be available at `http://localhost:8080`

### Using Docker Compose (Optional)

Create a `docker-compose.yml` file:

```yaml
version: '3.8'
services:
  web:
    build: .
    ports:
      - "8080:80"
    restart: unless-stopped
```

Then run:

```sh
docker-compose up -d
```

## Automated Docker Hub Deployment

### How It Works

The GitHub Actions workflow (`.github/workflows/docker-build.yml`) automatically:
- Builds a Docker image whenever code is pushed to the `master` branch
- Tags the image with:
  - `latest` (for the master branch)
  - `master-<commit-sha>` (specific commit)
  - `master` (branch name)
- Pushes the image to Docker Hub
- Uses GitHub Actions cache to speed up builds

### Setting Up GitHub Secrets

To enable automated deployment, configure these secrets in your GitHub repository:

1. Go to your repository on GitHub
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Add the following secrets:

   - `DOCKERHUB_USERNAME`: Your Docker Hub username
   - `DOCKERHUB_TOKEN`: Your Docker Hub access token (not your password)

#### Creating a Docker Hub Access Token

1. Log in to [Docker Hub](https://hub.docker.com/)
2. Go to **Account Settings** → **Security**
3. Click **New Access Token**
4. Give it a description (e.g., "GitHub Actions")
5. Select permissions (Read, Write, Delete recommended)
6. Copy the token and add it to GitHub secrets

### Customizing the Image Name

The workflow uses the image name format: `<DOCKERHUB_USERNAME>/kamili-app`

To change this, edit the `DOCKER_IMAGE` environment variable in `.github/workflows/docker-build.yml`:

```yaml
env:
  DOCKER_IMAGE: your-username/your-custom-image-name
```

## Dockerfile Details

The Dockerfile uses a multi-stage build:

1. **Builder Stage**:
   - Uses `node:20-alpine` base image
   - Installs dependencies
   - Builds the production bundle with `npm run build`

2. **Production Stage**:
   - Uses `nginx:alpine` base image (lightweight)
   - Copies the built static files from the builder stage
   - Serves the app on port 80

### Custom Nginx Configuration (Optional)

If you need custom nginx settings, create an `nginx.conf` file and uncomment the copy line in the Dockerfile:

```dockerfile
COPY nginx.conf /etc/nginx/nginx.conf
```

## Pulling and Running from Docker Hub

Once the workflow has run, you can pull and run the image from Docker Hub:

```sh
docker pull <your-dockerhub-username>/kamili-app:latest
docker run -p 8080:80 <your-dockerhub-username>/kamili-app:latest
```

## Troubleshooting

### Build Fails in GitHub Actions

- Check that secrets are correctly configured
- Verify your Docker Hub credentials
- Check the Actions logs for specific error messages

### Image Size Concerns

The current setup uses Alpine-based images for minimal size. The final image should be around 50-60 MB.

### Port Conflicts

If port 8080 is already in use, change the port mapping:

```sh
docker run -p 3000:80 kamili-app
```
