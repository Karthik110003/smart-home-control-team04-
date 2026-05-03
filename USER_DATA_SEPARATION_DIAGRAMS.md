# User Data Separation - Visual Diagrams

## 1. Authentication & Request Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    USER DATA SEPARATION FLOW                     │
└─────────────────────────────────────────────────────────────────┘

Step 1: Registration
┌─────────┐
│  User   │
│Register │
└────┬────┘
     │ Email: user@example.com
     │ Password: pass123
     │
     ▼
┌──────────────────────────────────────┐
│   Backend Auth Route                 │
│   - Hash password                    │
│   - Generate unique userId           │
│   - Create JWT with userId           │
│   - Return token                     │
└────┬─────────────────────────────────┘
     │ Token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
     │ Includes: { id: "user-123", iat, exp }
     │
     ▼
┌──────────────────────────────────────┐
│   Client (Browser)                   │
│   localStorage.token = token         │
└──────────────────────────────────────┘

Step 2: API Request
┌──────────────────────────────────────┐
│   Client API Call                    │
│   GET /api/devices                   │
│   Headers: {                         │
│     Authorization: Bearer <token>    │
│   }                                  │
└────┬─────────────────────────────────┘
     │ Interceptor adds token automatically
     │
     ▼
┌──────────────────────────────────────┐
│   Backend Auth Middleware            │
│   - Extract token from header        │
│   - Verify JWT signature             │
│   - Decode token                     │
│   - req.userId = "user-123"          │
│   - Continue to route                │
└────┬─────────────────────────────────┘
     │ userId now available in request
     │
     ▼
┌──────────────────────────────────────┐
│   Route Handler                      │
│   const devices = await             │
│   Device.find({                      │
│     userId: req.userId ← "user-123"  │
│   })                                 │
└────┬─────────────────────────────────┘
     │ Query includes userId filter
     │
     ▼
┌──────────────────────────────────────┐
│   MongoDB Query                      │
│   db.devices.find({                  │
│     userId: "user-123"               │
│   })                                 │
│   ↓ Returns only user's devices      │
└────┬─────────────────────────────────┘
     │ Only documents with userId="user-123"
     │
     ▼
┌──────────────────────────────────────┐
│   Response to Client                 │
│   {                                  │
│     success: true,                   │
│     data: [                          │
│       {_id: 1, userId: "user-123",   │
│        device_id: "light-001", ...}  │
│     ]                                │
│   }                                  │
└──────────────────────────────────────┘
```

## 2. Data Isolation Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                    MONGODB DATABASE                               │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ╔═══════════════════════════════════════════════════════════╗  │
│  ║                    Users Collection                        ║  │
│  ║─────────────────────────────────────────────────────────  ║  │
│  ║ { userId: "user-123", email: "user1@ex.com" }            ║  │
│  ║ { userId: "user-456", email: "user2@ex.com" }            ║  │
│  ║ { userId: "user-789", email: "user3@ex.com" }            ║  │
│  ╚═══════════════════════════════════════════════════════════╝  │
│           ┌─────────────────┬──────────────┬──────────────┐      │
│           │                 │              │              │      │
│           ▼                 ▼              ▼              ▼      │
│  ╔═══════════════╗  ╔═══════════════╗  ╔════════════════╗       │
│  ║  Devices      ║  ║  Scenes       ║  ║  Automations   ║       │
│  ║───────────────║  ║───────────────║  ║────────────────║       │
│  ║userId:user-123║  ║userId:user-123║  ║userId:user-123 ║       │
│  ║  Light-001    ║  ║ Movie Night   ║  ║ Morning Alarm  ║       │
│  ║               ║  ║               ║  ║                ║       │
│  ║userId:user-456║  ║userId:user-456║  ║userId:user-456 ║       │
│  ║  Light-001 ✓  ║  ║ Movie Night ✓ ║  ║ Morning Alarm ✓║       │
│  ║ (same name!)   ║  ║(same name!)   ║  ║ (same name!)   ║       │
│  ║               ║  ║               ║  ║                ║       │
│  ║userId:user-789║  ║userId:user-789║  ║userId:user-789 ║       │
│  ║  Kitchen-AC   ║  ║ Bedtime Scene ║  ║ Evening Alarm  ║       │
│  ╚═══════════════╝  ╚═══════════════╝  ╚════════════════╝       │
│      └────────────────────┬─────────────────┘                    │
│          ┌────────────────┼────────────────┐                    │
│          │                │                │                    │
│          ▼                ▼                ▼                    │
│  ╔═══════════════╗  ╔════════════════╗  ╔═══════════╗          │
│  ║  Energy       ║  ║  Members       ║  ║  (Others) ║          │
│  ║───────────────║  ║────────────────║  ║           ║          │
│  ║userId:user-123║  ║userId:user-123 ║  ║           ║          │
│  ║ 50 kWh/day    ║  ║ John Doe       ║  ║           ║          │
│  ║               ║  ║                ║  ║           ║          │
│  ║userId:user-456║  ║userId:user-456 ║  ║           ║          │
│  ║ 45 kWh/day    ║  ║ John Doe ✓     ║  ║ (isolated)║          │
│  ║               ║  ║(same name!)    ║  ║           ║          │
│  ║userId:user-789║  ║userId:user-789 ║  ║           ║          │
│  ║ 60 kWh/day    ║  ║ Jane Smith     ║  ║           ║          │
│  ╚═══════════════╝  ╚════════════════╝  ╚═══════════╝          │
│                                                                  │
│  ✓ Each user has their own namespace                            │
│  ✓ Same names allowed for different users                       │
│  ✓ No data mixing or leakage                                    │
│  ✓ Compound unique indices: { userId: 1, name: 1 }             │
└──────────────────────────────────────────────────────────────────┘
```

## 3. Security Layers

```
┌─────────────────────────────────────────────────────────────┐
│                    5 LAYERS OF PROTECTION                    │
└─────────────────────────────────────────────────────────────┘

Layer 1: AUTHENTICATION
┌──────────────────────────────────────────────────────────┐
│  ├─ Login credentials validated                          │
│  ├─ JWT token generated with userId                      │
│  ├─ Token stored in client localStorage                  │
│  ├─ Token sent with every API request                    │
│  └─ Invalid/expired tokens → 401 Unauthorized            │
└──────────────────────────────────────────────────────────┘
                      │
                      ▼ (Token valid)
Layer 2: ROUTE-LEVEL AUTH MIDDLEWARE
┌──────────────────────────────────────────────────────────┐
│  router.get('/', auth, handler)                          │
│  ├─ @auth middleware required on all protected routes    │
│  ├─ Extracts userId from JWT token                       │
│  ├─ Sets req.userId for use in handler                   │
│  └─ No token → 401 Unauthorized                          │
└──────────────────────────────────────────────────────────┘
                      │
                      ▼ (userId extracted)
Layer 3: DATABASE QUERY FILTERING
┌──────────────────────────────────────────────────────────┐
│  Collection.find({ userId: req.userId, ... })            │
│  ├─ Every query includes userId filter                   │
│  ├─ MongoDB returns only matching documents              │
│  ├─ Returns empty array if user has no data              │
│  └─ Database enforces isolation                          │
└──────────────────────────────────────────────────────────┘
                      │
                      ▼ (Data filtered)
Layer 4: OWNERSHIP VERIFICATION (Update/Delete)
┌──────────────────────────────────────────────────────────┐
│  const resource = await Collection.findById(id)          │
│  if (resource.userId !== req.userId) return 403          │
│  ├─ Before update/delete: verify ownership               │
│  ├─ Prevents URL parameter tampering                     │
│  └─ Returns 403 Forbidden if not owner                   │
└──────────────────────────────────────────────────────────┘
                      │
                      ▼ (Ownership verified)
Layer 5: UNIQUE CONSTRAINTS
┌──────────────────────────────────────────────────────────┐
│  schema.index({ userId: 1, name: 1 }, {unique:true})     │
│  ├─ Compound indices prevent namespace collisions        │
│  ├─ Each user has isolated namespace                     │
│  ├─ Users can have same resource names                   │
│  └─ Duplicate names in same user → 400 error             │
└──────────────────────────────────────────────────────────┘

Result: COMPLETE DATA ISOLATION
        No user can access another user's data
        No data leakage possible
        Defense in depth approach
```

## 4. Request vs Response Flow

```
REQUEST FLOW (User A to Backend)
┌─────────────────────────────────────────────────────────┐
│                                                          │
│  User A Browser                                         │
│  ├─ Token: eyJhbGciOi... (contains userId: user-123)   │
│  └─ GET /api/devices                                    │
│     ├─ Header: Authorization: Bearer <token>           │
│     └─ Sent via fetch/axios                            │
│                    ▼                                     │
│  Express Server                                         │
│  ├─ Request arrives at GET /api/devices route          │
│  ├─ @auth middleware runs                              │
│  ├─ Extracts userId: "user-123"                        │
│  ├─ Sets req.userId = "user-123"                       │
│  └─ Calls route handler                                │
│                    ▼                                     │
│  Route Handler                                         │
│  ├─ const devices = await Device.find({               │
│  │   userId: req.userId  ← "user-123"                 │
│  │ })                                                   │
│  └─ Returns array of user-123's devices                │
│                    ▼                                     │
│  MongoDB Query                                         │
│  ├─ db.devices.find({                                 │
│  │   userId: "user-123"                               │
│  │ })                                                   │
│  └─ Returns matching documents                         │
│                    ▼                                     │
│  RESPONSE FLOW (Backend to User A)                     │
│                                                          │
│  Result Array (only user-123's docs)                   │
│  ├─ [{_id: 1, userId: "user-123", ...}]              │
│  ├─ [{_id: 2, userId: "user-123", ...}]              │
│  └─ [{_id: 3, userId: "user-123", ...}]              │
│                    ▼                                     │
│  JSON Response                                         │
│  └─ { success: true, data: [...] }                    │
│                    ▼                                     │
│  User A Browser                                        │
│  ├─ Receives response                                  │
│  ├─ Displays user-123's devices in Dashboard           │
│  └─ ✓ Only sees own data                               │
│                                                          │
│  User B (different token with userId: user-456)        │
│  ├─ Sends same request with their token                │
│  ├─ Backend extracts userId: "user-456"                │
│  ├─ Query: { userId: "user-456" }                      │
│  ├─ Returns DIFFERENT data (user-456's devices)        │
│  └─ ✓ Cannot see User A's data                         │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

## 5. Error Response Scenarios

```
┌─────────────────────────────────────────────────────────┐
│              ERROR RESPONSE SCENARIOS                     │
└─────────────────────────────────────────────────────────┘

Scenario 1: No Token Provided
┌─────────────────────────────┐
│ GET /api/devices            │
│ Headers: { }                │
│          (no Authorization) │
└──────────────┬──────────────┘
               │
               ▼
┌──────────────────────────────────────────┐
│ Auth Middleware Check                    │
│ → No token in header                     │
│ → Cannot extract userId                  │
│ → Reject request                         │
└──────────────┬───────────────────────────┘
               │
               ▼
┌──────────────────────────────────────────┐
│ Response: 401 Unauthorized               │
│ { error: 'No token provided' }          │
└──────────────────────────────────────────┘


Scenario 2: Invalid/Expired Token
┌─────────────────────────────┐
│ GET /api/devices            │
│ Headers: {                  │
│   Authorization:            │
│   Bearer invalid_token      │
│ }                           │
└──────────────┬──────────────┘
               │
               ▼
┌──────────────────────────────────────────┐
│ Auth Middleware Check                    │
│ → Verify JWT signature                   │
│ → Signature invalid or expired           │
│ → Reject request                         │
└──────────────┬───────────────────────────┘
               │
               ▼
┌──────────────────────────────────────────┐
│ Response: 401 Unauthorized               │
│ { error: 'Invalid or expired token' }   │
└──────────────────────────────────────────┘


Scenario 3: User Accessing Another User's Device
┌─────────────────────────────┐
│ GET /api/devices/obj123     │
│ Headers: {                  │
│   Authorization:            │
│   Bearer user-456-token     │
│ }                           │
│                             │
│ (obj123 belongs to user-123)│
└──────────────┬──────────────┘
               │
               ▼
┌──────────────────────────────────────────┐
│ Auth Middleware                          │
│ → Token valid                            │
│ → Extract userId: "user-456"             │
│ → Set req.userId = "user-456"            │
└──────────────┬───────────────────────────┘
               │
               ▼
┌──────────────────────────────────────────┐
│ Route Handler - GET /:id                 │
│ → const device = Device.findById(obj123) │
│ → device.userId = "user-123"             │
│ → req.userId = "user-456"                │
│ → Check: user-123 !== user-456?          │
│ → YES - Different user!                  │
└──────────────┬───────────────────────────┘
               │
               ▼
┌──────────────────────────────────────────┐
│ Response: 404 Not Found                  │
│ { error: 'Device not found' }           │
│                                          │
│ (Note: Returns 404 instead of 403        │
│  to avoid leaking info that device       │
│  exists but belongs to another user)    │
└──────────────────────────────────────────┘


Scenario 4: Duplicate Name Creation (Same User)
┌─────────────────────────────┐
│ POST /api/scenes            │
│ Headers: {                  │
│   Authorization: <token>    │
│ }                           │
│ Body: {                     │
│   userId: automatically set │
│   name: "Movie Night"       │
│ }                           │
│                             │
│ (User already has scene     │
│  named "Movie Night")       │
└──────────────┬──────────────┘
               │
               ▼
┌──────────────────────────────────────────┐
│ Auth Middleware                          │
│ → Extract userId: "user-123"             │
└──────────────┬───────────────────────────┘
               │
               ▼
┌──────────────────────────────────────────┐
│ Create New Scene                         │
│ → Data: {                                │
│     userId: "user-123",                  │
│     name: "Movie Night"                  │
│   }                                      │
│ → Call: Scene.save()                     │
└──────────────┬───────────────────────────┘
               │
               ▼
┌──────────────────────────────────────────┐
│ MongoDB Unique Index Check               │
│ → Index: { userId: 1, name: 1 }         │
│ → Check: ("user-123", "Movie Night")    │
│ → Already exists in collection!          │
│ → Reject with E11000 error               │
└──────────────┬───────────────────────────┘
               │
               ▼
┌──────────────────────────────────────────┐
│ Response: 400 Bad Request                │
│ { error: 'A scene with this name        │
│    already exists' }                    │
└──────────────────────────────────────────┘
```

## 6. Multi-User Isolation Example

```
┌────────────────────────────────────────────────────────────┐
│            THREE USERS, SAME DATABASE                      │
│                                                             │
│  User A         User B         User C                      │
│  user-123       user-456       user-789                    │
│  Token A        Token B        Token C                     │
└────────────────────────────────────────────────────────────┘
         │              │              │
         │              │              │
         ▼              ▼              ▼
    ┌───────────────────────────────────────┐
    │  Database (Single Collection)          │
    │                                       │
    │  Devices Collection:                  │
    │                                       │
    │  User-123's devices:                  │
    │  ├─ Living Room Light                 │
    │  ├─ Kitchen AC                        │
    │  ├─ Bedroom Fan                       │
    │  └─ (3 devices total)                 │
    │                                       │
    │  User-456's devices:                  │
    │  ├─ Living Room Light ← same name!   │
    │  ├─ Front Door Lock                   │
    │  └─ (2 devices total)                 │
    │                                       │
    │  User-789's devices:                  │
    │  ├─ Kitchen Light                     │
    │  ├─ Garage Door                       │
    │  ├─ Pool Pump                         │
    │  └─ (3 devices total)                 │
    │                                       │
    │  ✓ 8 total documents                  │
    │  ✓ 3 separate namespaces              │
    │  ✓ No collisions                      │
    │  ✓ Compound index: {userId, device_id}│
    └───────────────────────────────────────┘
         │              │              │
         │              │              │
         ▼              ▼              ▼
    Request:       Request:       Request:
    GET /devices   GET /devices   GET /devices
    Token A        Token B        Token C
         │              │              │
         │              │              │
         ▼              ▼              ▼
    Query:         Query:         Query:
    {userId:       {userId:       {userId:
    user-123}      user-456}      user-789}
         │              │              │
         │              │              │
         ▼              ▼              ▼
    Response:      Response:      Response:
    3 devices      2 devices      3 devices
    (A's only)     (B's only)     (C's only)
    
    ✓ Each user sees ONLY their data
    ✓ Database returns different results
    ✓ Same device name = no conflict
```

---

This comprehensive visual guide illustrates how user data separation works at every level of the system, from authentication through database queries.
