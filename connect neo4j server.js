var express = require("express"),
    path = require("path"),
    http = require('http'),
    app = express(),
    request = require("request-promise"),
    auth = 'bmVvNGo6YW5kcmU=';

var neo4j = module.exports = {
    neo4jServerInformations: function () {
        var options = {
            uri: 'http://localhost:7474/db/data/',
            method: 'GET',
            headers: {
                'Accept': 'application/json; charset=UTF-8',
                'Content-Type': 'application/json',
                'Authorization': auth
            }
        };
        return request(options);
    },
    statements: function (statement) {
        //console.log(statement);
        var options = {
            uri: 'http://localhost:7474/db/data/transaction/commit',
            method: 'POST',
            headers: {
                'Accept': 'application/json; charset=UTF-8',
                'Content-Type': 'application/json',
                'Authorization': auth
            },
            body: statement
        };
    return request(options);
    },
    query: function (query) {
        var options = {
            uri: 'http://localhost:7474/db/data/cypher',
            method: 'POST',
            headers: {
                'Accept': 'application/json; charset=UTF-8',
                'Content-Type': 'application/json',
                'Authorization': auth
            },
            body: query
        };
    return request(options, function (err, body) {
            //console.log('body: '+JSON.stringify(body));
            console.log('erro: '+err);
        });
    },
}