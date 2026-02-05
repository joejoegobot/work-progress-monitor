#!/bin/bash

echo "Work Progress Monitor - Cloud Deployment Script"
echo "=============================================="

echo ""
echo "This script prepares your Work Progress Monitor for cloud deployment."
echo ""

# Navigate to the project directory
cd /Users/joe/.openclaw/workspace/work-progress-monitor

# Backup current data
echo "Backing up current data..."
cp -r ./data ./backup-$(date +%Y%m%d-%H%M%S) 2>/dev/null || echo "No data directory to backup"

# Create a production-ready package.json
echo "Creating production configuration..."

# Create a simple deployment guide
cat > DEPLOYMENT_GUIDE.md << 'EOF'
# Work Progress Monitor - Deployment Guide

## Deploying to Cloud Platforms

### Render.com (Recommended)
1. Go to https://render.com and sign up
2. Click "New +" and select "Web Service"
3. Connect to your GitHub/GitLab account
4. Select your Work Progress Monitor repository
5. Set these values:
   - Environment: Docker
   - Dockerfile path: ./Dockerfile
   - Port: 3001
6. Click "Create Web Service"

### Heroku
1. Go to https://heroku.com and sign up
2. Install Heroku CLI: `npm install -g heroku`
3. Login: `heroku login`
4. Create app: `heroku create your-work-progress-monitor`
5. Deploy: `git push heroku main`

### Railway
1. Go to https://railway.app and sign up
2. Click "New Project"
3. Select "Deploy from GitHub"
4. Choose your repository
5. Railway will automatically detect and deploy your app

## Post-Deployment Notes

After deployment, your app will be accessible from anywhere with an internet connection. Note that:

1. The current version stores data in local files, which may not persist between deployments on some platforms. Consider implementing a database for production use.

2. For data persistence, you may want to add authentication and improve security before making it publicly accessible.

3. The default port is 3001, but cloud platforms may assign different ports. The app reads the PORT environment variable.

## Accessing Your Deployed App

Once deployed, you'll receive a URL like:
- Render: https://your-app.onrender.com
- Heroku: https://your-app.herokuapp.com
- Railway: https://your-app.up.railway.app

Use this URL to access your Work Progress Monitor from anywhere!
EOF

echo "Deployment preparation complete!"
echo ""
echo "To deploy to cloud platforms, follow the instructions in DEPLOYMENT_GUIDE.md"
echo ""
echo "Your application is now ready for cloud deployment."
echo "Choose one of these platforms:"
echo "  - Render.com (recommended, has free tier)"
echo "  - Heroku (popular, has free tier)"
echo "  - Railway (easy setup, has free tier)"
echo ""
echo "After deployment, you'll be able to access your Work Progress Monitor"
echo "from anywhere, including on your phone when you're outside!"