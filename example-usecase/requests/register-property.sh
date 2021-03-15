# Register a property in your Agent
# These properties are then used to simplify the process of registration of devices and services
curl --location --request POST 'localhost:9997/admin/properties' \
--header 'Content-Type: application/json' \
--data-raw '{
    "pid": "batteryLevel",
    "monitors": "adapters:ActualBatteryStateOfCharge",
    "read_link": {
        "href": "/device/{oid}/property/{pid}",
        "output": {
            "type": "object",
            "field": [
                {
                    "name": "property",
                    "schema": {
                        "type": "string"
                    }
                },
                {
                    "name": "description",
                    "schema": {
                        "type": "string"
                    }
                },
                {
                    "name": "value",
                    "predicate": "core:value",
                    "schema": {
                        "type": "integer"
                    }
                },
                {
                    "name": "time",
                    "predicate": "core:timestamp",
                    "schema": {
                        "type": "integer"
                    }
                }
            ]
        }
    }
}'