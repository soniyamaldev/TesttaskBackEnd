It is the backend for the butler allocator test task.
The server will run on port(3030).

## Installation

```bash
npm install
```

## Run server

```bash
npm start
```

## Routes

#### /health-check:
This GET route checks status of the server


#### /allocate-bulters:
This POST route allocates butlers to the clients
requests.body:-
```$xslt
{
	"clientRequests": [
		{
			"clientId": 1,
    		"requestId": "aaa",
    		"hours": 6
		},
		{
    		"clientId": 2,
    		"requestId": "bbb",
    		"hours": 1
		}
    ]
}
```
