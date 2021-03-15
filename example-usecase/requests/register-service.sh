# Register a service using the Agent interface
curl --location --request POST 'localhost:9997/api/registration' \
--header 'Content-Type: application/json' \
--data-raw '{
    "name": "my-test-service",
    "type": "core:Service",
    "adapterId": "my-service-id-in-my-infrastructure"
}'