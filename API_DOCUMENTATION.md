# API Documentation

## Base URL
`/api`

## Authentication Routes (`/api/auth`)
- `POST /register`: Register a new user.
- `POST /login`: Login an existing user (returns JWT token).
- `GET /me`: Get current authenticated user's profile.
- `POST /logout`: Logout user (clear cookies if used, invalidate token).

## User Routes (`/api/users`)
- `GET /`: Admin only. List all users.
- `GET /:id`: Admin only. Get specific user details.
- `PATCH /:id`: Admin only. Update user details or roles.
- `DELETE /:id`: Admin only. Delete a user account.

## File/Folder Management
- `POST /files/upload`: Upload an image or document (Uses Cloudinary).
- `GET /files`: List files for user.
- `DELETE /files/:id`: Delete a file.
- `POST /folders`: Create a new folder.

## Cloud Services (`/api/services`)
- `GET /`: Get available cloud services.
- `POST /`: Admin only. Create a new service offering.

## Error Handling
Standard error response format:
```json
{
  "success": false,
  "message": "Error description",
  "stack": "Stack trace (dev mode only)"
}
```
