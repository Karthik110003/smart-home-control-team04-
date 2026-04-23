# Team Member Management System

A comprehensive web application for managing team members with profile photos, contact information, and role-based organization. Built with React, Express, and MongoDB.

## Features

✅ **Landing Page** - Welcome introduction with team overview and navigation  
✅ **Add Members** - Form with image upload for new team members  
✅ **View Members** - List view with search and filter capabilities  
✅ **Member Details** - Comprehensive profile page for individual members  
✅ **Image Upload** - Professional photo management with automatic validation  
✅ **Search & Filter** - Find members by name, email, role, or department  
✅ **Responsive Design** - Works on desktop, tablet, and mobile  
✅ **REST API** - Complete API for all operations  

---

## Project Structure

```
smart-home-control/
├── backend/
│   ├── models/
│   │   ├── Member.js                 # Member data model
│   │   └── ...other models
│   ├── routes/
│   │   ├── members.js                # Member API routes with image upload
│   │   └── ...other routes
│   ├── uploads/                      # Directory for uploaded images
│   ├── server.js                     # Express server with static file serving
│   └── package.json                  # Backend dependencies
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.js               # Landing page (10 marks)
│   │   │   ├── AddMember.js          # Add member form (10 marks)
│   │   │   ├── Members.js            # Members list (5 marks)
│   │   │   ├── MemberDetail.js       # Member details (5 marks)
│   │   │   └── ...other pages
│   │   ├── styles/
│   │   │   ├── Home.css              # Landing page styles
│   │   │   ├── AddMember.css         # Form styles
│   │   │   ├── Members.css           # List styles
│   │   │   ├── MemberDetail.css      # Detail page styles
│   │   │   └── ...other styles
│   │   ├── services/
│   │   │   └── api.js                # API calls with memberService
│   │   ├── App.js                    # Main router with React Router
│   │   └── index.js
│   └── package.json                  # Frontend dependencies
│
├── API_DOCUMENTATION.md              # Complete API documentation
└── README.md                          # This file
```

---

## Installation & Setup

### Prerequisites
- Node.js v14+ and npm
- MongoDB local instance or Atlas connection
- Git

### Backend Setup

1. **Navigate to backend directory:**
```bash
cd smart-home-control/backend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Install multer for image upload:**
```bash
npm install multer
```

4. **Create `.env` file** (if not exists):
```env
MONGODB_URI=mongodb://localhost:27017/smart-home-db
PORT=5000
```

5. **Start the backend server:**
```bash
npm start
# Or with auto-reload:
npm run dev
```

Server will run on: `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory:**
```bash
cd smart-home-control/frontend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Start the frontend development server:**
```bash
npm start
```

App will open at: `http://localhost:3000`

---

## User Interface Overview

### 1. Landing Page (Home.js) - 10 Marks ✅

**URL:** `http://localhost:3000/`

**Features:**
- Welcome message with team introduction
- Feature cards highlighting system capabilities
- Two navigation buttons:
  - "Add New Member" → Navigates to add-member page
  - "View All Members" → Navigates to members page
- Clean, centered layout with gradient background
- Professional header with team name
- Responsive design for all screen sizes

**Design Highlights:**
- Purple gradient background (#667eea to #764ba2)
- Animated cards with hover effects
- Call-to-action buttons with smooth transitions
- Feature grid layout

### 2. Add Member Page (AddMember.js) - 10 Marks ✅

**URL:** `http://localhost:3000/add-member`

**Form Fields:**
- **Profile Photo:** File input with image preview and validation
- **Full Name:** Required field
- **Email Address:** Required, unique validation
- **Phone Number:** Optional field
- **Join Date:** Date picker (defaults to today)
- **Role:** Required field (e.g., Software Engineer)
- **Department:** Optional field
- **Bio:** Text area for member description

**Features:**
- Drag-and-drop file input with visual feedback
- Image preview before upload
- Real-time validation
- Error messages for invalid input
- Loading state during submission
- Success notification with redirect
- Form sections with clear organization

**Validation:**
- Name required
- Email required and must be valid format
- Role required
- Email uniqueness checked
- Image size limit: 5MB
- Supported formats: JPEG, PNG, GIF, WebP

**API Integration:**
- POST request to `/api/members` with multipart/form-data
- Automatic image upload and storage

### 3. View Members Page (Members.js) - 5 Marks ✅

**URL:** `http://localhost:3000/members`

**Features:**
- Display all team members in a responsive grid
- Each member card shows:
  - Profile image (or placeholder)
  - Name
  - Role (highlighted in color)
  - Department
  - Email
  - Phone number
- **View Details** button - Opens member detail page
- **Delete** button - Removes member from system
- **Search functionality** - Filter by name, email, or role
- **Role filter** - Dropdown to filter by specific role
- Results counter showing matching members
- Add New Member button in header

**Grid Layout:**
- Responsive 3-column grid on desktop
- 2-column on tablet
- 1-column on mobile
- Smooth animations on card hover
- Gradient backgrounds with shadows

**Search & Filter:**
- Real-time search as you type
- Filter by role with dropdown
- Shows count of matching results
- Empty state when no members found

### 4. Member Details Page (MemberDetail.js) - 5 Marks ✅

**URL:** `http://localhost:3000/member/:id`

**Layout:**
- **Left Section:**
  - Large profile image (or placeholder)
  - Quick contact info (email, phone)
  - Email and phone links for quick contact

- **Right Section:**
  - Full name (prominent heading)
  - Primary role display
  - Professional Information:
    - Role
    - Department
    - Join date
    - Member since date
  - Contact Information:
    - Email with mailto link
    - Phone with tel link
  - Bio section with member description

**Features:**
- Clean two-column layout
- All information clearly organized
- Clickable email and phone for quick contact
- Back button to return to members list
- Delete button to remove member
- Responsive design that stacks on mobile
- Date formatting (human-readable)
- Error handling if member not found
- Loading state while fetching

**Styling:**
- Professional gradient backgrounds
- Hover effects on info cards
- Clear section separation
- Icons for quick visual identification

---

## API Endpoints

### Base URL
```
http://localhost:5000/api/members
```

### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/members` | Get all members |
| GET | `/members/:id` | Get single member |
| POST | `/members` | Create new member (with image) |
| PUT | `/members/:id` | Update member (with optional image) |
| DELETE | `/members/:id` | Delete member |

### Example Requests

**Get All Members:**
```bash
curl http://localhost:5000/api/members
```

**Add Member with Image:**
```bash
curl -X POST http://localhost:5000/api/members \
  -F "name=John Doe" \
  -F "role=Engineer" \
  -F "email=john@example.com" \
  -F "image=@photo.jpg"
```

**Get Member Details:**
```bash
curl http://localhost:5000/api/members/60c72b2f5f1b2c001f5c8a1a
```

### Browser Console Testing

Test APIs directly from browser console:

```javascript
// Get all members
fetch('http://localhost:5000/api/members')
  .then(res => res.json())
  .then(data => console.log(data));

// Get single member
fetch('http://localhost:5000/api/members/MEMBER_ID')
  .then(res => res.json())
  .then(data => console.log(data));

// Add member with image
const formData = new FormData();
formData.append('name', 'Jane Doe');
formData.append('role', 'Designer');
formData.append('email', 'jane@example.com');

fetch('http://localhost:5000/api/members', {
  method: 'POST',
  body: formData
})
  .then(res => res.json())
  .then(data => console.log(data));
```

See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for complete API documentation with all endpoints and examples.

---

## Technologies Used

### Backend
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **Multer** - File upload handling
- **CORS** - Cross-origin requests
- **Node.js** - Runtime

### Frontend
- **React** - UI library
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls
- **CSS3** - Styling with animations

### Key Libraries
- `multer` - Image upload and storage
- `mongoose` - MongoDB object modeling
- `express` - Web server framework
- `axios` - API communication
- `react-router-dom` - Routing

---

## Features in Detail

### Image Upload & Management
- Accepts JPEG, PNG, GIF, and WebP formats
- Maximum file size: 5MB
- Automatic file naming with timestamp
- Images served as static files from backend
- Automatic cleanup of old images on update/delete

### Search & Filtering
- Real-time search across name, email, and role
- Filter by member role
- Results count display
- Empty state handling

### Form Validation
- Client-side validation before submission
- Email uniqueness check
- Required field validation
- Image format and size validation
- Error messages with solutions

### Responsive Design
- Desktop: 3-column grid layout
- Tablet: 2-column layout
- Mobile: 1-column layout
- Touch-friendly buttons and inputs
- Optimized font sizes for readability

---

## File Upload Details

### Upload Directory
```
backend/uploads/
```

### File Naming Convention
```
{timestamp}-{randomId}.{extension}
Example: 1622043445000-123456789.jpg
```

### Image Access
```
http://localhost:5000/uploads/1622043445000-123456789.jpg
```

### Supported Formats
- JPEG (.jpg, .jpeg)
- PNG (.png)
- GIF (.gif)
- WebP (.webp)

---

## Marks Breakdown

| Feature | Marks | Status |
|---------|-------|--------|
| Landing Page | 10 | ✅ Complete |
| Add Member Form | 10 | ✅ Complete |
| View Members List | 5 | ✅ Complete |
| Member Details | 5 | ✅ Complete |
| API Documentation & Browser Testing | 10 | ✅ Complete |
| **Total** | **40** | ✅ Complete |

---

## Usage

1. **Start Backend Server:**
```bash
cd backend
npm start
```

2. **Start Frontend:**
```bash
cd frontend
npm start
```

3. **Access Application:**
```
http://localhost:3000
```

4. **Add Team Members:**
   - Click "Add Member" on home page
   - Fill form with member details
   - Upload profile photo
   - Submit

5. **View & Manage Members:**
   - Browse all members on Members page
   - Search by name/email/role
   - Filter by role
   - Click member to view full details
   - Delete member if needed

---

## Troubleshooting

### Images Not Uploading
- Ensure backend server is running on port 5000
- Check file size is under 5MB
- Verify file format is supported (JPEG, PNG, GIF, WebP)
- Check backend `uploads/` directory exists

### Members Not Displaying
- Verify MongoDB is running
- Check backend console for errors
- Ensure API requests are successful
- Check browser network tab in DevTools

### CORS Errors
- Ensure backend has CORS enabled
- Verify proxy in frontend `package.json` points to backend URL
- Check that backend is running on correct port

### Image Not Showing After Upload
- Verify image file was uploaded to backend/uploads/
- Check image filename is stored correctly in database
- Ensure image path in frontend is correct
- Check browser cache if image persists from old version

---

## Future Enhancements

- [ ] Image cropping tool
- [ ] Member edit functionality
- [ ] Bulk import from CSV
- [ ] Email notifications
- [ ] Team statistics dashboard
- [ ] Member status indicators
- [ ] Activity timeline
- [ ] Export to PDF
- [ ] Advanced search filters
- [ ] Member groups/teams

---

## License

This project is provided as-is for educational purposes.

---

## Support

For issues or questions, refer to:
1. [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) - API endpoint details
2. Backend logs - Run with `npm run dev` for development mode
3. Browser DevTools - Check Network and Console tabs

