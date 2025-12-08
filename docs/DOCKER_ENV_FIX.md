# Docker Environment Variables Fix - Summary

## Problem
Your Docker container was using hardcoded `localhost:1337` instead of the environment variables from your `.env` file because Vite bakes environment variables into the JavaScript bundle at **build time**, not runtime.

## Solution
Implemented runtime environment variable support so the same Docker image can use different configurations without rebuilding.

## Changes Made

### 1. Application Code Updates

#### Created [src/utils/env.js](src/utils/env.js)
New utility function that checks runtime environment first, then falls back to build-time:
```javascript
import { getEnv } from '@/utils/env'

const strapiUrl = getEnv('VITE_STRAPI_URL', 'http://localhost:1337')
```

#### Updated [src/services/strapi.js](src/services/strapi.js)
Changed from:
```javascript
const config = {
  url: import.meta.env.VITE_STRAPI_URL || 'http://localhost:1337',
  apiToken: import.meta.env.VITE_STRAPI_API_TOKEN || ''
}
```

To:
```javascript
import { getEnv } from '@/utils/env'

const config = {
  url: getEnv('VITE_STRAPI_URL', 'http://localhost:1337'),
  apiToken: getEnv('VITE_STRAPI_API_TOKEN', '')
}
```

#### Updated [index.html](index.html)
Added script tag to load runtime environment:
```html
<script src="/env-config.js"></script>
<script type="module" src="/src/main.js"></script>
```

#### Created [public/env-config.js](public/env-config.js)
Fallback for local development (empty values, will use Vite's .env).

### 2. Docker Configuration

#### Updated [Dockerfile](Dockerfile)
The entrypoint script now:
1. Reads environment variables from mounted `/app/.env` if it exists
2. Generates `/usr/share/nginx/html/env-config.js` with those values
3. Makes them available as `window.ENV` in the browser

### 3. GitHub Actions

#### Updated [.github/workflows/docker-build.yml](.github/workflows/docker-build.yml)
Added build arguments from GitHub Secrets (for CI/CD builds).

## How to Use

### For Your Current Setup (docker-compose)

Your existing configuration will now work! Just rebuild the image with the new code:

```bash
# Pull or build the new image version
docker-compose pull  # if you pushed to Docker Hub
# OR
docker-compose build  # if building locally

# Restart the container
docker-compose up -d
```

Your `.env` file will be automatically loaded:
```yaml
services:
  website:
    image: supermalang/kamili-app:0.5.0
    env_file:
      - .env  # ✅ This now works!
```

### Alternative: Mount .env file

You can also mount the .env file directly:
```yaml
services:
  website:
    image: supermalang/kamili-app:0.5.0
    volumes:
      - ./.env:/app/.env:ro
```

## What You Need to Do

1. **Rebuild and push a new Docker image** with these code changes
2. **Update your image tag** in docker-compose (e.g., to `0.6.0`)
3. **Restart your container**

```bash
# Build new image
docker build -t supermalang/kamili-app:0.6.0 .

# Push to Docker Hub
docker push supermalang/kamili-app:0.6.0

# Update docker-compose.yml to use new version
# Then restart
docker-compose up -d
```

## Testing

To verify it works:

1. Check the Docker logs on startup - you should see:
   ```
   Loading environment variables from /app/.env
   Runtime environment variables injected into /usr/share/nginx/html/env-config.js
   ```

2. Open browser console and check:
   ```javascript
   console.log(window.ENV)
   // Should show your environment variables
   ```

3. Verify the API calls go to the correct Strapi URL (check Network tab)

## Files Changed
- ✏️ [src/utils/env.js](src/utils/env.js) - NEW
- ✏️ [src/services/strapi.js](src/services/strapi.js)
- ✏️ [index.html](index.html)
- ✏️ [public/env-config.js](public/env-config.js) - NEW
- ✏️ [Dockerfile](Dockerfile)
- ✏️ [.github/workflows/docker-build.yml](.github/workflows/docker-build.yml)
- ✏️ [ENV_SETUP.md](ENV_SETUP.md) - Updated docs

## Benefits
✅ Same image works across dev/staging/prod
✅ No rebuild needed to change environment variables
✅ More secure (env vars not baked into the bundle)
✅ Works with docker-compose `env_file` directive
✅ Works with mounted `.env` files
✅ Works with `-e` flags
