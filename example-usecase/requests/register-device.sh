# Register a device using the Agent interface
curl --location --request POST 'localhost:9997/api/registration' \
--header 'Content-Type: application/json' \
--data-raw '{
    "name": "my-test-device",
    "type": "adapters:IndoorClimateQualitySensor",
    "adapterId": "my-device-id-in-my-infrastructure",
    "properties": ["batteryLevel"]
}'