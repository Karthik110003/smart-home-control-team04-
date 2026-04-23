# Smart Home Control Center

A comprehensive full-stack web application for managing smart home devices, team members, scenes, and automations with intelligent device clustering analysis.

## 🌟 Features

### Frontend (React.js)
- **Device Dashboard**: Monitor and control smart home devices (lights, fans, AC, cameras, sensors)
- **Room-based Organization**: Devices grouped by rooms with clickable room cards to view room-specific devices
- **Real-time Device Control**: Turn devices ON/OFF and view status with instant feedback
- **Energy Monitoring**: Track power consumption and usage hours
- **Cluster Analysis Visualization**: Visual representation of device clusters using charts
- **Device Management**: Add, update, and delete devices
- **Team Member Management**: 
  - Add and manage team members with profile photos
  - View member details and information
  - Centralized member directory
- **Scene Management**:
  - Create custom scenes with selected devices
  - Activate/Deactivate scenes with visual feedback (pop-up notifications)
  - Separate Activate and Deactivate buttons
- **Automations**: Set up automatic device triggers and routines
- **Clean UI**: Modern, responsive design with smooth animations

### Backend (Node.js + Express)
- **RESTful APIs**: Complete CRUD operations for devices, users, members, scenes, and automations
- **Device Management**: Add, retrieve, update, and delete smart home devices
- **User Authentication**: Secure login and signup system
- **Member Management**: Team member profiles with image uploads
- **Scene Management**: Create and manage device scenes
- **Automation System**: Set up and manage device automations
- **Cluster Analysis**: K-Means clustering on device power consumption and usage
- **MongoDB Integration**: Persistent data storage
- **CORS Enabled**: Support for cross-origin requests
- **Error Handling**: Comprehensive error management

### Clustering Features
- **K-Means Algorithm**: Groups devices into 3 clusters based on power consumption and usage hours
- **Automatic Categorization**:
  - High Power Devices
  - Medium Power Devices
  - Low Power Devices
- **Statistical Analysis**: Summary statistics for cluster analysis

## 📋 Project Structure

```
smart-home-control/
├── backend/
│   ├── models/
│   │   ├── Device.js
│   │   ├── User.js
│   │   ├── Member.js
│   │   ├── Scene.js
│   │   ├── Automation.js
│   │   ├── Energy.js
│   │   └── utils/clustering.js
│   ├── routes/
│   │   ├── devices.js
│   │   ├── auth.js
│   │   ├── members.js
│   │   ├── scenes.js
│   │   ├── automations.js
│   │   ├── energy.js
│   │   └── clustering.js
│   ├── middleware/
│   │   └── auth.js
│   ├── uploads/ (for member photos)
│   ├── server.js
│   ├── package.json
│   └── .env
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/
    │   │   ├── Navigation.js
    │   │   ├── DeviceCard.js
    │   │   ├── RoomSection.js
    │   │   ├── AddDeviceForm.js
    │   │   └── Header.js
    │   ├── pages/
    │   │   ├── Dashboard.js
    │   │   ├── Home.js
    │   │   ├── Login.js
    │   │   ├── Signup.js
    │   │   ├── AddDevice.js
    │   │   ├── Members.js
    │   │   ├── MemberDetail.js
    │   │   ├── AddMember.js
    │   │   ├── Scenes.js
    │   │   ├── Automations.js
    │   │   ├── Energy.js
    │   │   ├── RoomManagement.js
    │   │   └── Settings.js
    │   ├── services/
    │   │   ├── api.js
    │   │   └── authService.js
    │   ├── context/
    │   │   └── NotificationContext.js
    │   ├── styles/
    │   ├── App.js
    │   ├── index.js
    │   └── index.css
    └── package.json
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MongoDB (Local or Atlas)

### Installation

#### Step 1: Clone the Repository
```bash
cd c:\Users\Dell\Desktop\preethi\smart-home-control
```

#### Step 2: Setup Backend

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create/Update .env file:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/smart-home-db
NODE_ENV=development
```

For MongoDB Atlas:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/smart-home-db
```

4. Start MongoDB locally (if installed):
```bash
mongod
```

#### Step 3: Setup Frontend

1. Navigate to frontend directory:
```bash
cd ../frontend
```

2. Install dependencies:
```bash
npm install
```

## 🎯 Running the Application

### Start Backend Server
```bash
cd backend
npm start
```
- Backend will run on: `http://localhost:5000`

### Start Frontend Server
```bash
cd frontend
npm start
```
- Frontend will run on: `http://localhost:3000`

## 📡 API Endpoints

### Authentication

#### Sign Up
```
POST /api/auth/signup
Body: {
  name: "User Name",
  email: "user@example.com",
  password: "password123"
}
```

#### Login
```
POST /api/auth/login
Body: {
  email: "user@example.com",
  password: "password123"
}
```

### Device Management

#### Get All Devices
```
GET /api/devices
Response: { success: true, data: [...devices] }
```

#### Get Devices by Room
```
GET /api/devices/room/:room
Example: GET /api/devices/room/Living Room
```

#### Add Device
```
POST /api/devices
Body: {
  device_id: "device-001",
  device_type: "light",  // light, fan, ac, camera, sensor
  room_location: "Living Room",
  power_consumption: 60,  // in watts
  usage_hours: 5.5,
  label: "Main Light"
}
```

#### Update Device
```
PUT /api/devices/:deviceId
Body: {
  status: true,  // turn ON/OFF
  power_consumption: 80,
  usage_hours: 6
}
```

#### Delete Device
```
DELETE /api/devices/:deviceId
```

### Team Members

#### Get All Members
```
GET /api/members
Response: { success: true, data: [...members] }
```

#### Get Member by ID
```
GET /api/members/:id
```

#### Add Member
```
POST /api/members
Body: {
  name: "John Doe",
  rollNumber: "RA2311234567",
  year: "3rd year",
  degree: "BTech",
  aboutProject: "Project description",
  hobbies: "Reading, coding",
  certificate: "Certificate info",
  internship: "Internship details",
  aboutAim: "Career goals"
}
```
(Include image file as multipart/form-data)

#### Update Member
```
PUT /api/members/:id
Body: { ...member fields }
```

#### Delete Member
```
DELETE /api/members/:id
```

### Scenes

#### Get All Scenes
```
GET /api/scenes
Response: { success: true, data: [...scenes] }
```

#### Add Scene
```
POST /api/scenes
Body: {
  name: "Good Morning",
  icon: "🌅",
  color: "#FFD700",
  devices: ["device_id_1", "device_id_2"]
}
```

#### Activate/Deactivate Scene
```
PUT /api/scenes/:id/toggle
```

#### Delete Scene
```
DELETE /api/scenes/:id
```

### Automations

#### Get All Automations
```
GET /api/automations
```

#### Create Automation
```
POST /api/automations
Body: {
  name: "Morning Routine",
  trigger: "time",
  triggerValue: "07:00",
  devices: ["device_id_1"],
  actions: ["turn_on"]
}
```

#### Delete Automation
```
DELETE /api/automations/:id
```

### Energy Monitoring

#### Get Energy Stats
```
GET /api/energy/stats
Response: { success: true, data: { totalUsage, avgConsumption, ... } }
```

### Clustering Analysis

#### Get Cluster Analysis
```
GET /api/clustering/analysis
Response: {
  success: true,
  data: {
    clusters: [
      {
        name: "High Power Devices",
        devices: [...],
        centroid: [power, usage]
      },
      ...
    ],
    summary: {
      totalDevices: 12,
      avgPowerConsumption: 85.5,
      totalUsageHours: 120,
      activeDevices: 5,
      numClusters: 3
    }
  }
}
```

## 🧪 Testing with Sample Data

### Using curl to add sample devices:

```bash
# Add a Light
curl -X POST http://localhost:5000/api/devices \
  -H "Content-Type: application/json" \
  -d '{
    "device_id": "light-001",
    "device_type": "light",
    "room_location": "Living Room",
    "power_consumption": 60,
    "usage_hours": 8
  }'

# Add an AC
curl -X POST http://localhost:5000/api/devices \
  -H "Content-Type: application/json" \
  -d '{
    "device_id": "ac-001",
    "device_type": "ac",
    "room_location": "Bedroom",
    "power_consumption": 2000,
    "usage_hours": 6
  }'

# Add a Fan
curl -X POST http://localhost:5000/api/devices \
  -H "Content-Type: application/json" \
  -d '{
    "device_id": "fan-001",
    "device_type": "fan",
    "room_location": "Kitchen",
    "power_consumption": 75,
    "usage_hours": 4
  }'
```

## 🎨 Features in Detail

### Dashboard Page
- **Stats Overview**: Total devices, active devices, active scenes
- **Quick Scenes**: Quick access to create and activate scenes
- **Room-based Display**: All rooms with device count
  - **Clickable Rooms**: Click any room card to view all devices in that room
  - **Room Modal**: Pop-up showing all devices with ON/OFF controls
- **Device Cards**: Each device shows:
  - Status (ON/OFF button)
  - Device type with emoji icon
  - Room location
  - Power consumption (Watts)
  - Usage hours
  - Delete button

### Team Members Page
- **Member Directory**: Browse all team members in a grid layout
- **Member Profiles**: View full member details including:
  - Profile photo (full-width display)
  - Roll number
  - Year and degree
  - About project, hobbies, internship info
  - Personal aims and achievements
- **Add Members**: Upload new team members with photo
- **Member Management**: Delete member records

### Scenes Management Page
- **Create Scenes**: Add custom scenes with:
  - Scene name
  - Icon selection
  - Color customization
  - Device selection
- **Scene Controls**:
  - **Activate Button** (green): Shows when scene is inactive
  - **Deactivate Button** (orange): Shows when scene is active
  - **Delete Button** (red): Remove scenes
- **Visual Feedback**: Pop-up notification at the top showing:
  - "Mode Activated" when scene is turned on
  - "Mode Deactivated" when scene is turned off

### Automations Page
- Set up automatic device routines and triggers
- Create conditional automations
- View and manage active automations

### Energy Monitoring Page
- Track power consumption across all devices
- View usage statistics and trends
- Energy-saving recommendations

### Room Management
- Create and manage custom rooms
- Organize devices by room
- Room-specific device control

### Cluster Analysis Page
- **Summary Cards**: Key metrics about all devices
- **Bar Charts**: Visual representation of:
  - Number of devices per cluster
  - Average power consumption per cluster
- **Cluster Details**: Breakdown of devices in each cluster category
- **Statistics**: Detailed analysis of device groupings

## 📊 K-Means Clustering Algorithm

The application uses the K-Means algorithm to automatically categorize devices:

1. **Data Preparation**: Extracts power consumption and usage hours for each device
2. **Clustering**: Groups devices into 3 clusters using K-Means
3. **Labeling**: Assigns meaningful names based on average power:
   - **High Power Devices**: AC, high-power appliances
   - **Medium Power Devices**: Standard appliances
   - **Low Power Devices**: Sensors, lights, low-power devices
4. **Analysis**: Provides centroids and statistics for each cluster

## 🔧 Technology Stack

### Frontend
- React 18.2
- React Router DOM
- Axios (HTTP client)
- Chart.js & React-Chartjs-2 (Data visualization)

### Backend
- Node.js
- Express.js
- MongoDB & Mongoose
- ml-kmeans (K-Means clustering)
- CORS (Cross-origin requests)
- dotenv (Environment variables)

## 🛠️ Development Notes

### Adding New Device Types
Edit the Device model in `backend/models/Device.js` enum for `device_type`.

### Modifying Clustering Logic
Update `backend/utils/clustering.js` to change clustering parameters or algorithm.

### Customizing Styles
All CSS is in `frontend/src/styles/` organized by component.

## 📝 API Response Examples

### Successful Device Retrieval
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "device_id": "light-001",
      "device_type": "light",
      "room_location": "Living Room",
      "power_consumption": 60,
      "usage_hours": 8,
      "status": true,
      "label": "Main Light",
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

### Successful Cluster Analysis
```json
{
  "success": true,
  "data": {
    "clusters": [
      {
        "name": "High Power Devices",
        "devices": [...],
        "centroid": [1800, 5.5]
      }
    ],
    "summary": {
      "totalDevices": 12,
      "avgPowerConsumption": 85.5,
      "totalUsageHours": 120,
      "activeDevices": 5,
      "numClusters": 3
    }
  }
}
```

## 🐛 Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running: `mongod`
- Check MONGODB_URI in .env file
- For MongoDB Atlas, verify IP whitelist and credentials

### Frontend Can't Connect to Backend
- Ensure backend is running on port 5000
- Check proxy setting in `frontend/package.json`
- Verify CORS is enabled in backend

### Port Already in Use
- Change PORT in .env for backend
- Use `npm start -- --port 3001` for frontend

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

For issues and questions, please create an issue in the repository.
