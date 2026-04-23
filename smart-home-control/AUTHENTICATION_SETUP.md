# Authentication Setup Guide

This guide explains how to set up the authentication backend for the Smart Home Control application.

## Frontend Components Created

The following components have been added to the frontend:

1. **Login Page** (`frontend/src/pages/Login.js`)
   - Email and password input fields
   - Error handling and loading states
   - Link to signup page

2. **Signup Page** (`frontend/src/pages/Signup.js`)
   - Name, email, password, and confirm password fields
   - Form validation (password length, matching passwords, valid email)
   - Link to login page

3. **Authentication Service** (`frontend/src/services/authService.js`)
   - Helper functions for login, signup, logout
   - Token management
   - User session handling

4. **Updated App Component** (`frontend/src/App.js`)
   - Authentication state management
   - Redirects to login if not authenticated
   - Passes user data to Header component

5. **Updated Header Component** (`frontend/src/widget/Header.js`)
   - Displays logged-in user's name and email
   - Logout button in dropdown menu
   - User avatar with initials

## Backend Requirements

You need to create the following endpoints in your backend (`backend/routes/auth.js`):

### 1. Signup Endpoint
**POST** `/api/auth/signup`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "jwt_token_here",
  "user": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

**Requirements:**
- Validate email format
- Validate password strength
- Check if email already exists
- Hash password before storing
- Return JWT token
- Return user object (without password)

### 2. Login Endpoint
**POST** `/api/auth/login`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "jwt_token_here",
  "user": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

**Requirements:**
- Find user by email
- Compare password with stored hash
- Return JWT token on success
- Return user object (without password)
- Handle invalid credentials gracefully

### 3. Optional: Verify Token Endpoint
**POST** `/api/auth/verify`

**Request Headers:**
```
Authorization: Bearer jwt_token_here
```

**Response:**
```json
{
  "user": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

## Backend Implementation Example

### User Model (models/User.js)
```javascript
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 6,
    select: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
```

### Authentication Routes (routes/auth.js)
```javascript
const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'your-secret-key', {
    expiresIn: '30d'
  });
};

// Signup
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    // Check if user exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    // Create user
    user = new User({ name, email, password });
    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    // Find user by email and select password
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = generateToken(user._id);

    res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
```

### Update Backend API (backend/api.js)
```javascript
// At the top of api.js, import the auth routes
const authRoutes = require('./routes/auth');

// Add this line after other route imports
app.use('/api/auth', authRoutes);
```

### Required Dependencies

Add these to your `backend/package.json`:

```bash
npm install bcryptjs jsonwebtoken
```

## Frontend Configuration

Create a `.env` file in the `frontend` directory (optional):
```
REACT_APP_API_URL=http://localhost:5000/api
```

## Testing

1. Start the backend server on `http://localhost:5000`
2. Start the frontend development server with `npm start`
3. You should see the login page
4. Try creating a new account with the signup form
5. Try logging in with your credentials
6. You should have access to the dashboard
7. Click the user profile to logout

## Security Notes

1. **HTTPS**: Use HTTPS in production, not HTTP
2. **CORS**: Configure CORS properly in production
3. **JWT Secret**: Use a strong, unique JWT_SECRET environment variable
4. **Password Hashing**: Always hash passwords with bcrypt
5. **Rate Limiting**: Implement rate limiting on auth endpoints
6. **Token Refresh**: Consider implementing token refresh for long-lived sessions
7. **Secure Storage**: Store tokens securely (httpOnly cookies preferred over localStorage in production)

## Next Steps

1. Implement the backend routes as shown above
2. Update your backend API to include the auth routes
3. Test the login/signup flow
4. Add additional features like:
   - Email verification
   - Password reset
   - Social login (Google, GitHub, etc.)
   - Two-factor authentication
