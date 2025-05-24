# API Security Documentation

This document provides information about the security implementation in our Blockchain Academic Certificates API.

## Authentication

The API uses JSON Web Tokens (JWT) for authentication. Here's how it works:

1. **Login Process**:
   - Universities and students can log in through their respective endpoints
   - Upon successful authentication, a JWT token is returned
   - This token should be stored by the client and included in subsequent requests

2. **Token Format**:
   - Tokens are formatted as standard JWTs with header, payload, and signature
   - The payload contains the user's email and type (university or student)
   - Tokens are signed with a secret key stored in the server's environment variables

3. **Token Usage**:
   - Include the token in the `Authorization` header of HTTP requests
   - Format: `Authorization: Bearer <token>`

## Secured Endpoints

The following endpoints require authentication:

### University Endpoints

- **GET /api/university/dashboard** - Access university dashboard data
- **POST /api/university/issue** - Issue a new certificate

### Student Endpoints

- **GET /api/student/dashboard** - Access student dashboard data

## Using Authentication with Swagger UI

1. Click the "Authorize" button at the top right of the Swagger UI
2. Enter your JWT token in the format: `Bearer <your-token>`
3. Click "Authorize" to apply the token to all secured endpoints

## Security Best Practices

1. **Token Expiration**: Tokens expire after 24 hours (1 day)
2. **HTTPS**: Always use HTTPS in production to secure data transmission
3. **Minimal Payload**: Tokens contain only necessary information (email and user type)
4. **Cross-Origin Resource Sharing (CORS)**: Properly configured to restrict access

## Error Responses

When authentication fails, you may receive one of the following responses:

- **401 Unauthorized**: No token was provided or the token format is invalid
- **403 Forbidden**: The token is invalid, expired, or doesn't have permission for the requested resource

## Implementation

The authentication logic is implemented in the `auth-middleware.js` file, which exports an `authenticateJWT` middleware function. This function is used to protect routes that require authentication.
