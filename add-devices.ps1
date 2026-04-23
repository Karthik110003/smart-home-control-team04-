$devices = @(
    @{
        device_id = "light-001"
        device_type = "light"
        room_location = "Living Room"
        power_consumption = 60
        usage_hours = 8
        label = "Ceiling Light"
        status = $true
    },
    @{
        device_id = "fan-001"
        device_type = "fan"
        room_location = "Living Room"
        power_consumption = 75
        usage_hours = 6
        label = "Ceiling Fan"
        status = $true
    },
    @{
        device_id = "lamp-001"
        device_type = "light"
        room_location = "Living Room"
        power_consumption = 40
        usage_hours = 6
        label = "Floor Lamp"
        status = $false
    },
    @{
        device_id = "ac-001"
        device_type = "ac"
        room_location = "Bedroom"
        power_consumption = 2000
        usage_hours = 5
        label = "Main Thermostat"
        status = $true
    },
    @{
        device_id = "camera-001"
        device_type = "camera"
        room_location = "Living Room"
        power_consumption = 10
        usage_hours = 24
        label = "Security Camera"
        status = $true
    },
    @{
        device_id = "sensor-001"
        device_type = "sensor"
        room_location = "Living Room"
        power_consumption = 5
        usage_hours = 24
        label = "Motion Sensor"
        status = $true
    }
)

foreach ($device in $devices) {
    $body = $device | ConvertTo-Json
    try {
        Invoke-WebRequest -Uri "http://localhost:5000/api/devices" `
          -Method POST `
          -Headers @{"Content-Type"="application/json"} `
          -Body $body `
          -UseBasicParsing | Out-Null
        Write-Host "[OK] Added: $($device.label)"
    } catch {
        Write-Host "[ERROR] Failed to add $($device.label)"
    }
}
