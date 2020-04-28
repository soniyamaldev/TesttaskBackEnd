'use strict';

const fs = require('fs');

/*
 * Reads from specific file
 */
function readFile(path, callback) {
    fs.readFile(path, (err, data) => {
        if (err) {
            return callback(new Error('There was an error while reading the file'));
        }
        return callback(null, JSON.parse(data));
    });
}

/*
 * Writes into specific file
 */
function writeFile(path, data, callback) {
    fs.writeFile(path, data, (err) => {
        if (err) {
            console.log('error', err);
            return callback(new Error('There was an error while writing into the file'));
        }
        return callback();
    });
}

module.exports = {readFile, writeFile};
