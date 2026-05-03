# User Data Separation - Testing Guide

## Quick Verification Checklist

- ✅ User A logs in
- ✅ User A creates device/scene/automation/member
- ✅ User B logs in
- ✅ User B cannot see User A's data
- ✅ User A cannot modify User B's data

## Testing Steps

### Step 1: Start the Application

```bash
# Terminal 1 - Backend
cd backend
npm start
# Should start at http://localhost:5000

# Terminal 2 - Frontend
cd frontend
npm start
# Should start at http://localhost:3000
```

### Step 2: Test Multiple User Scenarios

#### Scenario A: Register Two Users

```
User 1:
  Email: user1@example.com
  Password: User1@123
  
User 2:
  Email: user2@example.com
  Password: User2@123
```

#### Scenario B: Add Data as User 1

1. Login as User 1
2. Dashboard → Add Device
   - Create "Living Room Light"
3. Scenes → Create Scene
   - Create "Movie Night"
4. Automations → Create Automation
   - Create "Morning Alarm"
5. Team Management → Add Member
   - Create "John Doe"

#### Scenario C: Verify User 1 Sees Their Data

```
User 1 Dashboard shows:
  ✓ "Living Room Light" (their device)
  ✓ "Movie Night" (their scene)
  ✓ "Morning Alarm" (their automation)
  ✓ "John Doe" (their member)
```

#### Scenario D: Switch to User 2 and Verify Isolation

1. Logout User 1
2. Login as User 2
3. Check Dashboard
   ```
   ✓ NO "Living Room Light" - Device not visible
   ✓ NO "Movie Night" - Scene not visible
   ✓ NO "Morning Alarm" - Automation not visible
   ✓ NO "John Doe" - Member not visible
   ```

### Step 3: Test CRUD Operations

#### Test: CREATE (User 2 creates own data)

User 2 Dashboard:
- Add Device "Kitchen Light" → ✓ Saved
- Create Scene "Morning Mode" → ✓ Saved
- Add Member "Jane Smith" → ✓ Saved

#### Test: READ (Each user sees only their own)

```
User 1 views Dashboard:
  Devices: "Living Room Light" only
  Scenes: "Movie Night" only
  Members: "John Doe" only

User 2 views Dashboard:
  Devices: "Kitchen Light" only
  Scenes: "Morning Mode" only
  Members: "Jane Smith" only
```

#### Test: UPDATE (User cannot update other user's data)

1. User 1 logs in
2. Copy a device ID from User 2's data (if you could see it)
3. Try to update that device via browser console:
   ```javascript
   await fetch('/api/devices/{USER_2_DEVICE_ID}', {
     method: 'PUT',
     headers: {
       'Authorization': `Bearer ${localStorage.getItem('token')}`,
       'Content-Type': 'application/json'
     },
     body: JSON.stringify({ status: true })
   })
   // Response: 404 Not Found (because User 1 doesn't own this device)
   ```

#### Test: DELETE (User cannot delete other user's data)

Similar to UPDATE - returns 404 (not 403) to avoid leaking ownership info

### Step 4: Browser Console Testing

#### Get current user's token
```javascript
token = localStorage.getItem('token');
console.log('Token:', token);
```

#### Get all devices for current user
```javascript
fetch('/api/devices', {
  headers: { 'Authorization': `Bearer ${token}` }
}).then(r => r.json()).then(d => console.log(d))
```

#### Get all members for current user
```javascript
fetch('/api/members', {
  headers: { 'Authorization': `Bearer ${token}` }
}).then(r => r.json()).then(d => console.log(d))
```

#### Try to access device without token (should fail)
```javascript
fetch('/api/devices', {
  headers: { 'Content-Type': 'application/json' }
}).then(r => r.json()).then(d => console.log(d))
// Response: 401 Unauthorized
```

### Step 5: API Testing with cURL

#### Create device as User 1
```bash
curl -X POST http://localhost:5000/api/devices \
  -H "Authorization: Bearer {TOKEN_USER_1}" \
  -H "Content-Type: application/json" \
  -d '{"device_id":"lamp-001","device_type":"light","room_location":"Living Room"}'
```

#### Get all devices as User 1
```bash
curl http://localhost:5000/api/devices \
  -H "Authorization: Bearer {TOKEN_USER_1}"
# Returns only User 1's devices
```

#### Get all devices as User 2
```bash
curl http://localhost:5000/api/devices \
  -H "Authorization: Bearer {TOKEN_USER_2}"
# Returns only User 2's devices (different from User 1)
```

### Step 6: Database Verification

#### Connect to MongoDB and verify data isolation

```bash
# Using mongo shell or MongoDB Compass
use smart-home-db

# Check Device collection
db.devices.find({}, { userId: 1, device_id: 1, label: 1 })
# Output should show userId field on every document

# Check scenes created by different users
db.scenes.find({}, { userId: 1, name: 1 })
# Example output:
# { _id: 1, userId: "user-123", name: "Movie Night" }
# { _id: 2, userId: "user-456", name: "Movie Night" }  ← Same name, different user!

# Check members isolation
db.members.find({}, { userId: 1, name: 1, rollNumber: 1 })
# Same member name can exist for different users
```

## Expected Results

### ✅ Data Isolation Working Correctly

- [x] User A sees only User A's devices
- [x] User B sees only User B's devices
- [x] User A cannot create device with User B's ID
- [x] User A cannot update User B's device
- [x] User A cannot delete User B's device
- [x] Each user can have scenes/members with same names
- [x] Database shows userId field on all collections

### ❌ Data Isolation Broken (if any of these occur)

- [ ] User A sees User B's devices
- [ ] User A can modify User B's data
- [ ] User A can delete User B's data
- [ ] No userId field in database
- [ ] Users sharing data inappropriately

## Detailed Test Cases

### Test Case 1: Member Access Control

```
Given: User A is logged in with token_A
When: User A creates member "John Doe"
Then: Device.userId = "user-123"

Given: User B is logged in with token_B
When: User B fetches GET /api/members
Then: User B's members list does NOT include "John Doe"

Given: User B obtains User A's member ID (id = 507f1f77bcf86cd799439011)
When: User B tries GET /api/members/507f1f77bcf86cd799439011
Then: Response = 403 Unauthorized
```

### Test Case 2: Device Name Duplication

```
Given: User A and User B
When: User A creates Device "Living Room Light"
And: User B creates Device "Living Room Light"
Then: Both succeed (different userId namespaces)

Database shows:
  { _id: 1, userId: "user-123", device_id: "lr-light-001" }
  { _id: 2, userId: "user-456", device_id: "lr-light-001" }
  ↑ Same device_id allowed because different userId!
```

### Test Case 3: Token Invalidation

```
Given: User A has token_A
When: User A logs out and localStorage.clear()
Then: Token removed from localStorage

When: User A tries API call without token
Then: Response = 401 Unauthorized
```

### Test Case 4: Token Expiration

```
Given: JWT tokens expire after 30 days
When: 30 days pass
Then: Request with old token = 401 Unauthorized
And: User must login again to get new token
```

## Common Issues and Solutions

### Issue 1: "Permission Denied" on all requests

**Symptom**: All API requests return 403
**Cause**: Token not being sent or auth header incorrect
**Solution**:
```javascript
// Check 1: Token exists
console.log(localStorage.getItem('token'));

// Check 2: Auth header format
// Should be: "Bearer <token>"
// NOT: "Token <token>" or no header
```

### Issue 2: Users seeing each other's data

**Symptom**: User A sees User B's devices on dashboard
**Cause**: userId filter not applied in route
**Solution**:
```javascript
// Check route has:
router.get('/', auth, async (req, res) => {
  const devices = await Device.find({ userId: req.userId });
  // ↑ Must include userId filter
});
```

### Issue 3: Cannot create duplicate names

**Symptom**: User B cannot create Scene "Movie Night" even though User A has it
**Cause**: Unique index not compound
**Solution**:
```javascript
// Model must have:
sceneSchema.index({ userId: 1, name: 1 }, { unique: true });
// NOT: sceneSchema.index({ name: 1 }, { unique: true });
```

### Issue 4: Old data has no userId

**Symptom**: Some documents have userId, others don't
**Cause**: Migrating from old schema
**Solution**: Clear MongoDB and reseed, or run migration script

## Verification Checklist

### Frontend
- [ ] Login page works
- [ ] Token saved to localStorage
- [ ] API interceptor adds Bearer token
- [ ] Logout clears localStorage
- [ ] User-specific data displayed per user

### Backend
- [ ] Auth middleware extracts userId from token
- [ ] All protected routes have `auth` middleware
- [ ] All queries include `{ userId: req.userId }`
- [ ] Update/delete verify ownership
- [ ] Returns appropriate error codes (401, 403, 404)

### Database
- [ ] All documents have userId field
- [ ] Compound indices on name fields
- [ ] No cross-user data visible
- [ ] Separate namespaces for each user

## Performance Testing

### Check response times with multiple users

```javascript
// Measure device fetch time
console.time('fetch-devices');
await fetch('/api/devices', {
  headers: { 'Authorization': `Bearer ${token}` }
});
console.timeEnd('fetch-devices');

// Expected: < 100ms for < 1000 devices
```

### Index verification

```bash
# In MongoDB
db.devices.getIndexes()
# Should show: { userId: 1, device_id: 1 }

db.scenes.getIndexes()
# Should show: { userId: 1, name: 1 }
```

## Sign-Off

When all tests pass, user data separation is complete and secure:

- [x] Each user has separate account
- [x] Each user sees only their own data
- [x] No data shared between users
- [x] Data stored in same collection with userId linking
- [x] All CRUD operations respect ownership
- [x] Database, backend, and frontend all secure
