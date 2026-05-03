# User Data Separation - Complete Implementation Guide

## Overview

This document describes the complete user data separation implementation for the Smart Home Control application. Each user has complete data isolation - users can only see and modify their own data.

## Architecture

### Data Model

```
┌─────────────────────────────────────────┐
│          User (Authenticated)           │
│  ├─ userId (unique, from JWT token)     │
│  ├─ name, email, password               │
│  └─ createdAt                           │
└──────────────┬──────────────────────────┘
               │
         ┌─────┴──────────────────────────────────────────┐
         │                                                │
    ┌────▼────────┐   ┌──────────────┐   ┌──────────┐
    │  Devices    │   │   Scenes     │   │  Energy  │
    │  (Multiple) │   │  (Multiple)  │   │(Multiple)│
    └─────────────┘   └──────────────┘   └──────────┘
         │                   │                  │
    ┌────▼────────┐   ┌──────▼──────┐   ┌──────▼──────┐
    │ Automations │   │  Members    │   │   (others)  │
    │ (Multiple)  │   │ (Multiple)  │   │             │
    └─────────────┘   └─────────────┘   └─────────────┘
         │                   │                  │
    All linked via userId - only authenticated user sees their data
```

## Database Schema

### Device Collection
```javascript
{
  userId: String (required, indexed),  // Links to authenticated user
  device_id: String (required),
  device_type: enum [...],
  room_location: String,
  status: Boolean,
  ...
  
  // Compound unique index
  index: { userId: 1, device_id: 1 } unique: true
}
```

### Scene Collection
```javascript
{
  userId: String (required, indexed),  // Links to authenticated user
  name: String (required),
  icon: String,
  color: String,
  devices: [String],
  createdAt: Date,
  
  // Compound unique index
  index: { userId: 1, name: 1 } unique: true
}
```

### Automation Collection
```javascript
{
  userId: String (required, indexed),  // Links to authenticated user
  name: String (required),
  description: String,
  triggerTime: String,
  days: [String],
  actions: [String],
  active: Boolean,
  
  // Compound unique index
  index: { userId: 1, name: 1 } unique: true
}
```

### Energy Collection
```javascript
{
  userId: String (required, indexed),  // Links to authenticated user
  date: Date,
  totalUsage: Number,
  cost: Number,
  ...
}
```

### Member Collection
```javascript
{
  userId: String (required, indexed),  // Links to authenticated user
  name: String,
  rollNumber: String,
  year: String,
  degree: String,
  aboutProject: String,
  hobbies: String,
  certificate: String,
  internship: String,
  aboutAim: String,
  image: String,
  createdAt: Date,
  updatedAt: Date,
  
  // Compound unique index
  index: { userId: 1, name: 1 } unique: true, sparse: true
}
```

## Authentication Flow

### 1. User Registration/Login
```
User submits credentials
    ↓
Server validates and creates/retrieves user
    ↓
Server generates JWT token containing userId
    ↓
JWT Token = { id: userId, iat, exp }
    ↓
Client stores token in localStorage
```

### 2. API Request Flow
```
Client prepares request
    ↓
Frontend API interceptor adds: Authorization: Bearer <token>
    ↓
Backend receives request
    ↓
auth middleware extracts userId from JWT token
    ↓
req.userId = userId
    ↓
Route handler queries with { userId: req.userId, ... }
    ↓
Only matching records are returned/modified
```

## Backend Routes - Security Implementation

### Pattern: Auth Middleware + userId Filtering

```javascript
// Pattern 1: GET all user's resources
router.get('/', auth, async (req, res) => {
  const resources = await Collection.find({ userId: req.userId });
  // Returns only current user's resources
});

// Pattern 2: GET single resource with ownership check
router.get('/:id', auth, async (req, res) => {
  const resource = await Collection.findById(req.params.id);
  if (!resource || resource.userId !== req.userId) {
    return res.status(404).json({ error: 'Not found' });
  }
  // Returns only if user is owner
});

// Pattern 3: CREATE resource (auto-link to current user)
router.post('/', auth, async (req, res) => {
  const resource = new Collection({
    userId: req.userId,  // Auto-set to current user
    ...req.body
  });
  await resource.save();
  // Created resource linked to current user only
});

// Pattern 4: UPDATE with ownership verification
router.put('/:id', auth, async (req, res) => {
  const resource = await Collection.findById(req.params.id);
  if (!resource || resource.userId !== req.userId) {
    return res.status(403).json({ error: 'Unauthorized' });
  }
  // Update only if user owns resource
});

// Pattern 5: DELETE with ownership verification
router.delete('/:id', auth, async (req, res) => {
  const resource = await Collection.findById(req.params.id);
  if (!resource || resource.userId !== req.userId) {
    return res.status(403).json({ error: 'Unauthorized' });
  }
  await Collection.findByIdAndDelete(req.params.id);
  // Delete only if user owns resource
});
```

## Implemented Routes

### Devices Routes
- ✅ `GET /api/devices` - Get all devices for current user
- ✅ `POST /api/devices` - Create device (auto-linked to user)
- ✅ `PUT /api/devices/:id` - Update device (ownership verified)
- ✅ `DELETE /api/devices/:id` - Delete device (ownership verified)

### Scenes Routes
- ✅ `GET /api/scenes` - Get all scenes for current user
- ✅ `POST /api/scenes` - Create scene (auto-linked to user)
- ✅ `DELETE /api/scenes/:id` - Delete scene (ownership verified)

### Automations Routes
- ✅ `GET /api/automations` - Get all automations for current user
- ✅ `POST /api/automations` - Create automation (auto-linked to user)
- ✅ `PUT /api/automations/:id` - Update automation (ownership verified)
- ✅ `PUT /api/automations/:id/toggle` - Toggle automation (ownership verified)
- ✅ `DELETE /api/automations/:id` - Delete automation (ownership verified)

### Energy Routes
- ✅ `GET /api/energy` - Get all energy records for current user
- ✅ `POST /api/energy` - Create energy record (auto-linked to user)
- ✅ `DELETE /api/energy/:id` - Delete energy record (ownership verified)

### Members Routes (NEW - User Isolated)
- ✅ `GET /api/members` - Get all members for current user
- ✅ `GET /api/members/:id` - Get single member (ownership verified)
- ✅ `POST /api/members` - Create member (auto-linked to user)
- ✅ `PUT /api/members/:id` - Update member (ownership verified)
- ✅ `DELETE /api/members/:id` - Delete member (ownership verified)

## Error Responses

### Authentication Errors
```javascript
// No token provided
401 Unauthorized: { success: false, message: 'No token provided' }

// Invalid or expired token
401 Unauthorized: { success: false, message: 'Invalid or expired token' }
```

### Authorization Errors
```javascript
// User trying to access another user's resource
403 Forbidden: { success: false, error: 'Unauthorized: This resource does not belong to your account' }

// Duplicate name within user's namespace
400 Bad Request: { success: false, error: 'A resource with this name already exists' }

// Resource not found (for user who doesn't own it, returns 404 not 403 to avoid info leak)
404 Not Found: { success: false, error: 'Resource not found' }
```

## Frontend Integration

### API Service Setup
```javascript
// api.js
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' }
});

// Request interceptor: Automatically add token to all requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### Usage in Components
```javascript
// Components automatically get user-filtered data
const { data: devices } = await deviceService.getAllDevices();
// Returns only current user's devices

const member = await memberService.addMember(memberData);
// New member auto-linked to current user
```

## Testing Data Isolation

### Test Scenario 1: User Cannot See Other User's Devices
```
1. User A logs in → gets token_A
2. User A creates Device X
3. User A fetches /api/devices → sees Device X ✓
4. User B logs in → gets token_B
5. User B fetches /api/devices → sees Device B only, NOT Device X ✓
```

### Test Scenario 2: User Cannot Modify Other User's Resources
```
1. User A creates Automation Z (id = 123)
2. User B tries PUT /api/automations/123 with token_B
3. Response: 403 Unauthorized ✓
```

### Test Scenario 3: Unique Names Per User
```
1. User A creates Scene "Movie Night"
2. User A tries to create another Scene "Movie Night"
3. Response: 400 Duplicate error ✓
4. User B creates Scene "Movie Night" (different user)
5. Response: 201 Success ✓ (User B can have same name)
```

## Multiple Users Scenario

```
MongoDB Collections:

Device Collection:
├─ { _id: 1, userId: "user-123", name: "Living Room Light", ... }
├─ { _id: 2, userId: "user-123", name: "Bedroom Light", ... }
├─ { _id: 3, userId: "user-456", name: "Living Room Light", ... }  ← Same name, different user!
└─ { _id: 4, userId: "user-789", ... }

When User 123 requests GET /api/devices:
  Query: { userId: "user-123" }
  Returns: Devices 1, 2 only ✓

When User 456 requests GET /api/devices:
  Query: { userId: "user-456" }
  Returns: Device 3 only ✓

When User 789 requests GET /api/devices:
  Query: { userId: "user-789" }
  Returns: Device 4 only ✓
```

## Security Layers (Defense in Depth)

### Layer 1: JWT Authentication
- Token required on all protected routes
- Token includes userId
- Invalid/expired tokens rejected

### Layer 2: Route-Level Auth Middleware
- All protected routes require `auth` middleware
- Extracts userId from JWT
- Sets `req.userId` for use in route handlers

### Layer 3: Database Query Filtering
- All queries include `{ userId: req.userId, ... }`
- MongoDB returns only matching documents
- No data visible at database level

### Layer 4: Ownership Verification
- Before update/delete, verify: `resource.userId === req.userId`
- Prevents tampering with URL parameters
- Returns 404/403 appropriately

### Layer 5: Unique Constraints
- Compound indices: `{ userId: 1, name: 1 }`
- Prevents namespace collision between users
- Each user has isolated namespace

## Implementation Checklist

- ✅ All models have `userId` field (required, indexed)
- ✅ All models with names have compound unique index `(userId, name)`
- ✅ All routes have `auth` middleware
- ✅ All GET queries filter by `userId`
- ✅ All POST operations set `userId: req.userId`
- ✅ All PUT/DELETE verify ownership before operation
- ✅ Frontend API interceptor sends token on all requests
- ✅ Appropriate error codes: 401 (auth), 403 (authorization), 404 (not found)
- ✅ No cross-user data leakage possible

## Migration Notes

### For Existing Data
If you have existing data without userId:

1. Users won't see their old data
2. Solution: Backfill userId for existing records
3. Or: Clear database and re-seed with new schema

### Adding New Endpoints
When adding new routes:
1. Always require `auth` middleware
2. Always add `userId` field to model
3. Always filter queries by `userId: req.userId`
4. Always verify ownership before update/delete
5. Follow established patterns from existing routes

## Troubleshooting

### Problem: 401 Unauthorized on all requests
**Solution**: Check if token is in localStorage, auth middleware is applied

### Problem: Users seeing each other's data
**Solution**: Verify `userId` filtering in all queries

### Problem: Cannot create duplicate names as different users
**Solution**: Ensure compound unique index is sparse: `{ sparse: true }`

### Problem: User can modify another user's resource
**Solution**: Ensure ownership check: `resource.userId !== req.userId`

## References

- Auth Middleware: [backend/middleware/auth.js](backend/middleware/auth.js)
- Device Model: [backend/models/Device.js](backend/models/Device.js)
- Device Routes: [backend/routes/devices.js](backend/routes/devices.js)
- Member Model: [backend/models/Member.js](backend/models/Member.js)
- Member Routes: [backend/routes/members.js](backend/routes/members.js)
- API Service: [frontend/src/services/api.js](frontend/src/services/api.js)

## Summary

The Smart Home Control application now implements complete user data separation:

1. **Each user has their own account** - Separate userId assigned at registration
2. **Each user sees only their own data** - All queries filtered by userId
3. **No data is shared between users** - Compound unique indices prevent conflicts
4. **Data linked to users via userId** - All collections include userId field

This ensures complete data isolation and security across all features (Devices, Scenes, Automations, Energy, Members).
