# API Documentation - Sri Venkateswara ERP Backend

## Overview
RESTful API for the Sri Venkateswara Educational Resource Planning system with role-based access and persistent search functionality.

## Base URL
- Development: `http://localhost:4000/api`
-- Production: `https://api.srivenkateswara.edu/api`

## API Versioning
- Current Version: `v1`
- All endpoints available under `/api/v1/` (default) or `/api/` (backward compatible)

## Authentication
Currently using basic role-based auth. Future: JWT tokens (see Improvements #8)

## Endpoints

### Health Check
**GET** `/api/health` or `/api/v1/health`

Check API availability and version.

**Response (200 OK):**
```json
{
  "ok": true,
  "service": "sri-venkateswara-backend",
  "version": "1.0.0",
  "timestamp": "2026-05-07T10:30:00Z"
}
```

### Search - Get Recent Searches
**GET** `/api/v1/search/recent`

Retrieve recently searched items for a user role.

**Query Parameters:**
- `role` (required): User role (student, faculty, parent, admin)

**Response (200 OK):**
```json
{
  "items": [
    {
      "id": 1,
      "role": "student",
      "query": "Attendance Overview",
      "routePath": "/student-dashboard/attendance-overview",
      "createdAt": "2026-05-07T09:00:00Z"
    }
  ]
}
```

**Response (400 Bad Request):**
```json
{
  "error": "Role parameter is required",
  "status": 400
}
```

### Search - Save Recent Search
**POST** `/api/v1/search/recent`

Save a recent search query with route path.

**Request Body:**
```json
{
  "role": "student",
  "query": "Attendance Overview",
  "routePath": "/student-dashboard/attendance-overview"
}
```

**Response (200 OK):**
```json
{
  "ok": true,
  "message": "Search saved successfully"
}
```

**Response (400 Bad Request):**
```json
{
  "error": "Missing required fields",
  "status": 400
}
```

## Error Responses

All error responses follow this format:

```json
{
  "error": "Error message description",
  "status": <HTTP_STATUS_CODE>
}
```

### Common Status Codes
- `200 OK`: Successful request
- `400 Bad Request`: Invalid parameters or missing required fields
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server error

## Rate Limiting
Currently unlimited. Future: Implement per-role rate limits (see Improvements #9)

## CORS Policy
- Allowed Origins: Configured frontend origins
- Allowed Methods: GET, POST, OPTIONS
- Allowed Headers: Content-Type

## Data Persistence
- Search history persists for 6 most recent items per role
- Automatic cleanup of older entries
- Data stored in PostgreSQL database

## Future Enhancements
1. JWT Authentication with refresh tokens
2. Request rate limiting per role
3. Redis caching for frequently accessed data
4. Comprehensive error logging and monitoring
5. API request tracing and analytics

## Integration Examples

### JavaScript/Fetch
```javascript
// Get recent searches
const response = await fetch('/api/v1/search/recent?role=student')
const data = await response.json()

// Save search
const saveResponse = await fetch('/api/v1/search/recent', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    role: 'student',
    query: 'Attendance Overview',
    routePath: '/student-dashboard/attendance-overview'
  })
})
```

## Support
For API issues or questions, contact: api-support@srivenkateswara.edu
