# Platform registrations

## Add new interactions

An interaction is a property, event or action.

You can create interactions following the examples in docs folder. 

E.g: Properties: Create an array of properties and place the file with properties.json name in the agent/imports folder. Then call the endpoint GET host:port/api/import/properties. Your properties will be loaded in the adapter and you will be able to use them for your registrations.

## Register

* Create a JSON following the example in registration.example.
   1. The arrays with properties, events and actions contain pid/aid/eid, these are the names/ids you give to the interactions that you created. (See section above)
   2. The credentials generated will be stored in the agent and can be seen here:  GET host:port/api/registrations
* Send the JSON to the endpoint POST host:port/agent/registration

## Unregister

Send an array of oids as the example in registration.example. The endpoint to use is: POST host:port/agent/registration/remove

You can see all your registered oid in GET host:port/api/registrations

## Mappers

Using the file mapper.json, it is possible to set which properties have to be requested every X seconds and which events need to be subscribed.
The file mappers.json accepts an array on JSONs which should specificy:

* OID of the remote object
* Interaction type: event or property
* Interaction id: eid or pid

The agent module will take care to initialize the channels or collect the properties. 

#### Configuration info

* The frequency of properties collection is defined in .env ADAPTER_TIMER_INTERVAL.
* The OID of the service used for data collection credentials can be found in .env ADAPTER_SERVICE_OID. (You need to register this service)

