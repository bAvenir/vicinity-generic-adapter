# Access data from a remote (or local) device using your service
read -p "Enter service OID: "
S_OID=$REPLY
read -p "Enter device OID: "
D_OID=$REPLY
curl --location --request GET 'localhost:9997/api/properties/'${S_OID}'/'${D_OID}'/batteryLevel'