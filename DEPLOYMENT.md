# Deployment Guide

## 1. Heroku Deployment (Recommended)

### Prerequisites
- Heroku account
- Git installed
- Heroku CLI installed

### Steps
```bash
# 1. Login to Heroku
heroku login

# 2. Create Heroku app
heroku create your-library-app-name

# 3. Add MongoDB Atlas (free tier)
heroku addons:create mongolab:sandbox

# 4. Set environment variables
heroku config:set SESSION_SECRET=your-random-secret-key

# 5. Deploy
git add .
git commit -m "Deploy to Heroku"
git push heroku main

# 6. Open app
heroku open
```

### Default Login
- Admin: admin@library.com / admin123

## 2. Railway Deployment

### Steps
```bash
# 1. Install Railway CLI
npm install -g @railway/cli

# 2. Login and deploy
railway login
railway init
railway up
```

## 3. Render Deployment

1. Connect GitHub repo to Render
2. Set build command: `npm install`
3. Set start command: `npm start`
4. Add environment variables:
   - `MONGODB_URI`: Your MongoDB connection string
   - `SESSION_SECRET`: Random secret key

## 4. Local Development

```bash
# Install dependencies
npm install

# Start MongoDB locally
mongod

# Create admin and sample data
npm run create-admin
npm run add-books

# Start server
npm start
```

Visit: http://localhost:3002

## Environment Variables

- `MONGODB_URI`: MongoDB connection string
- `SESSION_SECRET`: Session encryption key
- `PORT`: Server port (default: 3002)

## Database Setup

### MongoDB Atlas (Cloud)
1. Create account at mongodb.com
2. Create cluster
3. Get connection string
4. Set as MONGODB_URI

### Local MongoDB
- Install MongoDB Community Server
- Default: mongodb://localhost:27017/library_management