# Check which devices and services have been registered using your gateway credentials
# You will receive an array with the object descriptions of each item
curl --location --request GET 'localhost:9997/api/registration'