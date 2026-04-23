/**
 * Sample data for testing the Smart Home Control Center
 * You can use these curl commands to populate your database with test devices
 */

// Sample Devices Data

const sampleDevices = [
  // Living Room Devices
  {
    device_id: "light-living-001",
    device_type: "light",
    room_location: "Living Room",
    power_consumption: 60,
    usage_hours: 8.5,
    label: "Main Light"
  },
  {
    device_id: "fan-living-001",
    device_type: "fan",
    room_location: "Living Room",
    power_consumption: 75,
    usage_hours: 6,
    label: "Ceiling Fan"
  },

  // Bedroom Devices
  {
    device_id: "ac-bedroom-001",
    device_type: "ac",
    room_location: "Bedroom",
    power_consumption: 2000,
    usage_hours: 7,
    label: "AC Unit"
  },
  {
    device_id: "light-bedroom-001",
    device_type: "light",
    room_location: "Bedroom",
    power_consumption: 40,
    usage_hours: 5,
    label: "Bedroom Light"
  },
  {
    device_id: "sensor-bedroom-001",
    device_type: "sensor",
    room_location: "Bedroom",
    power_consumption: 5,
    usage_hours: 24,
    label: "Temperature Sensor"
  },

  // Kitchen Devices
  {
    device_id: "ac-kitchen-001",
    device_type: "ac",
    room_location: "Kitchen",
    power_consumption: 1800,
    usage_hours: 6,
    label: "Kitchen AC"
  },
  {
    device_id: "light-kitchen-001",
    device_type: "light",
    room_location: "Kitchen",
    power_consumption: 80,
    usage_hours: 4.5,
    label: "Kitchen Light"
  },
  {
    device_id: "camera-kitchen-001",
    device_type: "camera",
    room_location: "Kitchen",
    power_consumption: 10,
    usage_hours: 10,
    label: "Security Camera"
  }
];

/**
 * cURL commands to add sample devices
 * Run these commands one by one to populate your database
 */

/*
# Add Living Room Light
curl -X POST http://localhost:5000/api/devices \
  -H "Content-Type: application/json" \
  -d '{
    "device_id": "light-living-001",
    "device_type": "light",
    "room_location": "Living Room",
    "power_consumption": 60,
    "usage_hours": 8.5,
    "label": "Main Light"
  }'

# Add Living Room Fan
curl -X POST http://localhost:5000/api/devices \
  -H "Content-Type: application/json" \
  -d '{
    "device_id": "fan-living-001",
    "device_type": "fan",
    "room_location": "Living Room",
    "power_consumption": 75,
    "usage_hours": 6,
    "label": "Ceiling Fan"
  }'

# Add Bedroom AC
curl -X POST http://localhost:5000/api/devices \
  -H "Content-Type: application/json" \
  -d '{
    "device_id": "ac-bedroom-001",
    "device_type": "ac",
    "room_location": "Bedroom",
    "power_consumption": 2000,
    "usage_hours": 7,
    "label": "AC Unit"
  }'

# Add Bedroom Light
curl -X POST http://localhost:5000/api/devices \
  -H "Content-Type: application/json" \
  -d '{
    "device_id": "light-bedroom-001",
    "device_type": "light",
    "room_location": "Bedroom",
    "power_consumption": 40,
    "usage_hours": 5,
    "label": "Bedroom Light"
  }'

# Add Bedroom Sensor
curl -X POST http://localhost:5000/api/devices \
  -H "Content-Type: application/json" \
  -d '{
    "device_id": "sensor-bedroom-001",
    "device_type": "sensor",
    "room_location": "Bedroom",
    "power_consumption": 5,
    "usage_hours": 24,
    "label": "Temperature Sensor"
  }'

# Add Kitchen AC
curl -X POST http://localhost:5000/api/devices \
  -H "Content-Type: application/json" \
  -d '{
    "device_id": "ac-kitchen-001",
    "device_type": "ac",
    "room_location": "Kitchen",
    "power_consumption": 1800,
    "usage_hours": 6,
    "label": "Kitchen AC"
  }'

# Add Kitchen Light
curl -X POST http://localhost:5000/api/devices \
  -H "Content-Type: application/json" \
  -d '{
    "device_id": "light-kitchen-001",
    "device_type": "light",
    "room_location": "Kitchen",
    "power_consumption": 80,
    "usage_hours": 4.5,
    "label": "Kitchen Light"
  }'

# Add Kitchen Camera
curl -X POST http://localhost:5000/api/devices \
  -H "Content-Type: application/json" \
  -d '{
    "device_id": "camera-kitchen-001",
    "device_type": "camera",
    "room_location": "Kitchen",
    "power_consumption": 10,
    "usage_hours": 10,
    "label": "Security Camera"
  }'

*/
