# API Documentation with Swagger

This project includes comprehensive API documentation using Swagger UI. The documentation provides a user-friendly interface for exploring and testing all available API endpoints.

## Accessing the API Documentation

The API documentation is available at the following URLs when the server is running:

1. **Standard Swagger UI**: 
   ```
   http://localhost:3002/api-docs
   ```

2. **Custom UI** (recommended):
   ```
   http://localhost:3002/api-custom
   ```
   
   Our custom UI includes enhanced features like dark mode, improved search, and better visual organization.

3. **Landing Page**:
   ```
   http://localhost:3002/
   ```
   
   The landing page provides an overview of the API and quick links to documentation.

## Features

- **Interactive Documentation**: Browse and search API endpoints by category
- **Request Testing**: Test API endpoints directly from the browser
- **Schema Models**: View data models and their relationships
- **Authentication**: Test authenticated endpoints with JWT tokens
- **Dark Mode**: Toggle between light and dark themes
- **Keyboard Shortcuts**: Use keyboard shortcuts for common actions
- **Copy to Clipboard**: Easily copy code snippets
- **Responsive Design**: Optimized for mobile and desktop devices

## API Endpoints Overview

The API is organized into the following sections:

1. **Universities** - Endpoints for university registration, authentication, and certificate issuance
2. **Students** - Endpoints for student registration, authentication, and certificate management
3. **Certificates** - Endpoints for retrieving certificate information
4. **Verification** - Endpoints for verifying certificate authenticity on the blockchain
5. **Health** - Endpoint for API health check

## Using Authentication in Swagger

For endpoints that require authentication:

1. Click on the "Authorize" button at the top of the Swagger UI
2. Enter your JWT token in the format: `Bearer <your-token>`
3. Click "Authorize" to apply the token to all authenticated requests

## Development

If you need to update or add new API documentation:

1. Use JSDoc comments (`/**...*/`) above route handlers to document endpoints
2. Use the `@swagger` tag to include Swagger-specific documentation
3. Document models in their respective schema files
4. Restart the server to see your documentation updates

## Example Documentation Format

```javascript
/**
 * @swagger
 * /api/endpoint:
 *   get:
 *     summary: Brief summary
 *     description: Detailed description
 *     tags: [Category]
 *     parameters:
 *       - name: paramName
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success response
 */
```
