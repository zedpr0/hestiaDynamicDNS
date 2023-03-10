# HestiaCP Dynamic DNS Updater

Quite a simple concept, a node express app that acts like middleware to interface with your HestiaCP server and pass along the query parameters to the HestiaCP API. So that you can update a dns record in your server by running a GET request.

## How to use?

Place a GET request to the app with basic auth which should be an authorised account that can access the HestiaCP API. Include the required query parameters listed below.

## Supported Query Parameters

### Required:

- hostname="HestiaCP Hostname"
- port="HestiaCP Hostname"
- user="HestiaCP user of dns record"
- domain="Domain that you want to update"
- id="ID of dns record"
- record="Record that you want to update"
- type="Type of dns record"

### Optional:

- ip="value for the dns record, will try to get record from header, will throw error if cant identify IP address"
- priority="Priority of dns record, defaults to empty string"
- restartDNSServer="option to restart dns server, defaults to yes"
- ttl="Time to live for the record, defaults for 60 seconds"

### Example: 
https://appdomain.com?hostname=hestiaserver.com&port=8083&user=test&domain=test&id=28&record=dynamic&type=A

### Notes:

Remember to include localhost or whatever ip you run the app from in the API whitelist inside the settings for HestiaCP.