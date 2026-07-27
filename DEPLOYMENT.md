# Deployment Guide

This guide describes how to deploy the Zen-G Wear MERN application to a production environment.

## 1. Backend Deployment (Render, Heroku, or DigitalOcean)
- Ensure your MongoDB database is hosted on MongoDB Atlas.
- Configure Environment Variables on your hosting provider (matching `server/.env.example`).
- Set the build command: `npm install`
- Set the start command: `npm start`
- Ensure CORS in `server.js` is configured to allow your frontend URL.

## 2. Frontend Deployment (Vercel or Netlify)
- Link your GitHub repository to Vercel/Netlify.
- Framework Preset: `Vite`
- Build Command: `npm run build`
- Output Directory: `dist`
- Add the `VITE_API_BASE_URL` pointing to your deployed backend URL in the environment variables.

## 3. Cloudinary Configuration
- Ensure your Cloudinary credentials are correct on the production backend to allow smooth image uploads.

Your application should now be live!
