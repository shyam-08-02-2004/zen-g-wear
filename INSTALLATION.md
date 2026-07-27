# Installation Guide

## Prerequisites
- Node.js (v16 or higher)
- MongoDB (Local or Atlas)
- Cloudinary Account (for image uploads)

## Steps

1. **Clone the repository** (if applicable):
   ```bash
   git clone <repo-url>
   cd "E commerce website"
   ```

2. **Install Server Dependencies**:
   ```bash
   cd server
   npm install
   ```

3. **Install Client Dependencies**:
   ```bash
   cd ../client
   npm install
   ```

4. **Environment Variables**:
   - In the `server` directory, copy `.env.example` to `.env` and fill in your MongoDB URI, JWT Secret, and Cloudinary credentials.
   - In the `client` directory, copy `.env.example` to `.env` and ensure the API base URL matches the server.

5. **Run the Application**:
   - In the `server` directory: `npm run dev` (Runs on port 5000)
   - In the `client` directory: `npm run dev` (Runs on Vite default port, e.g., 5173)

You are now ready to use the application!
