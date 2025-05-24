/**
 * @swagger
 * tags:
 *   - name: Universities
 *     description: University management endpoints
 *   - name: Students
 *     description: Student management endpoints
 *   - name: Certificates
 *     description: Certificate management endpoints
 *   - name: Verification
 *     description: Certificate verification endpoints
 *   - name: API
 *     description: General API endpoints
 * 
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   responses:
 *     UnauthorizedError:
 *       description: Access token is missing or invalid
 *     BadRequestError:
 *       description: Invalid request parameters
 *     ServerError:
 *       description: Server error
 */
