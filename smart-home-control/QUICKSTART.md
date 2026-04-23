# Smart Home Control Center - Quick Start Guide

## 📦 Prerequisites
- Node.js (v14+) and npm installed
- MongoDB installed locally or MongoDB Atlas account
- Git (optional)

## 🚀 Quick Start (Windows)

### Step 1: Start MongoDB
```powershell
# If MongoDB is installed locally, open a PowerShell terminal and run:
mongod
```

### Step 2: Install Backend Dependencies
```powershell
cd backend
npm install
```

### Step 3: Start Backend Server
```powershell
# Still in the backend folder
npm start
```
You should see: `✓ Server running on port 5000`

### Step 4: Install Frontend Dependencies (New Terminal)
```powershell
cd frontend
npm install
```

### Step 5: Start Frontend Server
```powershell
# Still in the frontend folder
npm start
```
The app will automatically open at `http://localhost:3000`

## 📝 Adding Sample Data

Once both servers are running, add some test devices using PowerShell:

```powershell
# Add a Light Device
$body = @{
    device_id = "light-001"
    device_type = "light"
    room_location = "Living Room"
    power_consumption = 60
    usage_hours = 8
    label = "Main Light"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:5000/api/devices" `
  -Method POST `
  -Headers @{"Content-Type"="application/json"} `
  -Body $body

# Add an AC Device
$body = @{
    device_id = "ac-001"
    device_type = "ac"
    room_location = "Bedroom"
    power_consumption = 2000
    usage_hours = 6
    label = "Bedroom AC"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:5000/api/devices" `
  -Method POST `
  -Headers @{"Content-Type"="application/json"} `
  -Body $body
```

## 🎯 Main Features to Try

1. **Dashboard**: View all devices grouped by rooms
2. **Device Control**: Click ON/OFF buttons to toggle device status
3. **Add Device**: Create new devices with the Add Device form
4. **Cluster Analysis**: See AI-powered clustering of devices by power consumption
5. **Energy Monitoring**: Track power usage across all devices

## 🔧 Troubleshooting

### MongoDB Connection Failed
- Check if `mongod` is running
- Verify MONGODB_URI in `/backend/.env`
- For MongoDB Atlas, ensure IP is whitelisted

### Frontend shows "Failed to fetch devices"
- Ensure backend is running on http://localhost:5000
- Check browser console (F12) for specific error messages
- Verify CORS is enabled in backend

### Port 5000 or 3000 already in use
- Change PORT in `.env` file for backend
- Use `npm start -- --port 3001` for frontend

## 📧 API Documentation
See the main README.md for complete REST API documentation and curl examples.

## 🎨 Customization

### Change UI Colors
Edit CSS files in `frontend/src/styles/`:
- `index.css` - Global styles
- `Navigation.css` - Header colors
- `Dashboard.css` - Dashboard theme

### Add New Device Type
1. Edit `backend/models/Device.js` - Update device_type enum
2. Edit `frontend/components/DeviceCard.js` - Add emoji icon
3. Edit `frontend/components/AddDeviceForm.js` - Add to dropdown

### Modify Clustering Algorithm
Edit `backend/utils/clustering.js` to change K-Means parameters

## 📚 File Structure
```
smart-home-control/
├── backend/           # Express.js REST API
│   ├── models/        # MongoDB schemas
│   ├── routes/        # API endpoints
│   └── utils/         # Clustering logic
├── frontend/          # React.js application
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API client
│   │   └── styles/        # CSS styling
│   └── public/        # Static files
├── README.md          # Full documentation
└── QUICKSTART.md      # This file
```

## 💡 Tips

- Use the **Cluster Analysis** page to view device insights
- Try toggling device status multiple times to see the active device count update
- Add devices with different power consumptions to see interesting clustering results
- The app works best with 5-10 devices across all rooms

## 🆘 Need Help?

1. Check MongoDB is running: Open another terminal and run `mongod`
2. Check backend is running: Visit http://localhost:5000 in browser (should see API info)
3. Check frontend is running: Visit http://localhost:3000 in browser
4. Check browser console for errors: Press F12 and look at Console tab

## ✨ That's It!

You now have a fully functional Smart Home Control Center running locally!

Happy smart home controlling! 🏠
