# Developer Guide: Adding New Endpoints with Swagger Documentation

This guide explains how to add new API endpoints to the Blockchain Academic Certificates system and document them using Swagger.

## Step 1: Create Your Route Handler

Add your new endpoint in the appropriate route file under the `routes/` directory:

```javascript
// Example new endpoint
router.post('/new-endpoint', authenticateJWT, async (req, res) => {
  try {
    // Your implementation here
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
```

## Step 2: Document the Endpoint with JSDoc and Swagger Annotations

Add JSDoc comments with Swagger annotations above your endpoint:

```javascript
/**
 * @swagger
 * /api/path/new-endpoint:
 *   post:
 *     summary: Brief summary of what the endpoint does
 *     tags: [Category]
 *     description: Detailed description of the endpoint functionality
 *     security:
 *       - bearerAuth: []     # Include this if the endpoint requires authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - requiredField1
 *               - requiredField2
 *             properties:
 *               requiredField1:
 *                 type: string
 *                 description: Description of this field
 *               requiredField2:
 *                 type: number
 *                 description: Description of this field
 *               optionalField:
 *                 type: boolean
 *                 description: Description of this optional field
 *     responses:
 *       200:
 *         description: Success response description
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   description: Response data
 *       400:
 *         description: Bad request - validation error
 *       401:
 *         description: Unauthorized - authentication required
 *       500:
 *         description: Server error
 */
router.post('/new-endpoint', authenticateJWT, async (req, res) => {
  // Implementation...
});
```

## Step 3: Document New Models or Schemas (if needed)

If your endpoint uses new data models, document them in the appropriate model file:

```javascript
/**
 * @swagger
 * components:
 *   schemas:
 *     NewModel:
 *       type: object
 *       required:
 *         - field1
 *         - field2
 *       properties:
 *         field1:
 *           type: string
 *           description: Description of field1
 *         field2:
 *           type: number
 *           description: Description of field2
 */
const newModelSchema = new mongoose.Schema({
  field1: {
    type: String,
    required: true
  },
  field2: {
    type: Number,
    required: true
  }
});
```

## Step 4: Common Swagger Data Types

Here are some common data types you can use in your Swagger documentation:

- `string` - For text data
- `number` - For numerical data (both integers and floats)
- `integer` - For whole numbers
- `boolean` - For true/false values
- `array` - For lists of items
- `object` - For complex objects with properties

## Step 5: Format Specifiers

You can use format specifiers for certain types:

- `string` formats: `email`, `password`, `date-time`, `date`, `uuid`
- `number` formats: `float`, `double`
- `integer` formats: `int32`, `int64`

Example:
```javascript
email:
  type: string
  format: email
```

## Step 6: Testing Your Swagger Documentation

After adding your documentation:

1. Restart the server
2. Navigate to `http://localhost:3002/api-docs` in your browser
3. Verify that your new endpoint appears in the Swagger UI
4. Test the endpoint using the "Try it out" feature

## Step 7: Organizing with Tags

Use tags to organize your endpoints by category:

```javascript
/**
 * @swagger
 * /api/path/new-endpoint:
 *   post:
 *     tags: [YourCategory]
 *     // rest of documentation
 */
```

The available tags in our system are:
- Universities
- Students
- Certificates
- Verification
- Health

## Best Practices

1. **Be thorough**: Document all parameters, request bodies, and responses
2. **Use references**: Use `$ref` to reference existing schemas where appropriate
3. **Security**: Always specify security requirements for protected endpoints
4. **Group logically**: Use appropriate tags to group related endpoints
5. **Examples**: Provide example values where helpful
