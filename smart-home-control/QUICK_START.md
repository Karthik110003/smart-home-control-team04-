# Team Member Management System - Quick Start Guide

## 🚀 Quick Start

### Step 1: Start MongoDB
```bash
# If using MongoDB locally, start the service
mongod
# Or if using MongoDB Atlas, ensure connection string is set
```

### Step 2: Start Backend Server
```bash
cd smart-home-control/backend
npm install  # First time only
npm start
```
✅ Server running on: `http://localhost:5000`

### Step 3: Start Frontend (New Terminal)
```bash
cd smart-home-control/frontend
npm install  # First time only
npm start
```
✅ App opening on: `http://localhost:3000`

---

## 📸 What You Can Do

### 1. **Landing Page** (http://localhost:3000/)
- 👋 Welcome message
- 📚 Features overview
- ➕ "Add Member" button
- 👥 "View Members" button

### 2. **Add Member** (http://localhost:3000/add-member)
- 📝 Fill member details:
  - Full Name (required)
  - Email (required, must be unique)
  - Role (required)
  - Phone (optional)
  - Department (optional)
  - Bio (optional)
  - Join Date (optional)
- 📷 Upload professional photo
- ✅ Submit

### 3. **View Members** (http://localhost:3000/members)
- 👥 See all team members in grid
- 🔍 Search by name/email/role
- 🎯 Filter by role
- 👁️ View Details button for each member
- 🗑️ Delete member

### 4. **Member Details** (http://localhost:3000/member/:id)
- 📸 Full profile photo
- 📋 Complete information
- 📧 Email (clickable mailto)
- 📱 Phone (clickable tel)
- 📝 Bio and description
- ← Back to Members list

---

## 🛠️ API Testing in Browser

Open browser console (F12) and try these commands:

### Get All Members
```javascript
fetch('http://localhost:5000/api/members')
  .then(res => res.json())
  .then(data => console.log(data));
```

### Add a Member
```javascript
const form = new FormData();
form.append('name', 'John Doe');
form.append('role', 'Software Engineer');
form.append('email', 'john@example.com');
form.append('phone', '9876543210');
form.append('department', 'Engineering');
form.append('bio', 'Experienced developer');
form.append('joinDate', '2024-01-15');

fetch('http://localhost:5000/api/members', {
  method: 'POST',
  body: form
})
  .then(res => res.json())
  .then(data => console.log('Member created:', data));
```

### Get Single Member (Replace ID with real member ID)
```javascript
fetch('http://localhost:5000/api/members/{MEMBER_ID}')
  .then(res => res.json())
  .then(data => console.log(data));
```

### Update Member
```javascript
const form = new FormData();
form.append('role', 'Senior Engineer');
form.append('department', 'Engineering Lead');

fetch('http://localhost:5000/api/members/{MEMBER_ID}', {
  method: 'PUT',
  body: form
})
  .then(res => res.json())
  .then(data => console.log('Updated:', data));
```

### Delete Member
```javascript
fetch('http://localhost:5000/api/members/{MEMBER_ID}', {
  method: 'DELETE'
})
  .then(res => res.json())
  .then(data => console.log('Deleted:', data));
```

---

## 📁 Project Structure

```
smart-home-control/
├── backend/
│   ├── models/Member.js          # Member database model
│   ├── routes/members.js         # API routes with image upload
│   ├── uploads/                  # Uploaded images stored here
│   └── server.js                 # Express server
│
├── frontend/
│   ├── src/pages/
│   │   ├── Home.js               # Landing page
│   │   ├── AddMember.js          # Add member form
│   │   ├── Members.js            # Members list
│   │   └── MemberDetail.js       # Member details
│   ├── src/styles/               # All CSS files
│   └── src/services/api.js       # API calls
│
└── TEAM_MANAGEMENT_README.md    # Full documentation
```

---

## ✅ Checklist - What's Implemented

- ✅ Landing page with welcome and navigation
- ✅ Add member form with image upload
- ✅ View members list with search & filter
- ✅ Member details page
- ✅ Complete REST API (GET, POST, PUT, DELETE)
- ✅ MongoDB integration
- ✅ Image upload & storage
- ✅ Form validation
- ✅ Error handling
- ✅ Responsive design
- ✅ API documentation
- ✅ Browser console testing examples

---

## 🔧 Troubleshooting

| Problem | Solution |
|---------|----------|
| Backend won't start | Check MongoDB is running, port 5000 is free |
| Frontend won't start | Delete node_modules, run `npm install` again |
| Images not uploading | Check file size < 5MB, format is JPEG/PNG/GIF/WebP |
| Can't find members | Ensure backend is running, check MongoDB connection |
| CORS error | Backend CORS is enabled, check console for details |

---

## 📚 Full Documentation

See [TEAM_MANAGEMENT_README.md](./TEAM_MANAGEMENT_README.md) for:
- Complete feature descriptions
- All API endpoints with examples
- Installation instructions
- Technology stack
- Marks breakdown

See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for:
- Detailed API specifications
- Request/Response examples
- Error codes and messages
- Browser testing code samples

---

## 🎯 Key Files

| File | Purpose |
|------|---------|
| `backend/models/Member.js` | Member database schema |
| `backend/routes/members.js` | API endpoints implementation |
| `frontend/src/pages/Home.js` | Landing page |
| `frontend/src/pages/AddMember.js` | Add member form |
| `frontend/src/pages/Members.js` | Members list |
| `frontend/src/pages/MemberDetail.js` | Member details |
| `frontend/src/services/api.js` | API service layer |
| `frontend/src/App.js` | Router configuration |

---

## 💡 Tips

1. **Test APIs in browser:** Open DevTools (F12) → Console → Paste code from above
2. **Check image uploads:** Look in `backend/uploads/` directory
3. **Debug issues:** Check backend console and browser DevTools Network tab
4. **Form validation:** All required fields marked with *
5. **Image formats:** JPEG, PNG, GIF, WebP all supported (max 5MB)

---

## 🎓 Learning Resources

- Full API documentation in `API_DOCUMENTATION.md`
- Complete system guide in `TEAM_MANAGEMENT_README.md`
- Example API calls in browser console above
- Code comments in source files

---

Enjoy! 🚀

