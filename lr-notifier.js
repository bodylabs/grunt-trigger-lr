// Copyright (c) 2014, Body Labs, Inc.
// All rights reserved.
//
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions
// are met:
//
// 1. Redistributions of source code must retain the above copyright
// notice, this list of conditions and the following disclaimer.
//
// 2. Redistributions in binary form must reproduce the above copyright
// notice, this list of conditions and the following disclaimer in the
// documentation and/or other materials provided with the distribution.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
// "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
// LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS
// FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
// COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
// INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING,
// BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS
// OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED
// AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT
// LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY
// WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
// POSSIBILITY OF SUCH DAMAGE.

'use strict';

var request = require('request');

// attrs
//  |- scheme: 
//  |- host: 
//  |- port: 
//
var LRNotifier = function (attrs) {
    attrs = attrs || {};

    var scheme = attrs.scheme ? attrs.scheme : 'http',
        host = attrs.host ? attrs.host : 'localhost',
        port = attrs.port ? attrs.port : 35729;

    this.uri = scheme + '://' + host + ':' + port + '/changed';
};

// In case of error, callback receives an object:
//
// err
//  |- message:
//  |- detail:
//
// In case of success, callback receives null.
LRNotifier.prototype.trigger = function (files, callback) {

    var notifier = this;

    if (files === null) {
        // Reload everything
        files = ['*'];
    }

    var options = {
        method: 'post',
        uri: this.uri,
        body: { files: files },
        json: true,
    };

    request(options, function (error, response, body) {

        if (error) {

            callback({
                message: 'Error triggering live reload to ' + notifier.uri,
                detail: error,
            });

        } else if (response.statusCode !== 200) {

            callback({
                message: 'Error triggering live reload to ' + notifier.uri,
                detail: JSON.stringify(body),
            });

        } else {

            callback(null);
            
        }
    });
};

module.exports = LRNotifier;
