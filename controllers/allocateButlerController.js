const {readFile, writeFile} = require('../helpers/fileOperationHelper');

/*
 * Allocates butler to the client
 */
function allocateButler(request, butlers) {
    let hours = request.hours;
    if (!hours) {
        // Will shop execution of this function if hour is not specified or 0
        return true;
    }
    const butler = butlers.find(butler => butler.butlerId === request.clientId);
    // if the requested butler has the requested hours
    if (butler && butler.availableTime >= hours) {
        butler.availableTime = butler.availableTime - hours;
        butler.clients.push({
            clientId: request.requestId,
            hoursAllocated: hours
        });
        return true;
    } else if (butler && butler.availableTime) {
        // assign partial hours to the requested butler
        const unAllocatedHours = hours - butler.availableTime;
        butler.clients.push({
            clientId: request.requestId,
            hoursAllocated: butler.availableTime
        });
        butler.availableTime = 0;
        if (unAllocatedHours) {
            request.hours = unAllocatedHours;
            return allocateButler(request, butlers);
        }
    } else {
        // assign client to another butler
        let availableButlers = butlers.filter(butler => butler.hours !== 0);
        if (availableButlers.length === 0) {
            console.log('No butler is available at the moment');
            return;
        }
        let availableButler = availableButlers[Math.floor(Math.random() * availableButlers.length)];
        if (availableButler.availableTime >= hours) {
            availableButler.availableTime = availableButler.availableTime - hours;
            availableButler.clients.push({
                clientId: request.requestId,
                hoursAllocated: hours
            });
            return true;
        } else if (availableButler.availableTime) {
            const unAllocatedHours = hours - availableButler.availableTime;
            availableButler.clients.push({
                clientId: request.requestId,
                hoursAllocated: availableButler.availableTime
            });
            availableButler.availableTime = 0;
            if (unAllocatedHours) {
                request.hours = unAllocatedHours;
                return allocateButler(request, butlers);
            }
        }
    }
}

/*
 * A method to allocate butlers to the clients and prepare a report of it
 */
function allocateAndReport(req, res) {
    const clientRequests = req.body.clientRequests;
    readFile('./dataStore/bulters.json', (err, data) => {
        if (err) {
            return res.status(500).send({message: 'An error occurred while writing into file', err});
        }
        let butlers = data;
        let responseObject = {
            butlers: [],
            spreadClientIds: []
        };
        clientRequests.forEach((request) => {
            allocateButler(request, butlers);
        });
        butlers.forEach((butler) => {
            if (butler.clients.length) {
                responseObject.butlers.push({
                    requests: butler.clients.map((client) => client.clientId)
                });
                responseObject.spreadClientIds.push(butler.butlerId);
            }
        });
        writeFile('./dataStore/output.json', JSON.stringify(responseObject), (err) => {
            if (err) {
                console.log('error', err);
                return res.status(500).send({message: 'An error occurred while writing into file', err});
            }
            return res.status(200).send({response: butlers});
        });
    });
}

module.exports = {allocateAndReport};
