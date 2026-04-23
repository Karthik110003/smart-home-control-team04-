# Team Member Management System - API Documentation

## Base URL
```
http://localhost:5000/api/members
```

## API Endpoints

### 1. Get All Members
**Endpoint:** `GET /members`

**Description:** Fetch all team members from the database

**Request:**
```bash
curl http://localhost:5000/api/members
```

**Response (Success - 200):**
```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "_id": "60c72b2f5f1b2c001f5c8a1a",
      "name": "John Doe",
      "role": "Software Engineer",
      "email": "john@example.com",
      "phone": "9876543210",
      "department": "Engineering",
      "image": "1622043445000-123456789.jpg",
      "bio": "Full stack developer with 5 years of experience",
      "joinDate": "2024-01-15T00:00:00.000Z",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    },
    ...
  ]
}
```

**Test in Browser:**
```javascript
// Open browser console (F12) and paste:
fetch('http://localhost:5000/api/members')
  .then(res => res.json())
  .then(data => console.log(data));
```

---

### 2. Get Single Member by ID
**Endpoint:** `GET /members/:id`

**Description:** Fetch details of a specific team member

**Parameters:**
- `:id` (string) - MongoDB ID of the member

**Request:**
```bash
curl http://localhost:5000/api/members/60c72b2f5f1b2c001f5c8a1a
```

**Response (Success - 200):**
```json
{
  "success": true,
  "data": {
    "_id": "60c72b2f5f1b2c001f5c8a1a",
    "name": "John Doe",
    "role": "Software Engineer",
    "email": "john@example.com",
    "phone": "9876543210",
    "department": "Engineering",
    "image": "1622043445000-123456789.jpg",
    "bio": "Full stack developer with 5 years of experience",
    "joinDate": "2024-01-15T00:00:00.000Z",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Response (Not Found - 404):**
```json
{
  "success": false,
  "error": "Member not found"
}
```

**Test in Browser:**
```javascript
// Replace with actual member ID
fetch('http://localhost:5000/api/members/60c72b2f5f1b2c001f5c8a1a')
  .then(res => res.json())
  .then(data => console.log(data));
```

---

### 3. Create New Member (with Image Upload)
**Endpoint:** `POST /members`

**Description:** Add a new team member with optional image upload

**Content-Type:** `multipart/form-data`

**Request Body:**
```
- name (string, required) - Full name of the member
- role (string, required) - Job role (e.g., Software Engineer)
- email (string, required) - Email address
- phone (string, optional) - Phone number
- department (string, optional) - Department name
- bio (string, optional) - Member biography
- joinDate (date, optional) - Date member joined
- image (file, optional) - Profile photo (JPEG, PNG, GIF, WebP - Max 5MB)
```

**Request (cURL with image):**
```bash
curl -X POST http://localhost:5000/api/members \
  -F "name=John Doe" \
  -F "role=Software Engineer" \
  -F "email=john@example.com" \
  -F "phone=9876543210" \
  -F "department=Engineering" \
  -F "bio=Full stack developer with 5 years of experience" \
  -F "joinDate=2024-01-15" \
  -F "image=@/path/to/photo.jpg"
```

**Response (Success - 201):**
```json
{
  "success": true,
  "message": "Member added successfully",
  "data": {
    "_id": "60c72b2f5f1b2c001f5c8a1a",
    "name": "John Doe",
    "role": "Software Engineer",
    "email": "john@example.com",
    "phone": "9876543210",
    "department": "Engineering",
    "image": "1622043445000-123456789.jpg",
    "bio": "Full stack developer with 5 years of experience",
    "joinDate": "2024-01-15T00:00:00.000Z",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Response (Validation Error - 400):**
```json
{
  "success": false,
  "error": "Please provide name, role, and email"
}
```

**Response (Duplicate Email - 400):**
```json
{
  "success": false,
  "error": "A member with this email already exists"
}
```

**Test in Browser:**
```javascript
// Using FormData for file upload
const formData = new FormData();
formData.append('name', 'Jane Smith');
formData.append('role', 'Product Manager');
formData.append('email', 'jane@example.com');
formData.append('phone', '9876543211');
formData.append('department', 'Product');
formData.append('bio', 'Experienced product manager');
formData.append('joinDate', '2024-01-15');

// For image: select file from input first
// const imageInput = document.getElementById('imageInput');
// formData.append('image', imageInput.files[0]);

fetch('http://localhost:5000/api/members', {
  method: 'POST',
  body: formData
})
  .then(res => res.json())
  .then(data => console.log(data));
```

---

### 4. Update Member (with Optional Image)
**Endpoint:** `PUT /members/:id`

**Description:** Update a team member's information and optionally change their image

**Parameters:**
- `:id` (string) - MongoDB ID of the member

**Request Body:** (Same as POST, all fields optional except id)

**Request (cURL):**
```bash
curl -X PUT http://localhost:5000/api/members/60c72b2f5f1b2c001f5c8a1a \
  -F "name=John Doe Updated" \
  -F "role=Senior Software Engineer" \
  -F "department=Engineering Lead" \
  -F "image=@/path/to/new_photo.jpg"
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Member updated successfully",
  "data": {
    "_id": "60c72b2f5f1b2c001f5c8a1a",
    "name": "John Doe Updated",
    "role": "Senior Software Engineer",
    "email": "john@example.com",
    "phone": "9876543210",
    "department": "Engineering Lead",
    "image": "1622043445001-987654321.jpg",
    "bio": "Full stack developer with 5 years of experience",
    "joinDate": "2024-01-15T00:00:00.000Z",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T11:45:00.000Z"
  }
}
```

**Test in Browser:**
```javascript
const formData = new FormData();
formData.append('role', 'Senior Software Engineer');
formData.append('department', 'Engineering Lead');

fetch('http://localhost:5000/api/members/60c72b2f5f1b2c001f5c8a1a', {
  method: 'PUT',
  body: formData
})
  .then(res => res.json())
  .then(data => console.log(data));
```

---

### 5. Delete Member
**Endpoint:** `DELETE /members/:id`

**Description:** Delete a team member and their profile image

**Parameters:**
- `:id` (string) - MongoDB ID of the member

**Request:**
```bash
curl -X DELETE http://localhost:5000/api/members/60c72b2f5f1b2c001f5c8a1a
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Member deleted successfully",
  "data": {
    "_id": "60c72b2f5f1b2c001f5c8a1a",
    "name": "John Doe",
    "role": "Software Engineer",
    "email": "john@example.com",
    ...
  }
}
```

**Response (Not Found - 404):**
```json
{
  "success": false,
  "error": "Member not found"
}
```

**Test in Browser:**
```javascript
fetch('http://localhost:5000/api/members/60c72b2f5f1b2c001f5c8a1a', {
  method: 'DELETE'
})
  .then(res => res.json())
  .then(data => console.log(data));
```

---

## Image Handling

### Image Storage
- **Location:** `backend/uploads/` directory
- **File Format:** Saved with unique timestamp + random ID + original extension
- **Example:** `1622043445000-123456789.jpg`

### Image Access
- **URL:** `http://localhost:5000/uploads/{filename}`
- **Example:** `http://localhost:5000/uploads/1622043445000-123456789.jpg`

### Image Validation
- **Allowed Types:** JPEG, PNG, GIF, WebP
- **Max Size:** 5MB
- **Deletion:** Old images are automatically deleted when updated or member is deleted

---

## Error Responses

### Validation Error
```json
{
  "success": false,
  "error": "Please provide name, role, and email"
}
```

### Duplicate Email Error
```json
{
  "success": false,
  "error": "A member with this email already exists"
}
```

### Server Error
```json
{
  "success": false,
  "error": "Failed to create member",
  "message": "Detailed error message"
}
```

---

## Testing APIs in Browser Console

### 1. Fetch All Members
```javascript
fetch('http://localhost:5000/api/members')
  .then(res => res.json())
  .then(data => {
    console.log('All Members:', data);
    console.log('Total Count:', data.count);
  });
```

### 2. Fetch Single Member
```javascript
fetch('http://localhost:5000/api/members/YOUR_MEMBER_ID')
  .then(res => res.json())
  .then(data => console.log('Member Details:', data.data));
```

### 3. Add New Member (with Image)
```javascript
const addMember = async () => {
  const formData = new FormData();
  formData.append('name', 'Alice Johnson');
  formData.append('role', 'UI/UX Designer');
  formData.append('email', 'alice@example.com');
  formData.append('phone', '9876543212');
  formData.append('department', 'Design');
  formData.append('bio', 'Creative designer with 3 years experience');
  formData.append('joinDate', '2024-01-15');

  const response = await fetch('http://localhost:5000/api/members', {
    method: 'POST',
    body: formData
  });
  const data = await response.json();
  console.log('New Member Added:', data);
  return data.data._id; // Get the ID for next operations
};

addMember();
```

### 4. Update Member
```javascript
const updateMember = async (memberId) => {
  const formData = new FormData();
  formData.append('role', 'Senior UI/UX Designer');
  formData.append('department', 'Design Lead');

  const response = await fetch(`http://localhost:5000/api/members/${memberId}`, {
    method: 'PUT',
    body: formData
  });
  const data = await response.json();
  console.log('Member Updated:', data);
};

updateMember('YOUR_MEMBER_ID');
```

### 5. Delete Member
```javascript
const deleteMember = async (memberId) => {
  const response = await fetch(`http://localhost:5000/api/members/${memberId}`, {
    method: 'DELETE'
  });
  const data = await response.json();
  console.log('Member Deleted:', data);
};

deleteMember('YOUR_MEMBER_ID');
```

---

## Frontend Integration

The frontend uses the `memberService` from `services/api.js`:

```javascript
import { memberService } from './services/api';

// Get all members
memberService.getAllMembers();

// Get single member
memberService.getMemberById(id);

// Add member
memberService.addMember(formData); // FormData object

// Update member
memberService.updateMember(id, formData); // FormData object

// Delete member
memberService.deleteMember(id);
```

---

## Notes

1. **Image Upload:** Only works with multipart/form-data content type
2. **File Size Limit:** 5MB per image
3. **Allowed Formats:** JPEG, PNG, GIF, WebP
4. **Email Uniqueness:** Each email must be unique in the database
5. **Automatic Cleanup:** Old images are deleted when overwritten or member is deleted
6. **Timestamps:** All dates are stored in ISO 8601 format

