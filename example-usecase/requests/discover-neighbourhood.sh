# Find which other services and devices can your service access
read -p "Enter service OID: "
OID=$REPLY
curl --location --request GET 'localhost:9997/api/discovery/'${OID}